import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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

    // Get all users with userType "doctor"
    const doctors = await db
      .collection("users")
      .find({ userType: "doctor" })
      .project({ _id: 1, name: 1, email: 1, firebaseId: 1 })
      .toArray();

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
