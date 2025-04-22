"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  firebaseId: string;
}

interface DoctorSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DoctorSelect({
  value,
  onValueChange,
  label = "Select Doctor",
  placeholder = "Choose a doctor",
  className = "",
}: DoctorSelectProps) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/users/doctors", {
          headers: {
            "x-firebase-id": user.id,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading doctors...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {doctors.length === 0 ? (
            <SelectItem value="" disabled>
              No doctors found
            </SelectItem>
          ) : (
            doctors.map((doctor) => (
              <SelectItem key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.email})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
