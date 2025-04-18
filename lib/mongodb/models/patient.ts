import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer not to say"],
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
    default: "unknown",
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phoneNumber: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
  },
  medicalHistory: [
    {
      condition: String,
      diagnosedDate: Date,
      status: String,
      notes: String,
    },
  ],
  allergies: [
    {
      allergen: String,
      reaction: String,
      severity: String,
    },
  ],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    },
  ],
  lastVisit: Date,
  nextAppointment: Date,
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
patientSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
