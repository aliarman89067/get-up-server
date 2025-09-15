"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProcesses = void 0;
const reminder_model_1 = __importDefault(require("../models/reminder.model"));
const nodemailer_1 = require("./nodemailer");
const reminder_1 = require("./templates/reminder");
const JobProcesses = (data, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminderId } = data;
        const reminder = yield reminder_model_1.default.findById(reminderId);
        if (!reminder) {
            done();
            return;
        }
        const task = reminder.task;
        const email = reminder.email;
        yield nodemailer_1.transporter.sendMail({
            from: "Get Up aliarman69720@gmail.com",
            to: email,
            subject: `${task}`,
            html: (0, reminder_1.TaskReminderTemplate)({ taskName: task }),
        });
        done();
    }
    catch (error) {
        console.log(error);
        done(new Error("Something went wrong"));
    }
});
exports.JobProcesses = JobProcesses;
