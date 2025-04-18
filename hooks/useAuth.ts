import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { useAuth as useFirebaseAuth } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, loading, register } = useFirebaseAuth();

  return { user, loading, register };
}
