"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  progress: number
}

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [documentDate, setDocumentDate] = useState("")
  const [documentNotes, setDocumentNotes] = useState("")
  const [files, setFiles] = useState<FileUpload[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const simulateUpload = () => {
    setIsUploading(true)

    // Simulate progress updates
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          progress: Math.min(file.progress + 10, 100),
        })),
      )
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)

      // Store uploaded files in localStorage
      const existingRecords = JSON.parse(localStorage.getItem("mrex_records") || "[]")
      const newRecords = files.map((file) => ({
        id: file.id,
        name: file.name,
        type: documentType || "Medical Record",
        date: documentDate || new Date().toISOString().split("T")[0],
        notes: documentNotes,
        doctor: "Self Upload",
        uploadDate: new Date().toISOString(),
      }))

      localStorage.setItem("mrex_records", JSON.stringify([...existingRecords, ...newRecords]))

      // Redirect to records page
      router.push("/dashboard/records")
    }, 3000)
  }

  return (
    <div className="container px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Upload Medical Documents</h1>

        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
            <CardDescription>Add details about the document you're uploading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_results">Lab Results</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="imaging">Imaging/Scan</SelectItem>
                    <SelectItem value="visit_summary">Visit Summary</SelectItem>
                    <SelectItem value="vaccination">Vaccination Record</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentDate">Document Date</Label>
                <Input
                  id="documentDate"
                  type="date"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNotes">Notes</Label>
              <Textarea
                id="documentNotes"
                placeholder="Add any additional information about this document"
                value={documentNotes}
                onChange={(e) => setDocumentNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload Files</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center p-2 border rounded-md">
                      <div className="mr-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      {isUploading ? (
                        <div className="w-16 text-xs text-right">{file.progress}%</div>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="ml-2">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={simulateUpload} disabled={isUploading || files.length === 0} className="w-full sm:w-auto">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

