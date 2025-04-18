import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebase/admin";
import { Doctor } from "@/lib/mongodb/models/doctor";
import { Patient } from "@/lib/mongodb/models/patient";
import { PatientDoctor } from "@/lib/mongodb/models/patient-doctor";

// Initialize Firebase Admin
initAdmin();

// GET: Get all patients for a doctor
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-firebase-id");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No Firebase ID provided" },
        { status: 401 }
      );
    }

    // Verify the Firebase token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authHeader);
    const doctorId = decodedToken.uid;

    // Connect to MongoDB
    await connectDB();

    // Find the doctor by Firebase ID
    const doctor = await Doctor.findOne({ firebaseId: doctorId });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Get all patient-doctor relationships for this doctor
    const patientDoctorRelations = await PatientDoctor.find({
      doctorId: doctor._id,
      status: "active",
    }).populate("patientId");

    // Format the data for the frontend
    const patients = patientDoctorRelations.map((pd) => ({
      id: pd.patientId._id.toString(),
      name: pd.patientId.name,
      email: pd.patientId.email,
      lastVisit: pd.patientId.lastVisit
        ? new Date(pd.patientId.lastVisit).toISOString().split("T")[0]
        : null,
      nextAppointment: pd.patientId.nextAppointment
        ? new Date(pd.patientId.nextAppointment).toISOString().split("T")[0]
        : null,
      relationshipId: pd._id.toString(),
      permissions: pd.permissions,
    }));

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new patient to a doctor
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-firebase-id");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No Firebase ID provided" },
        { status: 401 }
      );
    }

    // Verify the Firebase token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authHeader);
    const doctorId = decodedToken.uid;

    // Get request body
    const body = await request.json();
    const { patientEmail, permissions } = body;

    if (!patientEmail) {
      return NextResponse.json(
        { error: "Patient email is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find the doctor by Firebase ID
    const doctor = await Doctor.findOne({ firebaseId: doctorId });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Find the patient by email
    const patient = await Patient.findOne({ email: patientEmail });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check if relationship already exists
    const existingRelationship = await PatientDoctor.findOne({
      patientId: patient._id,
      doctorId: doctor._id,
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: "Relationship already exists" },
        { status: 400 }
      );
    }

    // Create new patient-doctor relationship
    const patientDoctor = new PatientDoctor({
      patientId: patient._id,
      doctorId: doctor._id,
      status: "active",
      permissions: permissions || {
        viewRecords: true,
        addRecords: false,
        editRecords: false,
      },
    });

    await patientDoctor.save();

    return NextResponse.json({
      message: "Patient added successfully",
      relationshipId: patientDoctor._id,
    });
  } catch (error) {
    console.error("Error adding patient to doctor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
