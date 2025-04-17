import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
});

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
