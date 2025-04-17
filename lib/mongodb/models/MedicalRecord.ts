import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

export const MedicalRecord =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", medicalRecordSchema);
