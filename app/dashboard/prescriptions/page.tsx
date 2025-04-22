"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, ClipboardList, Printer } from "lucide-react";

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

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  date: string;
  status: "active" | "completed" | "cancelled";
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return;

      try {
        // This would be replaced with an actual API call to fetch prescriptions
        // For now, we'll use mock data
        const mockPrescriptions: Prescription[] = [
          {
            id: "1",
            patientName: "John Doe",
            medication: "Lisinopril",
            dosage: "10mg daily",
            date: "2023-05-15",
            status: "active",
          },
          {
            id: "2",
            patientName: "Jane Smith",
            medication: "Metformin",
            dosage: "500mg twice daily",
            date: "2023-04-10",
            status: "active",
          },
          {
            id: "3",
            patientName: "Robert Johnson",
            medication: "Amoxicillin",
            dosage: "500mg three times daily",
            date: "2023-03-22",
            status: "completed",
          },
        ];

        setPrescriptions(mockPrescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user]);

  // Show loading state or redirect if not logged in
  if (loading || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Patient Prescriptions"
        text="Manage and view all patient prescriptions."
      >
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </DashboardHeader>
      <DashboardShell>
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search prescriptions..." className="pl-8" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{prescription.patientName}</CardTitle>
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        prescription.status
                      )}`}
                    ></div>
                  </div>
                  <CardDescription>{prescription.medication}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Dosage:</span>{" "}
                      {prescription.dosage}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {prescription.date}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {prescription.status.charAt(0).toUpperCase() +
                        prescription.status.slice(1)}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button className="flex-1" variant="outline">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
