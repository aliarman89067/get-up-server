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
const node_1 = require("better-auth/node");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./utils/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const reminder_routes_1 = __importDefault(require("./routes/reminder.routes"));
const reminder_model_1 = __importDefault(require("./models/reminder.model"));
const bull_1 = __importDefault(require("bull"));
const job_processes_1 = require("./utils/job-processes");
require("dotenv/config");
const PORT = 8080;
const app = (0, express_1.default)();
const redisConfig = {
    host: process.env.UPSTASH_ENDPOINT,
    port: Number(process.env.UPSTASH_PORT),
    password: process.env.UPSTASH_PASSWORD,
    tls: {},
};
const reminderQueue = new bull_1.default("reminder-queue", {
    redis: redisConfig,
});
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
}));
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", reminder_routes_1.default);
app.get("/test", (req, res) => {
    res.send("Life is beautiful");
});
const checkForReminders = () => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const upcomingReminders = yield reminder_model_1.default.find({
            time: { $lte: Date.now() },
            isReminded: false,
        });
        if (upcomingReminders.length > 0) {
            for (const reminder of upcomingReminders) {
                console.log("An reminder added");
                reminderQueue.add({ reminderId: reminder.id }, {
                    attempts: 3,
                });
                yield reminder_model_1.default.findByIdAndUpdate(reminder.id, {
                    isReminded: true,
                });
            }
        }
    }), 10000);
});
checkForReminders();
reminderQueue.process((job, done) => {
    (0, job_processes_1.JobProcesses)(job.data, done);
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.log(error);
});
exports.default = app;
