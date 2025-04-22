"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, FileText } from "lucide-react";

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

interface Diagnosis {
  id: string;
  patientName: string;
  diagnosis: string;
  date: string;
  status: "active" | "resolved" | "follow-up";
}

export default function DiagnosesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!user) return;

      try {
        // This would be replaced with an actual API call to fetch diagnoses
        // For now, we'll use mock data
        const mockDiagnoses: Diagnosis[] = [
          {
            id: "1",
            patientName: "John Doe",
            diagnosis: "Hypertension",
            date: "2023-05-15",
            status: "active",
          },
          {
            id: "2",
            patientName: "Jane Smith",
            diagnosis: "Type 2 Diabetes",
            date: "2023-04-10",
            status: "follow-up",
          },
          {
            id: "3",
            patientName: "Robert Johnson",
            diagnosis: "Bronchitis",
            date: "2023-03-22",
            status: "resolved",
          },
        ];

        setDiagnoses(mockDiagnoses);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnoses();
  }, [user]);

  // Show loading state or redirect if not logged in
  if (loading || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500";
      case "follow-up":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Patient Diagnoses"
        text="Manage and view all patient diagnoses."
      >
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Diagnosis
          </Button>
        </div>
      </DashboardHeader>
      <DashboardShell>
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search diagnoses..." className="pl-8" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diagnoses.map((diagnosis) => (
              <Card key={diagnosis.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{diagnosis.patientName}</CardTitle>
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        diagnosis.status
                      )}`}
                    ></div>
                  </div>
                  <CardDescription>{diagnosis.diagnosis}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {diagnosis.date}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {diagnosis.status.charAt(0).toUpperCase() +
                        diagnosis.status.slice(1)}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button className="flex-1" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    <Button className="flex-1" variant="outline">
                      Update
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
