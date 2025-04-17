import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { MedicalRecord } from "@/lib/mongodb/models/MedicalRecord";

// GET single record
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const record = await MedicalRecord.findOne({ _id: params.id, userId });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const record = await MedicalRecord.findOneAndUpdate(
      { _id: params.id, userId },
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
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const record = await MedicalRecord.findOneAndDelete({
      _id: params.id,
      userId,
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Record API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
