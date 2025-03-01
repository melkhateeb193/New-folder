import nodemailer from "nodemailer";

export const sendEmailModule = async ({
  to,
  subject,
  text,
  html,
  attachments,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"${process.env.NAME_EMOJI}" <${process.env.EMAIL}>`,
    to: to ? to : process.env.DEFAULT_SUB_EMAIL,
    subject: subject ? subject : "Hello ✔",
    text: text ? text : "Hello world?",
    html: html ? html : "<b>Hello world?</b>",
    attachments: attachments ? attachments : [],
  });
  if (info.accepted.length) {
    return true;
  } else {
    return false;
  }
};
