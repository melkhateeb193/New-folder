import { Router } from "express";
import * as middleWares from "../../middlewares/index.js";
import * as JS from "./job.service.js";
import * as JV from "./job.validation.js";

export const jobRouter = Router({ mergeParams: true });

/********************************************************************************/

jobRouter.post(
  "/addJob",
  middleWares.authentication,
  middleWares.authenticationOwnerOrHr,
  middleWares.validation(JV.addJobSchema),
  JS.addJob
);

jobRouter.post(
  "/updateJob/:jobId",
  middleWares.authentication,
  middleWares.authenticationOwnerOrHr,
  middleWares.validation(JV.updateJobSchema),
  JS.updateJob
);

jobRouter.delete(
  "/deleteJob/:jobId",
  middleWares.authentication,
  middleWares.authenticationOwnerOrHr,
  middleWares.validation(JV.deleteJobSchema),
  JS.deleteJob
);

jobRouter.get(
  "/getAllJobsInOneCompany/:jobId?",
  middleWares.authentication,
  middleWares.validation(JV.getAllJobsInOneCompanySchema),
  JS.getAllJobsInOneCompany
);

jobRouter.get(
  "/getMatchedJobs",
  middleWares.authentication,
  middleWares.validation(JV.getMatchedJobsSchema),
  JS.getMatchedJobs
);

jobRouter.post(
  "/addApplication/:jobId",
  middleWares.multerCloud(middleWares.fileFormat.image).single("image"),
  middleWares.authentication,
  middleWares.authenticationAddApplication,
  middleWares.authorization(["user"]),
  middleWares.validation(JV.addApplicationSchema),
  JS.applyToJobApplication
);

jobRouter.get(
  "/getAllApplicationsForJob/:jobId",
  middleWares.authentication,
  middleWares.authenticationOwnerOrHr,
  middleWares.validation(JV.getAllApplicationsForJobSchema),
  JS.getAllApplicationsForJob
);

jobRouter.patch(
  "/acceptOrRejectApplication/:appId",
  middleWares.authentication,
  middleWares.authenticationOwnerOrHr,
  middleWares.validation(JV.ApplicationIdSchema),
  JS.acceptOrRejectApplication
);
