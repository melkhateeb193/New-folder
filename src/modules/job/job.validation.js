import joi from "joi";
import { generalRules } from "../../utils/index.js";
import {
  jobLocationTypes,
  jopStatusTypes,
  seniorityLevelTypes,
  workingTimeTypes,
} from "../../DB/models/enums.js";

export const addJobSchema = {
  body: joi.object({
    jobTitle: joi.string().min(1).required(),
    jobDescription: joi.string().min(1).required(),
    technicalSkills: joi.array().items(joi.string().min(1)).required(),
    softSkills: joi.array().items(joi.string().min(1)).required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(jobLocationTypes))
      .required(),
    workingTime: joi
      .string()
      .valid(...Object.values(workingTimeTypes))
      .required(),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(seniorityLevelTypes))
      .required(),
  }),
};

export const updateJobSchema = {
  body: joi.object({
    jobTitle: joi.string().min(1),
    jobDescription: joi.string().min(1),
    technicalSkills: joi.array().items(joi.string().min(1)),
    softSkills: joi.array().items(joi.string().min(1)),
    jobLocation: joi.string().valid(...Object.values(jobLocationTypes)),
    workingTime: joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevelTypes)),
  }),
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId.required(),
  }),
};

export const deleteJobSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId.required(),
  }),
};

export const getAllJobsInOneCompanySchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId,
  }),
  query: joi.object({
    jobName: joi.string().min(1),
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(10).default(10),
  }),
};

export const addApplicationSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId.required(),
  }),
  files: joi.object({
    image: generalRules.file.required(),
  }),
};

export const getMatchedJobsSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
  }),
  query: joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(10).default(10),
    jobLocation: joi.string().valid(...Object.values(jobLocationTypes)),
    technicalSkills: joi.string().min(1),
    workingTime: joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevelTypes)),
    jobTitle: joi.string().min(1),
  }),
};

export const getAllApplicationsForJobSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId.required(),
  }),
  query: joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(10).default(10),
  }),
};

export const ApplicationIdSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    appId: generalRules.objectId.required(),
  }),
  query: joi.object({
    decision: joi
      .string()
      .valid(...Object.values(jopStatusTypes))
      .required(),
  }),
};
