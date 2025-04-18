"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Calendar,
  FileText,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell";
import { UserNav } from "@/app/dashboard/components/user-nav";

interface DoctorDashboardData {
  patients: {
    id: string;
    name: string;
    lastVisit: string;
    nextAppointment: string | null;
  }[];
  recentRecords: {
    id: string;
    patientName: string;
    type: string;
    date: string;
    status: string;
  }[];
  upcomingAppointments: {
    id: string;
    patientName: string;
    date: string;
    type: string;
  }[];
  stats: {
    totalPatients: number;
    totalAppointments: number;
    pendingRecords: number;
  };
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] =
    useState<DoctorDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/doctor/dashboard", {
          headers: {
            "x-firebase-id": user.id,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || !user) {
    return null;
  }

  const firstName = user.name?.split(" ")[0] ?? user.email;

  return (
    <>
      <div className="flex items-center justify-between space-y-2 p-4 lg:p-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, Dr. {firstName}
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your patients and appointments.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UserNav />
        </div>
      </div>
      <Tabs
        defaultValue="overview"
        className="space-y-4 p-4 lg:p-8 pt-0 lg:pt-0"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-8" />
            </div>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.totalPatients || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active patients</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.totalAppointments || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Scheduled appointments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Records
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.pendingRecords || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Records to review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Patients
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.patients.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Under treatment</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Patient Records</CardTitle>
                <CardDescription>
                  Latest medical records from your patients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{record.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.type} - {record.date}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled patient appointments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type} - {appointment.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="patients" className="space-y-4">
          <DashboardHeader
            heading="Patient List"
            text="View and manage your patients."
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DashboardHeader>
          <DashboardShell>
            <div className="space-y-4">
              {dashboardData?.patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last visit: {patient.lastVisit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {patient.nextAppointment
                        ? `Next: ${patient.nextAppointment}`
                        : "No upcoming appointments"}
                    </p>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardShell>
        </TabsContent>
      </Tabs>
    </>
  );
}
