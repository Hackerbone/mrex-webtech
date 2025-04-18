import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { Appointment } from "@/lib/mongodb/models/Appointment";
import { User } from "@/lib/mongodb/models/User";

// GET single appointment
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const appointment = await Appointment.findOne({
      _id: params.id,
      userId: user._id.toString(),
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Appointment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update appointment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { doctorName, date, time, type, notes, status } = body;

    if (!doctorName || !date || !time || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by Firebase ID
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: params.id, userId: user._id.toString() },
      {
        doctorName,
        date: new Date(date),
        time,
        type,
        notes,
        status: status || "scheduled",
      },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Appointment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE appointment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const appointment = await Appointment.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString(),
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Appointment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
