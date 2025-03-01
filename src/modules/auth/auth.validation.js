import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { gender, roles } from "../../DB/models/index.js";

/********************************************************************************/

export const SignUpSchema = {
  body: joi.object({
    firstName: joi.string().alphanum().min(3).max(50).required(),
    lastName: joi.string().alphanum().min(3).max(50).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("password")).required(),
    gender: joi
      .string()
      .valid(...Object.values(gender))
      .required(),
    DOB: joi.date().required(),
    mobileNumber: joi
      .string()
      .regex(/^01[0125][0-9]{8}$/)
      .required(),
    role: joi.string().valid(...Object.values(roles)),
  }),
  files: joi.object({
    profilePic: joi.array().items(generalRules.file),
    coverPic: joi.array().items(generalRules.file),
  }),
};

/********************************************************************************/

export const otpSchema = {
  body: joi.object({
    email: generalRules.email.required(),
  }),
};

/********************************************************************************/

export const confirmEmailSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    code: joi.string().length(5).required(),
  }),
};

/********************************************************************************/

export const sendNewOtpConfirmEmailSchema = {
  body: joi.object({
    email: generalRules.email.required(),
  }),
};

/********************************************************************************/

export const signInSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};

/********************************************************************************/

export const LoginGoogleSchema = {
  body: joi.object({
    idToken: joi.string().required(),
  }),
};

/********************************************************************************/

export const resetPasswordSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    newPassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
    code: joi.string().length(5).required(),
  }),
};

/********************************************************************************/

export const refreshTokenSchema = {
  body: joi.object({
    authorization: joi.string().required(),
  }),
};
