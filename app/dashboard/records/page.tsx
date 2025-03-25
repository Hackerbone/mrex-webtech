"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, FileText, Plus, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MedicalRecord {
  id: string
  name: string
  type: string
  date: string
  doctor: string
  notes?: string
  uploadDate: string
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Get records from localStorage
    const storedRecords = localStorage.getItem("mrex_records")
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords))
    } else {
      // Set some dummy records if none exist
      const dummyRecords = [
        {
          id: "rec1",
          name: "Blood Test Results.pdf",
          type: "Lab Results",
          date: "2025-03-15",
          doctor: "Dr. Jane Smith",
          notes: "Annual checkup blood work",
          uploadDate: "2025-03-16T14:22:00Z",
        },
        {
          id: "rec2",
          name: "Chest X-Ray.jpg",
          type: "Imaging",
          date: "2025-02-28",
          doctor: "Dr. Robert Chen",
          notes: "Follow-up for respiratory symptoms",
          uploadDate: "2025-02-28T09:15:00Z",
        },
        {
          id: "rec3",
          name: "Vaccination Record.pdf",
          type: "Vaccination",
          date: "2025-01-12",
          doctor: "Dr. Maria Garcia",
          uploadDate: "2025-01-12T11:30:00Z",
        },
        {
          id: "rec4",
          name: "Allergy Test Results.pdf",
          type: "Lab Results",
          date: "2024-12-05",
          doctor: "Dr. James Wilson",
          notes: "Food and environmental allergen panel",
          uploadDate: "2024-12-06T16:45:00Z",
        },
      ]
      setRecords(dummyRecords)
      localStorage.setItem("mrex_records", JSON.stringify(dummyRecords))
    }
  }, [])

  // Filter records based on search query
  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container p-6 w-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto w-full justify-start sm:w-auto">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="lab">Lab Results</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Medical Records</CardTitle>
                <CardDescription>View and manage all your medical documents</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRecords.length > 0 ? (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden sm:table-cell">Date</TableHead>
                          <TableHead className="hidden lg:table-cell">Provider</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="line-clamp-1">{record.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{record.type}</TableCell>
                            <TableCell className="hidden sm:table-cell">{formatDate(record.date)}</TableCell>
                            <TableCell className="hidden lg:table-cell">{record.doctor}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-semibold">No records found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Upload your first medical document to get started"}
                    </p>
                    {!searchQuery && (
                      <Link href="/dashboard/upload" className="mt-4 inline-block">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Record
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Lab Results</CardTitle>
                <CardDescription>View and manage your laboratory test results</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table structure filtered for lab results */}
                <p className="text-center py-4 text-muted-foreground">Lab results will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imaging" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Imaging & Scans</CardTitle>
                <CardDescription>View and manage your X-rays, MRIs, and other imaging records</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table structure filtered for imaging */}
                <p className="text-center py-4 text-muted-foreground">Imaging records will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>View and manage your medication prescriptions and refill history</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table structure filtered for prescriptions */}
                <p className="text-center py-4 text-muted-foreground">Prescription records will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

