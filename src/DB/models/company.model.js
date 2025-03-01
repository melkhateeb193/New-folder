import mongoose from "mongoose";
import { numberOfEmployeesTypes } from "./enums.js";
import { jobModel } from "./job.model.js";
import * as dbService from "../../utils/dbService/dbService.js";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    numberOfEmployees: {
      type: String,
      enum: Object.values(numberOfEmployeesTypes),
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: Boolean,
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: Boolean,
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

companySchema.virtual("relatedJob", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.post("deleteMany", async function (doc, next) {
  await dbService.deleteMany({
    model: jobModel,
    filter: { companyId: this._id },
  });
  next();
});

export const companyModel =
  mongoose.models.Company || mongoose.model("Company", companySchema);
