"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
  userType: string;
  isAdmin: boolean;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    theme: string;
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    userType: string,
    additionalData?: {
      phoneNumber?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
    }
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        // Check if user exists in MongoDB, if not create them
        try {
          const response = await fetch("/api/users/me", {
            headers: {
              "x-firebase-id": firebaseUser.uid,
            },
          });

          if (!response.ok) {
            // User doesn't exist in MongoDB, create them
            await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firebaseId: firebaseUser.uid,
                name: firebaseUser.displayName || "User",
                email: firebaseUser.email,
                image: firebaseUser.photoURL,
                userType: "patient", // Default to patient if not specified
              }),
            });
          }
          console.log("User created in MongoDB");
          const userData = await response.json();
          setUser({
            id: userData.firebaseId,
            email: userData.email,
            name: userData.name,
            image: firebaseUser.photoURL,
            userType: userData.userType,
            isAdmin: userData.isAdmin,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            preferences: userData.preferences,
          });
        } catch (error) {
          console.error("Error syncing user with MongoDB:", error);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    userType: string,
    additionalData?: {
      phoneNumber?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
    }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      // Create user in MongoDB
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseId: userCredential.user.uid,
          name,
          email,
          userType,
          phoneNumber: additionalData?.phoneNumber,
          address: additionalData?.address,
        }),
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
