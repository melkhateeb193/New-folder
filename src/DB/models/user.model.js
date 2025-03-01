import mongoose from "mongoose";
import { gender, otpTypes, providerTypes, roles } from "./enums.js";
import { Decrypt, Encrypt, Hash } from "../../utils/index.js";
import * as dbService from "../../utils/dbService/dbService.js";
import { companyModel } from "./company.model.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },

    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },

    gender: {
      type: String,
      enum: Object.values(gender),
      default: gender.male,
    },

    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => {
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18;
        },
        message: "Must be at least 18 years old.",
      },
    },

    mobileNumber: {
      type: String,
      minlength: 10,
    },

    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: Boolean,

    deletedAt: Date,

    bannedAt: Date,
    changeCredentialTime: Date,

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    profilePic: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },

    otp: [
      {
        code: String,
        type: {
          type: String,
          enum: Object.values(otpTypes),
        },
        expiresIn: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await Hash({
      key: this.password,
    });
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = await Encrypt({
      key: this.mobileNumber,
    });
  }
  if (this.isModified("isDeleted")) {
    this.deletedAt = new Date();
    await dbService.deleteMany({
      model: companyModel,
      filter: { createdBy: this._id },
    });
  }
  next();
});

userSchema.post("findOne", async function (doc, next) {
  if (doc && doc.mobileNumber) {
    let decryptedNumber = await Decrypt({ encrypted: doc.mobileNumber });
    doc.mobileNumber = decryptedNumber;
  }
  next();
});

export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
