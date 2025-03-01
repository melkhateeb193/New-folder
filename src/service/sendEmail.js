import { EventEmitter } from "events";
import { customAlphabet } from "nanoid";
import { otpTypes, userModel } from "../DB/models/index.js";
import * as dbService from "../utils/dbService/dbService.js";
import { Hash, sendEmailModule } from "../utils/index.js";
import { html } from "./template-email.js";
import { confirmEmailSubject, forgetPasswordSubject } from "./subject.js";
import { htm3 } from "./template-3 copy.js";
import { html4 } from "./template_JobStatus.js";

export const emailEmitter = new EventEmitter();
let expiresTime = 10;

emailEmitter.on("sendEmailConfirmation", async (data) => {
  const { name, email } = data;
  // generate OTP
  const otp = customAlphabet("0123456789", 5)();
  const hash = await Hash({ key: otp, saltRound: process.env.SALT_ROUNDS });

  const expiresIn = new Date(new Date().getTime() + expiresTime * 60 * 1000);

  await dbService.updateOne({
    model: userModel,
    filter: {
      email,
    },
    update: {
      $push: {
        otp: {
          code: hash,
          type: otpTypes.confirmEmail,
          expiresIn,
        },
      },
    },
  });

  await sendEmailModule({
    to: email,
    subject: "Confirm Email",
    text: "Hallo",
    html: html({
      otp,
      name,
      link: `https://www.google.com/`,
      text: confirmEmailSubject.text,
      btn: confirmEmailSubject.btn,
      expiresTime,
    }),
  });
});

emailEmitter.on("forgetPassword", async (data) => {
  const { name, email } = data;

  // generate OTP
  const otp = customAlphabet("0123456789", 5)();
  const hash = await Hash({ key: otp, saltRound: process.env.SALT_ROUNDS });
  const expiresIn = new Date(new Date().getTime() + 10 * 60 * 1000);

  await dbService.updateOne({
    model: userModel,
    filter: {
      email,
    },
    update: {
      $push: {
        otp: {
          code: hash,
          type: otpTypes.forgetPassword,
          expiresIn,
        },
      },
    },
  });

  await sendEmailModule({
    to: email,
    subject: "Forget Password",
    text: "Hallo",
    html: html({
      otp,
      name,
      link: `https://www.google.com/`,
      text: forgetPasswordSubject.text,
      btn: forgetPasswordSubject.btn,
      expiresTime: 10,
    }),
  });
});

emailEmitter.on("sendConfirmationNewEmail", async (data) => {
  const { name, email, id } = data;

  // generate OTP
  const otp = customAlphabet("0123456789", 5)();
  const hash = await Hash({ key: otp, saltRound: process.env.SALT_ROUNDS });
  await userModel.updateOne(
    { tempEmail: email, _id: id },
    {
      otpNewEmail: {
        code: hash,
        expiresAt: new Date(Date.now() + expiresTime * 60 * 1000),
        NumOfTry: 0,
        banUnit: null,
      },
    }
  );

  await sendEmailModule({
    to: email,
    subject: "Confirm New Email",
    text: "Hallo",
    html: html({
      otp,
      name,
      link: `https://www.google.com/`,
      text: confirmEmailSubject.text,
      btn: confirmEmailSubject.btn,
      expiresTime,
    }),
  });
});

emailEmitter.on("jobStatus", async (data) => {
  try {
    const { name, text, email, companyName } = data;
    await sendEmailModule({
      to: email,
      subject: companyName,
      text: "Hallo",
      html: html4({
        companyName,
        name,
        text,
      }),
    });
  } catch (err) {
    console.log(err);
  }
});
