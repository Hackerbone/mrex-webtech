import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebase/admin";
import { updateUserRole } from "@/lib/userService";

// Initialize Firebase Admin
initAdmin();

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
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
    const { isAdmin } = body;

    if (typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "isAdmin must be a boolean" },
        { status: 400 }
      );
    }

    // Update user role
    await updateUserRole(params.userId, isAdmin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
