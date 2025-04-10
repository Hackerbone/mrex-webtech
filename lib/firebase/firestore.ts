import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";

export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: "patient" | "doctor";
  createdAt: Date;
}

export const createUserDocument = async (userData: UserData) => {
  try {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
    });
    return userRef;
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

export const getUserDocument = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error getting user document:", error);
    throw error;
  }
};

export const updateUserDocument = async (
  uid: string,
  data: Partial<UserData>
) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user document:", error);
    throw error;
  }
};

export const deleteUserDocument = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user document:", error);
    throw error;
  }
};
