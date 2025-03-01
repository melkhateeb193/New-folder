import mongoose from "mongoose";
import {
  jobLocationTypes,
  seniorityLevelTypes,
  workingTimeTypes,
} from "./enums.js";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocationTypes),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimeTypes),
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevelTypes),
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    technicalSkills: [
      {
        type: String,
        required: true,
      },
    ],
    softSkills: [
      {
        type: String,
        required: true,
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: Boolean,
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// jobSchema.virtual("relatedJop", {
//   ref: "Company",
//   localField: "_id",
//   foreignField: "companyId",
// });

jobSchema.virtual("relatedCompany", {
  ref: "Company",
  localField: "companyId",
  foreignField: "_id",
  justOne: true,
});

jobSchema.virtual("application", {
  ref: "Application",
  localField: "_id",
  foreignField: "jopId",
});

export const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
