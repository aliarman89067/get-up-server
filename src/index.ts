import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import morgan from "morgan";
import { auth } from "./utils/auth";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import reminderRouter from "./routes/reminder.routes";
import ReminderModel from "./models/reminder.model";
import Bull from "bull";
import { JobProcesses } from "./utils/job-processes";
import "dotenv/config";

const PORT = 8080;
const app = express();

const redisConfig = {
  host: process.env.UPSTASH_ENDPOINT!,
  port: Number(process.env.UPSTASH_PORT!),
  password: process.env.UPSTASH_PASSWORD!,
  tls: {},
};

const reminderQueue = new Bull("reminder-queue", {
  redis: redisConfig,
});

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL!,
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/", reminderRouter);

app.get("/test", (req, res) => {
  res.send("Life is beautiful");
});

const checkForReminders = async () => {
  setInterval(async () => {
    const upcomingReminders = await ReminderModel.find({
      time: { $lte: Date.now() },
      isReminded: false,
    });
    if (upcomingReminders.length > 0) {
      for (const reminder of upcomingReminders) {
        console.log("An reminder added");
        reminderQueue.add(
          { reminderId: reminder.id },
          {
            attempts: 3,
          }
        );
        await ReminderModel.findByIdAndUpdate(reminder.id, {
          isReminded: true,
        });
      }
    }
  }, 10000);
};
checkForReminders();

reminderQueue.process((job, done) => {
  JobProcesses(job.data, done);
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

export default app;
