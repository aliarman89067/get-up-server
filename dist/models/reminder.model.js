"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReminderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" },
    email: { type: String, required: true },
    time: { type: Number, required: true },
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    task: { type: String, required: true },
    isReminded: { type: Boolean },
});
const ReminderModel = (0, mongoose_1.model)("reminder", ReminderSchema);
exports.default = ReminderModel;
