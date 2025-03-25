"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Calendar, FileText, Plus, Search, Upload, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { RecentDocuments } from "@/app/dashboard/components/recent-documents"
import { UpcomingAppointments } from "@/app/dashboard/components/upcoming-appointments"
import { UserNav } from "@/app/dashboard/components/user-nav"

interface UserData {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("mrex_user")
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  // Show loading state or redirect if not logged in
  if (isLoading || !userData) {
    return null
  }

  // Get first name for welcome message
  const firstName = userData.name.split(" ")[0]

  return (
    <>
      <div className="flex items-center justify-between space-y-2 p-4 lg:p-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}</h2>
          <p className="text-muted-foreground">Here's an overview of your medical records and upcoming appointments.</p>
        </div>
        <div className="flex items-center space-x-2">
          <UserNav />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4 p-4 lg:p-8 pt-0 lg:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-8" />
            </div>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next: Mar 28, 2:30 PM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Doctors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+1 in the last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">Last checkup: 2 weeks ago</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Medical Records</CardTitle>
                <CardDescription>Your most recently added or updated medical documents.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDocuments />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments with healthcare providers.</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="records" className="space-y-4">
          <DashboardHeader heading="Medical Records" text="Manage and view all your medical documents.">
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </div>
          </DashboardHeader>
          <DashboardShell>
            <p className="text-muted-foreground">Your complete medical records will appear here.</p>
          </DashboardShell>
        </TabsContent>
        <TabsContent value="doctors" className="space-y-4">
          <DashboardHeader heading="Connected Doctors" text="Manage your healthcare providers and sharing permissions.">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Doctor
            </Button>
          </DashboardHeader>
          <DashboardShell>
            <p className="text-muted-foreground">Your connected healthcare providers will appear here.</p>
          </DashboardShell>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <DashboardHeader heading="Account Settings" text="Manage your account preferences and security settings.">
            <Button variant="outline">Save Changes</Button>
          </DashboardHeader>
          <DashboardShell>
            <p className="text-muted-foreground">Account settings and preferences will appear here.</p>
          </DashboardShell>
        </TabsContent>
      </Tabs>
    </>
  )
}

