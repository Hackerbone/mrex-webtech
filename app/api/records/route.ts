import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/MedicalRecord";

// GET all records for a user
export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const records = await MedicalRecord.find({ userId }).sort({
      uploadDate: -1,
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Records API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new record
export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
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
    const record = await MedicalRecord.create({
      userId,
      name,
      type,
      date: new Date(date),
      doctor,
      notes,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Records API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
