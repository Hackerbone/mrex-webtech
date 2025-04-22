"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell";

interface Patient {
  id: string;
  name: string;
  email: string;
  lastVisit: string;
  nextAppointment: string | null;
}

export default function PatientsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      try {
        // This would be replaced with an actual API call to fetch patients
        // For now, we'll use mock data
        const mockPatients: Patient[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            lastVisit: "2023-05-15",
            nextAppointment: "2023-06-20",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            lastVisit: "2023-04-10",
            nextAppointment: null,
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert@example.com",
            lastVisit: "2023-03-22",
            nextAppointment: "2023-07-05",
          },
        ];

        setPatients(mockPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  // Show loading state or redirect if not logged in
  if (loading || !user) {
    return null;
  }

  return (
    <>
      <DashboardHeader
        heading="My Patients"
        text="Manage and view all your patients."
      >
        <div className="flex space-x-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </DashboardHeader>
      <DashboardShell>
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-8" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle>{patient.name}</CardTitle>
                  <CardDescription>{patient.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Last Visit:</span>{" "}
                      {patient.lastVisit}
                    </p>
                    <p>
                      <span className="font-medium">Next Appointment:</span>{" "}
                      {patient.nextAppointment || "None scheduled"}
                    </p>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
