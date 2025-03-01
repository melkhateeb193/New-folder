import mongoose from "mongoose";
import { jopStatusTypes } from "./enums.js";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: { secure_url: String, public_id: String },
    status: {
      type: String,
      enum: Object.values(jopStatusTypes),
      default: jopStatusTypes.pending,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

export const applicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
