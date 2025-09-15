import { Schema, model } from "mongoose";

const ReminderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  email: { type: String, required: true },
  time: { type: Number, required: true },
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  task: { type: String, required: true },
  isReminded: { type: Boolean },
});

const ReminderModel = model("reminder", ReminderSchema);
export default ReminderModel;
