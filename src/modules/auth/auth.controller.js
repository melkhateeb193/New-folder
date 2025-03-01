import { Router } from "express";
import * as middleWares from "../../middlewares/index.js";
import * as AS from "./auth.service.js";
import * as AV from "./auth.validation.js";

export const authRouter = Router();

authRouter.post(
  "/signUp",
  middleWares.multerCloud(middleWares.fileFormat.image).fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  middleWares.validation(AV.SignUpSchema),
  AS.signUp
);

/********************************************************************************/

authRouter.post(
  "/sendConfirmEmail",
  middleWares.validation(AV.otpSchema),
  AS.sendOtpEmailConfirmation
);

/********************************************************************************/

authRouter.post(
  "/confirmEmail",
  middleWares.validation(AV.confirmEmailSchema),
  AS.confirmEmail
);

/********************************************************************************/

authRouter.post(
  "/sendNewOtpConfirmEmail",
  middleWares.validation(AV.sendNewOtpConfirmEmailSchema),
  AS.sendOtpEmailConfirmation
);

/********************************************************************************/

authRouter.post(
  "/forgetPassword",
  middleWares.validation(AV.otpSchema),
  AS.forgetPassword
);

/********************************************************************************/

authRouter.post(
  "/resetPassword",
  middleWares.validation(AV.resetPasswordSchema),
  AS.resetPassword
);

/********************************************************************************/

authRouter.post("/signIn", middleWares.validation(AV.signInSchema), AS.signIn);

/********************************************************************************/

authRouter.post(
  "/loginWithGoogle",
  middleWares.validation(AV.LoginGoogleSchema),
  AS.LoginGoogle
);

/********************************************************************************/

authRouter.post(
  "/refreshToken",
  middleWares.validation(AV.refreshTokenSchema),
  AS.refreshToken
);
