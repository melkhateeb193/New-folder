import mongoose from "mongoose";
import { AppError, asyncHandler } from "../utils/index.js";
import * as dbService from "../utils/dbService/dbService.js";
import { companyModel } from "../DB/models/index.js";

////////////////////////////////////////////////////////////////////////////////////////////////

export const authenticationOwnerOrHr = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return next(new AppError("Invalid company id", 400));
  }

  const user = req.user;

  const company = await dbService.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      $or: [{ createdBy: user._id }, { HRs: { $in: [user._id] } }],
      approvedByAdmin: { $exists: true },
      isDeleted: { $exists: false },
    },
  });

  if (!company) {
    return next(
      new AppError(
        "You are not authorized to access this company or you are not HR of this company or company not found",
        403
      )
    );
  }

  req.user = user;
  req.company = company;
  return next();
});

////////////////////////////////////////////////////////////////////////////////////////////////

export const authenticationAddApplication = asyncHandler(
  async (req, res, next) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return next(new AppError("Invalid company id", 400));
    }

    const user = req.user;

    const company = await dbService.findOne({
      model: companyModel,
      filter: {
        _id: companyId,
        $and: [{ createdBy: { $ne: user._id } }, { HRs: { $nin: [user._id] } }],
        approvedByAdmin: { $exists: true },
        isDeleted: { $exists: false },
      },
    });

    if (!company) {
      return next(
        new AppError(
          "you cannot add a company that you are the owner or HR of it",
          403
        )
      );
    }

    req.user = user;
    req.company = company;
    return next();
  }
);
