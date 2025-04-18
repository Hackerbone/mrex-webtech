import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebase/admin";
import { Doctor } from "@/lib/mongodb/models/doctor";
import { PatientDoctor } from "@/lib/mongodb/models/patient-doctor";
import { Patient } from "@/lib/mongodb/models/patient";
import { MedicalRecord } from "@/lib/mongodb/models/medical-record";
import { Appointment } from "@/lib/mongodb/models/appointment";

// Initialize Firebase Admin
initAdmin();

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

    // Get patient IDs
    const patientIds = patientDoctorRelations.map((pd) => pd.patientId._id);

    // Get recent medical records for these patients
    const recentRecords = await MedicalRecord.find({
      patientId: { $in: patientIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patientId");

    // Get upcoming appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: today },
      status: { $ne: "cancelled" },
    })
      .sort({ date: 1 })
      .limit(5)
      .populate("patientId");

    // Count pending records
    const pendingRecords = await MedicalRecord.countDocuments({
      patientId: { $in: patientIds },
      status: "pending",
    });

    // Format the data for the frontend
    const dashboardData = {
      patients: patientDoctorRelations.map((pd) => ({
        id: pd.patientId._id.toString(),
        name: pd.patientId.name,
        lastVisit: pd.patientId.lastVisit
          ? new Date(pd.patientId.lastVisit).toISOString().split("T")[0]
          : null,
        nextAppointment: pd.patientId.nextAppointment
          ? new Date(pd.patientId.nextAppointment).toISOString().split("T")[0]
          : null,
      })),
      recentRecords: recentRecords.map((record) => ({
        id: record._id.toString(),
        patientName: record.patientId.name,
        type: record.type,
        date: new Date(record.createdAt).toISOString().split("T")[0],
        status: record.status,
      })),
      upcomingAppointments: upcomingAppointments.map((appointment) => ({
        id: appointment._id.toString(),
        patientName: appointment.patientId.name,
        date: new Date(appointment.date).toISOString().split("T")[0],
        type: appointment.type,
      })),
      stats: {
        totalPatients: patientDoctorRelations.length,
        totalAppointments: upcomingAppointments.length,
        pendingRecords,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error in doctor dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
