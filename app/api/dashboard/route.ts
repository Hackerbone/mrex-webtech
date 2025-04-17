import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/MedicalRecord";
import { Appointment } from "@/lib/mongodb/models/Appointment";

export async function GET(request: Request) {
  try {
    // Get user ID from the request headers (you'll need to implement proper auth)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch recent medical records
    const recentRecords = await MedicalRecord.find({ userId })
      .sort({ uploadDate: -1 })
      .limit(5);

    // Fetch upcoming appointments
    const upcomingAppointments = await Appointment.find({
      userId,
      date: { $gte: new Date() },
      status: "scheduled",
    })
      .sort({ date: 1 })
      .limit(5);

    // Get total counts
    const totalRecords = await MedicalRecord.countDocuments({ userId });
    const totalAppointments = await Appointment.countDocuments({ userId });

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
