import { DoneCallback } from "bull";
import ReminderModel from "../models/reminder.model";
import { transporter } from "./nodemailer";
import { TaskReminderTemplate } from "./templates/reminder";

export const JobProcesses = async (
  data: { reminderId: string },
  done: DoneCallback
) => {
  try {
    const { reminderId } = data;
    const reminder = await ReminderModel.findById(reminderId);
    if (!reminder) {
      done();
      return;
    }
    const task = reminder.task;
    const email = reminder.email;

    await transporter.sendMail({
      from: "Get Up aliarman69720@gmail.com",
      to: email,
      subject: `${task}`,
      html: TaskReminderTemplate({ taskName: task }),
    });
    done();
  } catch (error) {
    console.log(error);
    done(new Error("Something went wrong"));
  }
};
