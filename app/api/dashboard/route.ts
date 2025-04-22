import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/medical-record";
import { Appointment } from "@/lib/mongodb/models/Appointment";
import { User } from "@/lib/mongodb/models/User";

export async function GET(request: Request) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find the user by Firebase ID
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id.toString();

    // Get recent medical records
    const recentRecords = await MedicalRecord.find({ patientId: userId })
      .sort({ uploadDate: -1 })
      .limit(5);

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patientId: userId,
      date: { $gte: new Date() },
      status: "scheduled",
    })
      .sort({ date: 1 })
      .limit(5);

    // Get stats
    const totalRecords = await MedicalRecord.countDocuments({
        patientId: userId,
      });
    const totalAppointments = await Appointment.countDocuments({
      patientId: userId,
      status: "scheduled",
    });

    return NextResponse.json({
      recentRecords,
      upcomingAppointments,
      stats: {
        totalRecords,
        totalAppointments,
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
