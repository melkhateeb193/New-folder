import { companyModel, userModel } from "../../../DB/models/index.js";
import { authGraph } from "../../../middlewares/index.js";
import * as dbService from "../../../utils/dbService/dbService.js";

// export const getAllUsers = async (parent, args) => {
//   const { authorization, page, limit } = args;
//   await authGraph({ authorization, accessRoles: ["admin"] });
//   const users = await dbService.pagination({
//     model: userModel,
//     filter: {},
//     page,
//     limit,
//     select:
//       "firstName lastName mobileNumber profilePic.secure_url coverPic.secure_url email ",
//   });
//   if (!users) {
//     return {
//       Page: 1,
//       totalCount: 0,
//       data: [],
//     };
//   }
//   users.data.map(async (user) => {
//     user.mobileNumber = await Utils.Decrypt({
//       encrypted: user.mobileNumber,
//     });
//   });

//   return users;
// };


export const getAllUsers = async (parent, args) => {
  const { page, limit } = args;
  


  const users = await dbService.pagination({
    model: userModel,
    filter: {},
    page,
    limit,
    select: "firstName lastName email",
  });

  return users || { Page: 1, totalCount: 0, data: [] };
};


/*************************************************************************************************/

export const getAllCompanies = async (parent, args) => {
  const { authorization, page, limit } = args;
  await authGraph({ authorization, accessRoles: ["admin"] });
  const companies = await dbService.pagination({
    model: companyModel,
    filter: {},
    page,
    limit,
    select:
      "companyName description industry address numberOfEmployees companyEmail HRs ",
  });
  if (!companies) {
    return {
      Page: 1,
      totalCount: 0,
      data: [],
    };
  }

  return companies;
};

/*************************************************************************************************/

export const banOrUnBanUser = async (parent, args) => {
  const { authorization, userId, action } = args;
  await authGraph({ authorization, accessRoles: ["admin"] });

  let data = {};
  switch (action) {
    case "Ban":
      data = { isDeleted: true };
      break;
    case "unBan":
      data = { isDeleted: false };
      break;
    default:
      throw new Error("Invalid action");
  }
  await dbService.updateOne({
    model: userModel,
    filter: { _id: userId },
    update: { ...data, bannedAt: new Date() },
  });
  return `User ${action}d successfully`;
};

/*************************************************************************************************/

export const banOrUnBanCompany = async (parent, args) => {
  const { authorization, companyId, action } = args;
  await authGraph({ authorization, accessRoles: ["admin"] });

  let data = {};
  switch (action) {
    case "Ban":
      data = { isDeleted: true };
      break;
    case "unBan":
      data = { isDeleted: false };
      break;
    default:
      throw new Error("Invalid action");
  }
  await dbService.updateOne({
    model: companyModel,
    filter: { _id: companyId },
    update: { ...data, bannedAt: new Date() },
  });
  return `Company ${action}d successfully`;
};

/*************************************************************************************************/

export const approveCompany = async (parent, args) => {
  const { authorization, companyId } = args;
  await authGraph({ authorization, accessRoles: ["admin"] });
  const company = await dbService.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      isDeleted: false,
      approvedByAdmin: { $exists: false },
      isDeleted: { $exists: false },
    },
  });
  if (!company) {
    throw new Error("Company not found");
  }
  await dbService.updateOne({
    model: companyModel,
    filter: { _id: companyId },
    update: {
      $set: { approvedByAdmin: true },
    },
  });
  return "Company approved successfully";
};
