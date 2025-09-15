import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aliarman69720@gmail.com",
    pass: process.env.EMAIL_PASSWORD!,
  },
});
