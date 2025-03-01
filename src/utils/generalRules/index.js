import joi from "joi";
import { Types } from "mongoose";

export const customId = (value, helper) => {
  let data = Types.ObjectId.isValid(value);
  return data ? value : helper.message("id is not a valid");
};

export const generalRules = {
  objectId: joi.string().custom(customId),
  email: joi.string().email({
    tlds: { allow: true },
    minDomainSegments: 2,
    maxDomainSegments: 3,
  }),
  password: joi.string(),
  // .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),

  headers: joi.object({
    authorization: joi.string(),
    "content-type": joi.string(),
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
  }),
  file: joi
    .object({
      size: joi.number().positive().required(),
      path: joi.string().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      mimetype: joi.string().required(),
      encoding: joi.string().required(),
      originalname: joi.string().required(),
      fieldname: joi.string().required(),
    })
    .messages({ "any.required": "file is required" }),
};
