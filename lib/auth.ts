import { hash, compare } from "bcryptjs";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
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

export async function createUser(
  userData: Omit<User, "_id" | "createdAt" | "preferences" | "isAdmin">
) {
  const client = await clientPromise;
  const db = client.db();

  // Check if user already exists
  const existingUser = await db
    .collection("users")
    .findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await hash(userData.password, 12);

  // Create user document
  const user: Omit<User, "_id"> = {
    ...userData,
    password: hashedPassword,
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

export async function validateUser(email: string, password: string) {
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserById(id: string) {
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error("User not found");
  }

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUserPreferences(
  userId: string,
  preferences: User["preferences"]
) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { preferences } });

  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }

  return result;
}
