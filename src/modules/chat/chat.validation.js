import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const getAllChatSchema = {
  params: joi.object({
    companyId: generalRules.objectId.required(),
    jobId: generalRules.objectId.required(),
  }),
};
