import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { Appointment } from "@/lib/mongodb/models/Appointment";
import { User } from "@/lib/mongodb/models/User";

// GET all appointments for a user
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

    // const appointments = await Appointment.find({
    //   patientId: user._id.toString(),
    // }).sort({ date: 1 });

    // get doctor name from doctorId, use one single aggregation
    const appointments = await Appointment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $match: {
          patientId: user._id.toString(),
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          _id: 1,
          doctorName: "$doctor.name",
          doctorId: "$doctor._id",
          patientId: "$patientId",
          date: 1,
          time: 1,
          type: 1,
          notes: 1,
          status: 1,
        },
      },
    ]);

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new appointment
export async function POST(request: Request) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, date, time, type, notes } = body;

    if (!doctorId || !date || !time || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const doctor = await User.findOne({
      _id: doctorId,
      userType: "doctor",
    });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Find the user by Firebase ID
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appointment = await Appointment.create({
      patientId: user._id.toString(),
      doctorId: doctor._id.toString(),
      date: new Date(date),
      time,
      type,
      notes,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Appointments API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
