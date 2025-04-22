import { NextRequest, NextResponse } from "next/server";
import { MedicalRecord } from "@/lib/mongodb/models/medical-record";
import { User } from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb/connection";

// GET all medical records for a user
export async function GET(request: NextRequest) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the user's ID
    const user = await User.findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all records for the user
    const records = await MedicalRecord.find({ patientId: user._id }).sort({
      date: -1,
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST new medical record
export async function POST(request: NextRequest) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the user's ID
    const user = await User.findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await request.json();

    // Create the record
    const record = {
      name: data.name,
      type: data.type,
      date: new Date(data.date),
      doctor: data.doctor,
      notes: data.notes || "",
      patientId: user._id,
      sharedWith: data.sharedWith || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await MedicalRecord.create(record);

    return NextResponse.json({
      id: result._id,
      ...record,
    });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
