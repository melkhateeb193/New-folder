import * as Utils from "./../../utils/index.js";
import * as dbService from "../../utils/dbService/dbService.js";
import { companyModel, userModel } from "../../DB/models/index.js";
import { AppError } from "./../../utils/errorHandling/index.js";

/********************************************************************************/

export const updateUser = Utils.asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { mobileNumber, DOB, firstName, lastName, Gender } = req.body;
  if (mobileNumber) {
    user.mobileNumber = mobileNumber;
  }
  if (DOB) {
    user.DOB = DOB;
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (Gender) {
    user.gender = Gender;
  }
  await user.save();

  return res.status(200).json({ message: "Done", user });
});

/********************************************************************************/

export const getUserData = Utils.asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel,
    filter: {
      _id: req.user._id,
      isConfirmed: true,
      isDeleted: { $exists: false },
    },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ message: "Done", user });
});

/********************************************************************************/

export const shareProfile = Utils.asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId.toString() === req.user._id.toString()) {
    return next(new AppError("Cannot share your own profile", 401));
  }

  const user = await dbService.findOne({
    model: userModel,
    filter: {
      _id: userId,
      isConfirmed: true,
      isDeleted: { $exists: false },
    },
    select: "userName mobileNumber profilePic.secure_url coverPic.secure_url",
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ message: "Done", user });
});

/********************************************************************************/

export const updatePassword = Utils.asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const user = req.user;
  user.password = newPassword;
  user.changeCredentialTime = new Date();
  await user.save();
  return res.status(200).json({ message: "Done" });
});

/********************************************************************************/

export const uploadProfilePic = Utils.asyncHandler(async (req, res, next) => {
  const image = req.file.path;
  if (!image) {
    return next(new AppError("No image uploaded", 404));
  }
  const user = req.user;
  const profilePic = await Utils.uploadFileCloudinary({
    source: image,
    name: user.firstName,
    email: user.email,
    nameOfFolder: "profilePic",
    resource_type: "image",
    overwrite: true,
  });

  const updatedUser = await dbService.findByIdAndUpdate({
    model: userModel,
    id: user._id,
    update: {
      $set: {
        profilePic: {
          secure_url: profilePic.secure_url,
          public_id: profilePic.public_id,
        },
      },
    },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updatedUser });
});

/********************************************************************************/

export const uploadCoverPic = Utils.asyncHandler(async (req, res, next) => {
  const image = req.file.path;
  if (!image) {
    return next(new AppError("No image uploaded", 404));
  }
  const user = req.user;
  const coverPic = await Utils.uploadFileCloudinary({
    source: image,
    name: user.firstName,
    email: user.email,
    nameOfFolder: "coverPic",
    resource_type: "image",
    overwrite: true,
  });

  const updatedUser = await dbService.findByIdAndUpdate({
    model: userModel,
    id: user._id,
    update: {
      $set: {
        coverPic: {
          secure_url: coverPic.secure_url,
          public_id: coverPic.public_id,
        },
      },
    },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updatedUser });
});

/********************************************************************************/

export const deleteProfilePic = Utils.asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;
  const user = req.user;
  if (public_id !== user.profilePic.public_id) {
    return next(new AppError("No profile picture found", 404));
  }

  if (!(await Utils.deleteOneFileCloudinary({ publicId: public_id }))) {
    return next(new AppError("Failed to delete profile picture", 500));
  }

  const updatedUser = await dbService.findByIdAndUpdate({
    model: userModel,
    id: user._id,
    update: { $unset: { profilePic: "" } },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updatedUser });
});

/********************************************************************************/

export const deleteCoverPic = Utils.asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;
  const user = req.user;
  if (public_id !== user.coverPic.public_id) {
    return next(new AppError("No profile picture found", 404));
  }

  if (!(await Utils.deleteOneFileCloudinary({ publicId: public_id }))) {
    return next(new AppError("Failed to delete profile picture", 500));
  }

  const updatedUser = await dbService.findByIdAndUpdate({
    model: userModel,
    id: user._id,
    update: { $unset: { coverPic: "" } },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", updatedUser });
});

/********************************************************************************/

export const softDeleteAccount = Utils.asyncHandler(async (req, res, next) => {
  const user = req.user;
  user.isDeleted = true;
  await user.save();
  return res.status(200).json({ message: "Done" });
});
