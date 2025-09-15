import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db";
import ReminderModel from "../models/reminder.model";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, time, hours, minutes, task, email } = req.body;
    const user = db
      .collection("user")
      .findOne({ _id: new ObjectId(userId), emailVerified: true });
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    const newReminder = await ReminderModel.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reminders = await ReminderModel.find({
      user: userId,
      isReminded: false,
    }).sort({
      time: "asc",
    });
    res.status(200).json({ message: "Reminders found", data: reminders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { userId, reminderId } = req.body;
    await ReminderModel.findOneAndDelete({
      _id: reminderId,
      user: userId,
    });
    res.status(200).json({ message: "Reminder deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const previousReminders = await ReminderModel.find({
      user: userId,
      isReminded: true,
    });
    res
      .status(200)
      .json({ message: "Previous reminders", data: previousReminders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
