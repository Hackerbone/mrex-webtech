import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { User } from "@/lib/mongodb/models/User";

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findOne({ firebaseId: params.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { preferences, isAdmin } = body;

    const updateData: any = {};

    if (preferences) {
      updateData.preferences = preferences;
    }

    if (typeof isAdmin === "boolean") {
      updateData.isAdmin = isAdmin;
    }

    const user = await User.findOneAndUpdate(
      { firebaseId: params.id },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseId = request.headers.get("x-firebase-id");
    const { id } = await params;

    if (!firebaseId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find the requesting user
    const requestingUser = await User.findOne({ firebaseId });
    if (!requestingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the target user
    const targetUser = await User.findOne({
      firebaseId: id,
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow admins to delete users
    if (!requestingUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete user
    await User.findOneAndDelete({
      firebaseId: id,
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
