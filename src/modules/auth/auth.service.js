import { OAuth2Client } from "google-auth-library";
import cron from "node-cron";
import * as Utils from "../../utils/index.js";
import * as dbService from "../../utils/dbService/dbService.js";
import {
  userModel,
  otpTypes,
  providerTypes,
  roles,
  tokenTypes,
} from "../../DB/models/index.js";
import { emailEmitter } from "../../service/sendEmail.js";
import { AppError } from "../../utils/errorHandling/index.js";
import { decodedToken } from "../../middlewares/auth.js";

/********************************************************************************/

export const signUp = Utils.asyncHandler(async (req, res, next) => {
  const { firstName, email } = req.body;

  if (await dbService.findOne({ model: userModel, filter: { email } })) {
    return next(new AppError("Email already exists", 400));
  }
  let profilePic = {};
  let coverPic = {};

  if (req.files?.profilePic) {
    profilePic = await Utils.uploadFileCloudinary({
      source: req.files.profilePic[0].path,
      name: firstName,
      email,
      nameOfFolder: "profilePic",
      resource_type: "image",
    });
  }

  if (req.files?.coverPic) {
    coverPic = await Utils.uploadFileCloudinary({
      source: req.files.coverPic[0].path,
      name: firstName,
      email,
      nameOfFolder: "coverPic",
      resource_type: "image",
    });
  }

  const user = new userModel({ ...req.body });
  await user.save();
  emailEmitter.emit("sendEmailConfirmation", { name: firstName, email });

  return res.status(200).json({ message: "Done", user });
});

/********************************************************************************/

export const sendOtpEmailConfirmation = Utils.asyncHandler(
  async (req, res, next) => {
    const { email } = req.body;
    const user = await dbService.findOne({
      model: userModel,
      filter: { email, isConfirmed: false, isDeleted: { $exists: false } },
    });
    if (!user) {
      return next(
        new AppError("User not found or account has been deleted", 401)
      );
    }
    const otp = user.otp.find(
      (otp) => otp.type === otpTypes.confirmEmail && otp.expiresIn > new Date()
    );

    if (!otp || otp.expiresIn < new Date()) {
      emailEmitter.emit("sendEmailConfirmation", {
        name: user.firstName,
        email,
      });
      return res.status(200).json({ message: "OTP sent successfully" });
    }
    return res.status(200).json({ message: "OTP has not expires yet " });
  }
);

/********************************************************************************/

export const confirmEmail = Utils.asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await dbService.findOne({
    model: userModel,
    filter: { email, isConfirmed: false, isDeleted: { $exists: false } },
  });
  if (!user) {
    return next(
      new AppError("User not found or account has been deleted", 401)
    );
  }
  const otp = user.otp.find(
    (otp) => otp.type === otpTypes.confirmEmail && otp.expiresIn > new Date()
  );

  if (!otp || otp.expiresIn < new Date()) {
    return next(new AppError("Invalid OTP or expired", 401));
  }
  const match = await Utils.Compare({
    key: code,
    hash: otp.code,
  });
  if (!match) {
    return next(new AppError("Invalid OTP", 401));
  }

  user.isConfirmed = true;
  user.otp.pop(otp);
  await user.save();

  return res.status(200).json({ message: "Done" });
});

/********************************************************************************/

export const signIn = Utils.asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await dbService.findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: true,
      isDeleted: { $exists: false },
      provider: providerTypes.system,
    },
  });
  if (!user) {
    return next(
      new AppError("User not found or account has been deleted", 401)
    );
  }
  if (
    !(await Utils.Compare({
      key: password,
      hash: user.password,
    }))
  ) {
    return next(new AppError("Invalid password", 401));
  }

  const accessToken = await Utils.generateToken({
    payload: {
      email,
      id: user._id,
    },
    signature:
      user.role == roles.user
        ? process.env.ACCESS_SIGNATURE_USER
        : process.env.ACCESS_SIGNATURE_ADMIN,
    options: {
      expiresIn: "1h",
    },
  });

  const refreshToken = await Utils.generateToken({
    payload: {
      email,
      id: user._id,
    },
    signature:
      user.role == roles.user
        ? process.env.ACCESS_SIGNATURE_USER
        : process.env.ACCESS_SIGNATURE_ADMIN,
    options: {
      expiresIn: "7d",
    },
  });
  user.passwordChangedAt = Date.now();
  await user.save();

  return res.status(200).json({ message: "Done", accessToken, refreshToken });
});

/********************************************************************************/

export const LoginGoogle = Utils.asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email, email_verified, picture, name } = await verify();
  let user = await dbService.findOne({ model: userModel, filter: { email } });
  if (!user) {
    user = await dbService.create({
      model: userModel,
      query: {
        name,
        email,
        image: picture,
        confirmed: email_verified,
        provider: providerTypes.google,
      },
    });
  }
  if (user.provider != providerTypes.google) {
    return next(new Error("login with in system", { cause: 401 }));
  }
  const access_token = await Utils.generateToken({
    payload: {
      email,
      id: user._id,
    },
    signature:
      user.role == roles.user
        ? process.env.SIGNATURE_TOKEN_USER
        : process.env.SIGNATURE_TOKEN_ADMIN,
    options: {
      expiresIn: "1d",
    },
  });
  return res.status(200).json({ message: "Done", access_token });
});

/********************************************************************************/

export const forgetPassword = Utils.asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await dbService.findOne({
    model: userModel,
    filter: { email, isConfirmed: true, isDeleted: { $exists: false } },
  });
  if (!user) {
    return next(
      new AppError("User not found or account has been deleted", 401)
    );
  }
  const otp = user.otp.find(
    (otp) => otp.type === otpTypes.forgetPassword && otp.expiresIn > new Date()
  );

  if (!otp || otp.expiresIn < new Date()) {
    emailEmitter.emit("forgetPassword", {
      name: user.firstName,
      email,
    });
    return res.status(200).json({ message: "OTP sent successfully" });
  }
  return res.status(200).json({ message: "OTP has not expires yet " });
});

/********************************************************************************/

export const resetPassword = Utils.asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  const user = await dbService.findOne({
    model: userModel,
    filter: { email, isConfirmed: true, isDeleted: { $exists: false } },
  });
  if (!user) {
    return next(
      new AppError("User not found or account has been deleted", 401)
    );
  }

  const otp = user.otp.find(
    (otp) => otp.type === otpTypes.forgetPassword && otp.expiresIn > new Date()
  );

  if (!otp || otp.expiresIn < new Date()) {
    return next(new AppError("Invalid OTP or expired", 401));
  }
  const match = await Utils.Compare({
    key: code,
    hash: otp.code,
  });
  if (!match) {
    return next(new AppError("Invalid OTP", 401));
  }

  user.otp.pop(otp);
  user.changeCredentialTime = new Date();
  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Done" });
});

/********************************************************************************/

export const refreshToken = Utils.asyncHandler(async (req, res, next) => {
  const { authorization } = req.body;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.refresh,
    next,
  });
  const access_token = await Utils.generateToken({
    payload: {
      email: user.email,
      id: user._id,
    },
    signature:
      user.role == roles.user
        ? process.env.ACCESS_SIGNATURE_USER
        : process.env.ACCESS_SIGNATURE_ADMIN,
    options: {
      expiresIn: "1h",
    },
  });

  return res.status(200).json({ message: "Done", access_token });
});

/********************************************************************************/
cron.schedule("0 */6 * * *", async () => {
  await userModel.updateMany(
    { "otp.expiresIn": { $lt: Date.now() } },
    { $unset: { otp: "" } }
  );
  console.log("Expired OTPs deleted.");
});
