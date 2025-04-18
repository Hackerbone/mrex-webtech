import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
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
    enum: [
      "initial_consultation",
      "follow_up",
      "emergency",
      "routine_checkup",
      "specialist_referral",
      "other",
    ],
  },
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"],
    default: "scheduled",
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
appointmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
