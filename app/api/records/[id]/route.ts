import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { MedicalRecord } from "@/lib/mongodb/models/medical-record";

// GET single medical record
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Get the user's ID
    const user = await db.collection("users").findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the record using Mongoose
    const record = await MedicalRecord.findOne({
      _id: new ObjectId(params.id),
      patientId: user._id,
    });

    if (!record) {
      return NextResponse.json(
        { error: "Record not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

// PUT update medical record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Get the user's ID
    const user = await db.collection("users").findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await request.json();

    // Update the record using Mongoose
    const result = await MedicalRecord.findOneAndUpdate(
      { _id: new ObjectId(params.id), patientId: user._id },
      {
        $set: {
          name: data.name,
          type: data.type,
          date: new Date(data.date),
          doctor: data.doctor,
          notes: data.notes || "",
          sharedWith: data.sharedWith || [],
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Record not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

// DELETE medical record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Get the user's ID
    const user = await db.collection("users").findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the record using Mongoose
    const result = await MedicalRecord.findOneAndDelete({
      _id: new ObjectId(params.id),
      patientId: user._id,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Record not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
