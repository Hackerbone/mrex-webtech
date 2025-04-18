import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebase/admin";
import { Doctor } from "@/lib/mongodb/models/doctor";
import { Appointment } from "@/lib/mongodb/models/appointment";

// Initialize Firebase Admin
initAdmin();

// GET: Get all appointments for a doctor
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

    // Get query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status");

    // Connect to MongoDB
    await connectDB();

    // Find the doctor by Firebase ID
    const doctor = await Doctor.findOne({ firebaseId: doctorId });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Build query
    const query: any = { doctorId: doctor._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status) {
      query.status = status;
    }

    // Get appointments
    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .populate("patientId", "name email");

    // Format the data for the frontend
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment._id.toString(),
      patientId: appointment.patientId._id.toString(),
      patientName: appointment.patientId.name,
      patientEmail: appointment.patientId.email,
      date: new Date(appointment.date).toISOString().split("T")[0],
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new appointment
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
    const { patientId, date, time, type, notes } = body;

    if (!patientId || !date || !time || !type) {
      return NextResponse.json(
        { error: "Patient ID, date, time, and type are required" },
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

    // Create new appointment
    const appointment = new Appointment({
      patientId,
      doctorId: doctor._id,
      date: new Date(date),
      time,
      type,
      status: "scheduled",
      notes,
    });

    await appointment.save();

    return NextResponse.json({
      message: "Appointment created successfully",
      appointmentId: appointment._id,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
