import { User as FirebaseUser } from "firebase/auth";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface UserData {
  _id?: ObjectId;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "patient" | "doctor";
  createdAt: Date;
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    theme: string;
    language: string;
  };
  isAdmin: boolean;
}

export async function createUserDocument(
  firebaseUser: FirebaseUser,
  userData: {
    firstName: string;
    lastName: string;
    userType: "patient" | "doctor";
  }
) {
  const client = await clientPromise;
  const db = client.db();

  // Check if user already exists
  const existingUser = await db
    .collection("users")
    .findOne({ uid: firebaseUser.uid });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create user document
  const user: Omit<UserData, "_id"> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    firstName: userData.firstName,
    lastName: userData.lastName,
    userType: userData.userType,
    createdAt: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: true,
      },
      theme: "system",
      language: "en",
    },
    isAdmin: false,
  };

  const result = await db.collection("users").insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function getUserByUid(uid: string) {
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ uid });
  if (!user) {
    throw new Error("User not found");
  }

  return user as UserData;
}

export async function updateUserPreferences(
  uid: string,
  preferences: UserData["preferences"]
) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("users")
    .updateOne({ uid }, { $set: { preferences } });

  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }

  return result;
}

export async function getAllUsers() {
  const client = await clientPromise;
  const db = client.db();

  const users = await db.collection("users").find({}).toArray();
  return users as UserData[];
}

export async function updateUserRole(uid: string, isAdmin: boolean) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("users")
    .updateOne({ uid }, { $set: { isAdmin } });

  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }

  return result;
}
