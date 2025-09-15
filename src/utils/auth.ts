import { db } from "./db";
import { emailOTP, jwt } from "better-auth/plugins";
import { transporter } from "./nodemailer";
import { VerificationTemplate } from "./templates/verification";
import { ResetTemplate } from "./templates/reset";
import "dotenv/config";

export const initializeAuth = async () => {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

  return betterAuth({
    trustedOrigins: [process.env.CLIENT_BASE_URL!],
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        const modifiedUrl = `${process.env
          .CLIENT_BASE_URL!}/reset-password/${token}`;
        await transporter.sendMail({
          from: "Get Up aliarman69720@gmail.com",
          to: user.email,
          subject: "Reset your password",
          text: `Click the link to reset your password: ${modifiedUrl}`,
        });
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    telemetry: {
      enabled: false,
    },
    plugins: [
      jwt(),
      emailOTP({
        expiresIn: 600,
        otpLength: 6,
        async sendVerificationOTP({ email, otp, type }) {
          // Email Sender
          if (type === "email-verification") {
            console.log("Email verification Runs");
            await transporter.sendMail({
              from: "Get Up aliarman69720@gmail.com",
              to: email,
              subject: "Your Verification Code",
              html: VerificationTemplate({ code: otp }),
            });
          }
          if (type === "forget-password") {
            await transporter.sendMail({
              from: "Get Up aliarman69720@gmail.com",
              to: email,
              subject: "Reset Password",
              html: ResetTemplate({ code: otp }),
            });
          }
        },
      }),
    ],
  });
};
