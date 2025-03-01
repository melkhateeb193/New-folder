import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { gender, roles } from "../../DB/models/index.js";

/********************************************************************************/

export const updateUserSchema = {
  body: joi.object({
    firstName: joi.string().alphanum().min(1).max(50),
    lastName: joi.string().alphanum().min(1).max(50),
    Gender: joi.string().valid(...Object.values(gender)),
    DOB: joi.date(),
    mobileNumber: joi.string().regex(/^01[0125][0-9]{8}$/),
  }),
};

/********************************************************************************/

export const shareProfileSchema = {
  params: joi.object({
    userId: generalRules.objectId.required(),
  }),
};

/********************************************************************************/

export const updatePasswordSchema = {
  body: joi.object({
    newPassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
  }),
};

/********************************************************************************/

export const uploadImgSchema = {
  files: joi.object({
    image: generalRules.file.required(),
  }),
};

/********************************************************************************/

export const publicIdSchema = {
  body: joi.object({
    public_id: joi.string().min(3).required(),
  }),
};
