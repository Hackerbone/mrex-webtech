import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { User } from "@/lib/mongodb/models/User";

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const users = await User.find({}).select("-__v");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { firebaseId, name, email, userType, phoneNumber, address } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseId });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.log("Creating user:", {
      firebaseId,
      name,
      email,
      userType,
      phoneNumber,
      address,
    });
    // Create new user
    const user = await User.create({
      firebaseId,
      name,
      email,
      userType,
      preferences: {
        notifications: {
          email: true,
          push: true,
        },
        theme: "system",
        language: "en",
      },
      phoneNumber,
      address,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
