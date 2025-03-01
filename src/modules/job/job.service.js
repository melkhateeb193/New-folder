import {
  applicationModel,
  companyModel,
  jobModel,
  jopStatusTypes,
} from "../../DB/models/index.js";
import * as dbService from "../../utils/dbService/dbService.js";
import * as Utils from "./../../utils/index.js";
import { AppError } from "./../../utils/errorHandling/index.js";
import { emailEmitter, jobStatusSubject } from "./../../service/index.js";

export const addJob = Utils.asyncHandler(async (req, res, next) => {
  const company = req.company;
  const user = req.user;

  const job = await dbService.create({
    model: jobModel,
    query: {
      ...req.body,
      addedBy: user._id,
      companyId: company._id,
      companyOwnerId: company.createdBy,
    },
  });

  return res.status(201).json({ message: "Done", job });
});

/********************************************************************************/

export const updateJob = Utils.asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const user = req.user;

  const job = await dbService.findOneAndUpdate({
    model: jobModel,
    filter: { _id: jobId, companyOwnerId: user._id },
    update: {
      ...req.body,
    },
    options: { new: true },
  });
  if (!job) {
    return res
      .status(404)
      .json({ message: "Owner only can update job or job not found" });
    // return new AppError("Job not found", 404);
  }
  return res.status(200).json({ message: "Done", job });
});

/********************************************************************************/

export const deleteJob = Utils.asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const user = req.user;

  const job = await dbService.findOneAndDelete({
    model: jobModel,
    filter: { _id: jobId },
  });

  if (!job) {
    return res
      .status(404)
      .json({ message: "Owner only can delete job or job not found" });
    // return new AppError("Owner only can delete job or job not found", 404);
  }

  return res.status(200).json({ message: "Done" });
});

/********************************************************************************/

export const getAllJobsInOneCompany = Utils.asyncHandler(
  async (req, res, next) => {
    const { page, limit, jobName } = req.query;
    const { companyId, jobId } = req.params;
    const company = await dbService.findById({
      model: companyModel,
      id: companyId,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (jobId) {
      const job = await dbService.findOne({
        model: jobModel,
        filter: { _id: jobId, companyId: company._id },
      });
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({ message: "Done", job });
    }

    if (jobName) {
      const jobs = await dbService.pagination({
        model: jobModel,
        filter: {
          companyId: company._id,
          jobTitle: { $regex: `.*${jobName}.*`, $options: "i" },
        },
        page,
        limit,
        sort: { createdAt: -1 },
      });
      if (!jobs) {
        return res
          .status(404)
          .json({ message: "No jobs found in this company" });
      }
      return res.status(200).json({ message: "Done", jobs });
    }

    const jobs = await dbService.pagination({
      model: jobModel,
      filter: { companyId: company._id },
      page,
      limit,
      sort: { createdAt: 1 },
    });
    if (!jobs.totalCount) {
      return res.status(404).json({ message: "No jobs found in this company" });
    }
    return res.status(200).json({ message: "Done", jobs });
  }
);

/********************************************************************************/

export const getMatchedJobs = Utils.asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const {
    page,
    limit,
    jobLocation,
    technicalSkills,
    workingTime,
    seniorityLevel,
    jobTitle,
  } = req.query;

  let filter = {};
  if (workingTime) {
    filter.workingTime = workingTime;
  }
  if (jobLocation) {
    filter.jobLocation = jobLocation;
  }
  if (seniorityLevel) {
    filter.seniorityLevel = seniorityLevel;
  }
  if (technicalSkills) {
    const skills = technicalSkills.split(",").map((skill) => skill.trim());
    filter.technicalSkills = { $in: skills };
  }
  if (jobTitle) {
    filter.jobTitle = { $regex: `.*${jobTitle}.*`, $options: "i" };
  }

  const jobs = await dbService.pagination({
    model: jobModel,
    filter: {
      companyId,
      ...filter,
    },
    page,
    limit,
    sort: { createdAt: 1 },
  });
  if (!jobs.data.length) {
    return res.status(404).json({ message: "No matching jobs found" });
  }

  return res.status(200).json({ message: "Done", jobs });
});

/********************************************************************************/

export const applyToJobApplication = Utils.asyncHandler(
  async (req, res, next) => {
    const { jobId } = req.params;
    const image = req.file.path;
    if (!image) {
      return next(new AppError("No image uploaded", 404));
    }
    const user = req.user;
    const company = req.company;

    const job = await dbService.findById({
      model: jobModel,
      id: jobId,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const CV = await Utils.uploadFileCloudinary({
      source: image,
      name: company.companyName,
      email: company.companyEmail,
      nameOfFolder: `CVs/${user.firstName}-${user.email}`,
      resource_type: "image",
      overwrite: true,
    });

    const application = await dbService.create({
      model: applicationModel,
      query: {
        userId: user._id,
        jobId: job._id,
        userCV: {
          secure_url: CV.secure_url,
          public_id: CV.public_id,
        },
      },
    });

    return res.status(200).json({ message: "Done", application });
  }
);

/********************************************************************************/

export const getAllApplicationsForJob = Utils.asyncHandler(
  async (req, res, next) => {
    const { jobId } = req.params;
    const { page, limit } = req.query;

    const application = await dbService.pagination({
      model: applicationModel,
      filter: { jobId },
      page,
      limit,
      sort: { createdAt: 1 },
      populate: [
        {
          path: "jobId",
        },
      ],
    });
    if (!application.data.length) {
      return res.status(404).json({ message: "No applications found" });
    }

    return res.status(200).json({ message: "Done", application });
  }
);

/********************************************************************************/

export const acceptOrRejectApplication = Utils.asyncHandler(
  async (req, res, next) => {
    const { appId } = req.params;
    const { decision } = req.query;
    const application = await dbService.findOne({
      model: applicationModel,
      filter: {
        _id: appId,
        status: jopStatusTypes.pending,
      },
      populate: [
        {
          path: "userId",
          select: "firstName lastName email",
        },
        {
          path: "jobId",
          select: "companyId",
          populate: [
            {
              path: "companyId",
              select: "companyName ",
            },
          ],
        },
      ],
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (decision === jopStatusTypes.accepted) {
      application.status = jopStatusTypes.accepted;
      emailEmitter.emit("jobStatus", {
        companyName: application.jobId.companyId.companyName,
        name: application.userId.userName,
        text: jobStatusSubject.accepted,
        email: application.userId.email,
      });
    } else if (decision === jopStatusTypes.rejected) {
      application.status = jopStatusTypes.rejected;
      emailEmitter.emit("jobStatus", {
        companyName: application.jobId.companyId.companyName,
        name: application.userId.userName,
        text: jobStatusSubject.rejected,
        email: application.userId.email,
      });
    }
    await application.save();

    return res.status(200).json({ message: "Done", application });
  }
);

/********************************************************************************/
