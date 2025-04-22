import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: [
      "consultation",
      "lab_result",
      "imaging",
      "prescription",
      "vaccination",
      "surgery",
      "other",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "archived"],
    default: "pending",
  },
  attachments: [
    {
      name: String,
      url: String,
      type: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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
medicalRecordSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const MedicalRecord =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", medicalRecordSchema);