import mongoose from "mongoose";

const patientDoctorSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  permissions: {
    viewRecords: {
      type: Boolean,
      default: true,
    },
    addRecords: {
      type: Boolean,
      default: false,
    },
    editRecords: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for patientId and doctorId
patientDoctorSchema.index({ patientId: 1, doctorId: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
patientDoctorSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const PatientDoctor =
  mongoose.models.PatientDoctor ||
  mongoose.model("PatientDoctor", patientDoctorSchema);
