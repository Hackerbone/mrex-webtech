import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/MedicalRecord";
import { User } from "@/lib/mongodb/models/User";

// GET all medical records for a user
export async function GET(request: Request) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Unauthorized, no firebase id" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user by Firebase ID
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const records = await MedicalRecord.find({
      userId: user._id.toString(),
    }).sort({ uploadDate: -1 });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Medical Records API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new medical record
export async function POST(request: Request) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, date, doctor, notes } = body;

    if (!name || !type || !date || !doctor) {
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

    const record = await MedicalRecord.create({
      userId: user._id.toString(),
      name,
      type,
      date: new Date(date),
      doctor,
      notes,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Medical Records API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
