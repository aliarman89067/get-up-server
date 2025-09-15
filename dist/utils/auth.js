"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAuth = void 0;
const db_1 = require("./db");
const plugins_1 = require("better-auth/plugins");
const nodemailer_1 = require("./nodemailer");
const verification_1 = require("./templates/verification");
const reset_1 = require("./templates/reset");
require("dotenv/config");
const initializeAuth = () => __awaiter(void 0, void 0, void 0, function* () {
    const { betterAuth } = yield Promise.resolve().then(() => __importStar(require("better-auth")));
    const { mongodbAdapter } = yield Promise.resolve().then(() => __importStar(require("better-auth/adapters/mongodb")));
    return betterAuth({
        trustedOrigins: [process.env.CLIENT_BASE_URL],
        database: mongodbAdapter(db_1.db),
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
            sendResetPassword: (_a, request_1) => __awaiter(void 0, [_a, request_1], void 0, function* ({ user, url, token }, request) {
                const modifiedUrl = `${process.env
                    .CLIENT_BASE_URL}/reset-password/${token}`;
                yield nodemailer_1.transporter.sendMail({
                    from: "Get Up aliarman69720@gmail.com",
                    to: user.email,
                    subject: "Reset your password",
                    text: `Click the link to reset your password: ${modifiedUrl}`,
                });
            }),
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        },
        telemetry: {
            enabled: false,
        },
        plugins: [
            (0, plugins_1.jwt)(),
            (0, plugins_1.emailOTP)({
                expiresIn: 600,
                otpLength: 6,
                sendVerificationOTP(_a) {
                    return __awaiter(this, arguments, void 0, function* ({ email, otp, type }) {
                        // Email Sender
                        if (type === "email-verification") {
                            console.log("Email verification Runs");
                            yield nodemailer_1.transporter.sendMail({
                                from: "Get Up aliarman69720@gmail.com",
                                to: email,
                                subject: "Your Verification Code",
                                html: (0, verification_1.VerificationTemplate)({ code: otp }),
                            });
                        }
                        if (type === "forget-password") {
                            yield nodemailer_1.transporter.sendMail({
                                from: "Get Up aliarman69720@gmail.com",
                                to: email,
                                subject: "Reset Password",
                                html: (0, reset_1.ResetTemplate)({ code: otp }),
                            });
                        }
                    });
                },
            }),
        ],
    });
});
exports.initializeAuth = initializeAuth;
