import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
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

    // Get the patient's ID
    const patient = await db.collection("users").findOne({ firebaseId });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Get all medical records where the patient is the owner
    const medicalRecords = await db
      .collection("medical-records")
      .find({ patientId: patient._id })
      .toArray();

    // Extract all doctor IDs from the sharedWith array in all records
    const doctorIds = new Set();

    medicalRecords.forEach((record) => {
      if (record.sharedWith && Array.isArray(record.sharedWith)) {
        record.sharedWith.forEach((doctorId) => {
          doctorIds.add(doctorId.toString());
        });
      }
    });

    // Get the count of unique doctors
    const connectedDoctorsCount = doctorIds.size;

    return NextResponse.json({ count: connectedDoctorsCount });
  } catch (error) {
    console.error("Error fetching connected doctors count:", error);
    return NextResponse.json(
      { error: "Failed to fetch connected doctors count" },
      { status: 500 }
    );
  }
}
