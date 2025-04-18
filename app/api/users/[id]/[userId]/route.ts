import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebase/admin";
import { updateUserPreferences, getUserByUid } from "@/lib/userService";

// Initialize Firebase Admin
initAdmin();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("x-firebase-id");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No Firebase ID provided" },
        { status: 401 }
      );
    }

    // Verify the Firebase token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authHeader);
    const currentUserId = decodedToken.uid;

    // Get user from MongoDB
    const user = await getUserByUid(params.id);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("x-firebase-id");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No Firebase ID provided" },
        { status: 401 }
      );
    }

    // Verify the Firebase token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authHeader);
    const currentUserId = decodedToken.uid;

    // Get request body
    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        { error: "Preferences are required" },
        { status: 400 }
      );
    }

    // Update user preferences
    await updateUserPreferences(params.id, preferences);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
