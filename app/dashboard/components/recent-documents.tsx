import { FileText, MoreHorizontal } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const documents = [
  {
    id: "1",
    name: "Blood Test Results",
    date: "Mar 15, 2025",
    doctor: "Dr. Jane Smith",
    type: "Lab Results",
    avatar: "JS",
  },
  {
    id: "2",
    name: "Annual Physical Exam",
    date: "Feb 28, 2025",
    doctor: "Dr. Robert Chen",
    type: "Examination",
    avatar: "RC",
  },
  {
    id: "3",
    name: "Vaccination Record",
    date: "Jan 12, 2025",
    doctor: "Dr. Maria Garcia",
    type: "Immunization",
    avatar: "MG",
  },
  {
    id: "4",
    name: "Allergy Test Results",
    date: "Dec 05, 2024",
    doctor: "Dr. James Wilson",
    type: "Lab Results",
    avatar: "JW",
  },
]

export function RecentDocuments() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {documents.map((document) => (
          <div key={document.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{document.name}</p>
                <p className="text-sm text-muted-foreground">{document.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end">
                <p className="text-sm">{document.date}</p>
                <p className="text-xs text-muted-foreground">{document.doctor}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{document.avatar}</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Share with doctor</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        View all records
      </Button>
    </div>
  )
}

