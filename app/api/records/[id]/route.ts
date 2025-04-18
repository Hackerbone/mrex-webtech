import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/MedicalRecord";
import { User } from "@/lib/mongodb/models/User";

// GET single medical record
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

    const record = await MedicalRecord.findOne({
      _id: params.id,
      userId: user._id.toString(),
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Medical Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update medical record
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

    const record = await MedicalRecord.findOneAndUpdate(
      { _id: params.id, userId: user._id.toString() },
      {
        name,
        type,
        date: new Date(date),
        doctor,
        notes,
      },
      { new: true }
    );

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Medical Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE medical record
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

    const record = await MedicalRecord.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString(),
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    console.error("Medical Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
