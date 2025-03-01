import { Router } from "express";
import * as middleWares from "./../../middlewares/index.js";
import * as CS from "./company.service.js";
import * as CV from "./company.validation.js";
import { jobRouter } from "./../job/job.controller.js";
import { chatRouter } from "../chat/chat.controller.js";

export const companyRouter = Router();

companyRouter.use("/:companyId/jobs", jobRouter);
companyRouter.use("/:companyId/chats", chatRouter);

companyRouter.post(
  "/createCompany",
  middleWares.authentication,
  middleWares.validation(CV.createCompanySchema),
  CS.createCompany
);

companyRouter.post(
  "/updateCompany/:companyId",
  middleWares.authentication,
  middleWares.validation(CV.updateCompanySchema),
  CS.updateCompany
);

companyRouter.delete(
  "/deleteCompany/:companyId",
  middleWares.authentication,
  middleWares.validation(CV.companyIDSchema),
  CS.deleteCompany
);

companyRouter.get(
  "/getCompanyWithRelatedJobs/:companyId",
  middleWares.validation(CV.companyIDSchema),
  CS.getCompanyWithRelatedJobs
);

companyRouter.get(
  "/getCompanyByName",
  middleWares.validation(CV.companyNameSchema),
  CS.getCompanyByName
);

companyRouter.post(
  "/uploadCompanyLogo/:companyId",
  middleWares.authentication,
  middleWares.multerCloud(middleWares.fileFormat.image).single("image"),
  middleWares.validation(CV.uploadCompanyImgSchema),
  CS.uploadCompanyLogo
);

companyRouter.post(
  "/uploadCompanyCoverPic/:companyId",
  middleWares.authentication,
  middleWares.multerCloud(middleWares.fileFormat.image).single("image"),
  middleWares.validation(CV.uploadCompanyImgSchema),
  CS.uploadCompanyCoverPic
);

companyRouter.delete(
  "/deleteCompanyLogo/:companyId",
  middleWares.authentication,
  middleWares.validation(CV.deleteCompanyImgSchema),
  CS.deleteCompanyLogo
);

companyRouter.delete(
  "/deleteCompanyCoverPic/:companyId",
  middleWares.authentication,
  middleWares.validation(CV.deleteCompanyImgSchema),
  CS.deleteCompanyCoverPic
);

companyRouter.post(
  "/:companyId/addHrs",
  middleWares.authentication,
  middleWares.validation(CV.addHrsSchema),
  CS.addHrs
);

companyRouter.post(
  "/:companyId/approveCompanyTest",
  middleWares.authentication,
  middleWares.authorization(["admin"]),
  CS.approveCompanyTest
);
