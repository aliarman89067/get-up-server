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
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const db_1 = require("../utils/db");
const reminder_model_1 = __importDefault(require("../models/reminder.model"));
const router = express_1.default.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, time, hours, minutes, task, email } = req.body;
        const user = db_1.db
            .collection("user")
            .findOne({ _id: new mongodb_1.ObjectId(userId), emailVerified: true });
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        const newReminder = yield reminder_model_1.default.create({
            user: userId,
            email,
            time,
            hours,
            minutes,
            task,
            isReminded: false,
        });
        res
            .status(201)
            .json({ message: "New reminder created", data: newReminder });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const reminders = yield reminder_model_1.default.find({
            user: userId,
            isReminded: false,
        }).sort({
            time: "asc",
        });
        res.status(200).json({ message: "Reminders found", data: reminders });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reminderId } = req.body;
        yield reminder_model_1.default.findOneAndDelete({
            _id: reminderId,
            user: userId,
        });
        res.status(200).json({ message: "Reminder deleted!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/history/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const previousReminders = yield reminder_model_1.default.find({
            user: userId,
            isReminded: true,
        });
        res
            .status(200)
            .json({ message: "Previous reminders", data: previousReminders });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
