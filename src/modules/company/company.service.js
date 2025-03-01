import { companyModel, roles, userModel } from "../../DB/models/index.js";
import * as dbService from "../../utils/dbService/dbService.js";
import * as Utils from "./../../utils/index.js";
import { AppError } from "./../../utils/errorHandling/index.js";

export const createCompany = Utils.asyncHandler(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  if (
    await dbService.findOne({
      model: companyModel,
      filter: {
        $or: [{ companyName }, { companyEmail }],
      },
    })
  ) {
    return res.status(400).json({ message: "Company already exists" });
  }
  const company = await dbService.create({
    model: companyModel,
    query: {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      createdBy: req.user._id,
    },
  });

  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const updateCompany = Utils.asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  if (companyName || companyEmail) {
    if (
      await dbService.findOne({
        model: companyModel,
        filter: {
          $or: [{ companyName }, { companyEmail }],
          isDeleted: true,
          approvedByAdmin: { $exists: false },
        },
      })
    ) {
      return res.status(400).json({
        message: "Company name or company email already exists or deleted",
      });
    }
  }

  const user = req.user;
  const company = await dbService.findOneAndUpdate({
    model: companyModel,
    filter: { _id: companyId, createdBy: user._id },
    update: {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    options: { new: true },
  });
  if (!company) {
    return new AppError("Company not found or you are not the owner", 404);
  }

  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const deleteCompany = Utils.asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = req.user;
  let company;
  if (user.role === roles.admin) {
    company = await dbService.findById({
      model: companyModel,
      id: companyId,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
  } else {
    company = await dbService.findOne({
      model: companyModel,
      filter: { _id: companyId, createdBy: user._id },
    });
    if (!company) {
      return new AppError("Company not found or you are not the owner", 404);
    }
  }

  company.isDeleted = true;
  await company.save();

  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const getCompanyWithRelatedJobs = Utils.asyncHandler(
  async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findOne({
      model: companyModel,
      filter: {
        _id: companyId,
        approvedByAdmin: { $exists: true },
        isDeleted: { $exists: false },
      },
      populate: [
        {
          path: "relatedJob",
        },
      ],
    });
    if (!company) {
      return new AppError("Company not found ", 404);
    }
    return res.status(200).json({ message: "Done", company });
  }
);

/********************************************************************************/

export const getCompanyByName = Utils.asyncHandler(async (req, res, next) => {
  //UNDER TEST

  const { companyName } = req.body;
  const company = await dbService.find({
    model: companyModel,
    filter: {
      companyName: new RegExp(companyName, "i"),
      isDeleted: { $exists: false },
      approvedByAdmin: { $exists: true },
    },
  });
  if (company.length == 0) {
    return new AppError("Company not found ", 404);
  }

  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const uploadCompanyLogo = Utils.asyncHandler(async (req, res, next) => {
  const image = req.file.path;
  const { companyId } = req.params;
  const user = req.user;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: user._id,
      approvedByAdmin: { $exists: true },
      isDeleted: { $exists: false },
    },
  });
  if (!company) {
    return res
      .status(404)
      .json({ message: "Company not found or you are not the owner" });
  }
  const companyLogo = await Utils.uploadFileCloudinary({
    source: image,
    name: user.firstName,
    email: user.email,
    nameOfFolder: `${company.companyName}/logo`,
    resource_type: "image",
    overwrite: true,
  });

  const newCompany = await dbService.findByIdAndUpdate({
    model: companyModel,
    id: companyId,
    update: {
      $set: {
        logo: {
          secure_url: companyLogo.secure_url,
          public_id: companyLogo.public_id,
        },
      },
    },
    options: { new: true },
  });

  return res.status(200).json({ message: "Done", newCompany });
});

/********************************************************************************/

export const uploadCompanyCoverPic = Utils.asyncHandler(
  async (req, res, next) => {
    const image = req.file.path;
    const { companyId } = req.params;
    const user = req.user;
    const company = await dbService.findOne({
      model: companyModel,
      filter: {
        _id: companyId,
        createdBy: user._id,
        approvedByAdmin: { $exists: true },
        isDeleted: { $exists: false },
      },
    });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found or you are not the owner" });
    }
    const companyCoverPic = await Utils.uploadFileCloudinary({
      source: image,
      name: user.firstName,
      email: user.email,
      nameOfFolder: `${company.companyName}/coverImage`,
      resource_type: "image",
      overwrite: true,
    });
    const newCompany = await dbService.findByIdAndUpdate({
      model: companyModel,
      id: companyId,
      update: {
        $set: {
          coverPic: {
            secure_url: companyCoverPic.secure_url,
            public_id: companyCoverPic.public_id,
          },
        },
      },
      options: { new: true },
    });

    return res.status(200).json({ message: "Done", newCompany });
  }
);

/********************************************************************************/

export const deleteCompanyLogo = Utils.asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const { public_id } = req.body;

  const user = req.user;
  if (
    !(await dbService.findOne({
      model: companyModel,
      filter: {
        _id: companyId,
        createdBy: user._id,
        approvedByAdmin: { $exists: true },
        isDeleted: { $exists: false },
        logo: {
          $exists: {
            public_id,
          },
        },
      },
    }))
  ) {
    return res
      .status(404)
      .json({ message: "Company not found or you are not the owner" });
  }
  if (!(await Utils.deleteOneFileCloudinary({ publicId: public_id }))) {
    return next(new AppError("Failed to delete profile picture", 500));
  }
  const company = await dbService.findByIdAndUpdate({
    model: companyModel,
    id: companyId,
    update: {
      $unset: {
        logo: 1,
      },
    },
    options: { new: true },
  });
  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const deleteCompanyCoverPic = Utils.asyncHandler(
  async (req, res, next) => {
    const { companyId } = req.params;
    const { public_id } = req.body;

    const user = req.user;
    if (
      !(await dbService.findOne({
        model: companyModel,
        filter: {
          _id: companyId,
          createdBy: user._id,
          approvedByAdmin: { $exists: true },
          isDeleted: { $exists: false },
          coverPic: {
            $exists: {
              public_id,
            },
          },
        },
      }))
    ) {
      return res
        .status(404)
        .json({ message: "Company not found or you are not the owner" });
    }

    if (!(await Utils.deleteOneFileCloudinary({ publicId: public_id }))) {
      return next(new AppError("Failed to delete profile picture", 500));
    }
    const company = await dbService.findByIdAndUpdate({
      model: companyModel,
      id: companyId,
      update: {
        $unset: {
          coverPic: 1,
        },
      },
      options: { new: true },
    });
    return res.status(200).json({ message: "Done", company });
  }
);

/********************************************************************************/

export const addHrs = Utils.asyncHandler(async (req, res, next) => {
  const { hrId } = req.body;
  const { companyId } = req.params;
  const user = req.user;
  if (hrId === user._id.toString()) {
    return res.status(400).json({ message: "You can't add yourself" });
  }
  const hr = await dbService.findById({
    model: userModel,
    id: hrId,
  });
  if (!hr || hr.role === roles.admin) {
    return res.status(404).json({ message: "HR not found" });
  }
  const company = await dbService.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: user._id,
      HRs: { $nin: [hrId] },
      approvedByAdmin: { $exists: true },
      isDeleted: { $exists: false },
    },
  });
  if (!company) {
    return res
      .status(404)
      .json({ message: "Company not found or you are not the owner" });
  }
  company.HRs.push(hrId);
  await company.save();

  return res.status(200).json({ message: "Done", company });
});

/********************************************************************************/

export const approveCompanyTest = Utils.asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      approvedByAdmin: { $exists: false },
      isDeleted: { $exists: false },
    },
  });
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }
  company.approvedByAdmin = true;
  await company.save();

  return res.status(200).json({ message: "Done", company });
});
