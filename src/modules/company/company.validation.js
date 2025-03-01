import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { numberOfEmployeesTypes } from "../../DB/models/enums.js";

/********************************************************************************/

export const createCompanySchema = {
  body: joi.object({
    companyName: joi.string().min(3).max(20).required(),
    description: joi.string().min(3).max(100).required(),
    industry: joi.string().min(3).max(100).required(),
    address: joi.string().min(3).max(100).required(),
    numberOfEmployees: joi
      .string()
      .valid(...Object.values(numberOfEmployeesTypes))
      .required(),
    companyEmail: generalRules.email.required(),
  }),
};

/********************************************************************************/

export const updateCompanySchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
  body: joi.object({
    companyName: joi.string().min(3).max(20),
    description: joi.string().min(3).max(100),
    industry: joi.string().min(3).max(100),
    address: joi.string().min(3).max(100),
    numberOfEmployees: joi
      .string()
      .valid(...Object.values(numberOfEmployeesTypes)),
    companyEmail: generalRules.email,
  }),
};

/********************************************************************************/

export const companyIDSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
};

/********************************************************************************/

export const companyNameSchema = {
  body: joi.object({
    companyName: joi.string().min(1).required(),
  }),
};

/********************************************************************************/

export const uploadCompanyImgSchema = {
  files: joi.object({
    image: generalRules.file.required(),
  }),
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
};

/********************************************************************************/

export const deleteCompanyImgSchema = {
  body: joi.object({
    public_id: joi.string().required(),
  }),
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
};

/********************************************************************************/

export const addHrsSchema = {
  body: joi.object({
    hrId: generalRules.objectId.required(),
  }),
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
};
