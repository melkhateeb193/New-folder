import { Router } from "express";
import * as middleWares from "./../../middlewares/index.js";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";

export const userRouter = Router();

/********************************************************************************/

userRouter.post(
  "/update",
  middleWares.authentication,
  middleWares.validation(UV.updateUserSchema),
  US.updateUser
);

/********************************************************************************/

userRouter.post("/userData", middleWares.authentication, US.getUserData);

/********************************************************************************/

userRouter.get(
  "/shareProfile/:userId",
  middleWares.authentication,
  middleWares.validation(UV.shareProfileSchema),
  US.shareProfile
);

/********************************************************************************/

userRouter.post(
  "/updatePassword",
  middleWares.authentication,
  middleWares.validation(UV.updatePasswordSchema),
  US.updatePassword
);

/********************************************************************************/

userRouter.post(
  "/uploadProfilePic",
  middleWares.multerCloud(middleWares.fileFormat.image).single("image"),
  middleWares.authentication,
  middleWares.validation(UV.uploadImgSchema),
  US.uploadProfilePic
);

/********************************************************************************/

userRouter.post(
  "/uploadCoverPic",
  middleWares.multerCloud(middleWares.fileFormat.image).single("image"),
  middleWares.authentication,
  middleWares.validation(UV.uploadImgSchema),
  US.uploadCoverPic
);

/********************************************************************************/

userRouter.delete(
  "/deleteProfilePic",
  middleWares.authentication,
  middleWares.validation(UV.publicIdSchema),
  US.deleteProfilePic
);

/********************************************************************************/

userRouter.delete(
  "/deleteCoverPic",
  middleWares.authentication,
  middleWares.validation(UV.publicIdSchema),
  US.deleteCoverPic
);
