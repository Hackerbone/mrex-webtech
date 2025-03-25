import { Calendar, Clock, MapPin, MoreHorizontal } from "lucide-react"

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

const appointments = [
  {
    id: "1",
    doctor: "Dr. Jane Smith",
    specialty: "Cardiologist",
    date: "Mar 28, 2025",
    time: "2:30 PM",
    location: "Heart Health Clinic",
    avatar: "JS",
  },
  {
    id: "2",
    doctor: "Dr. Robert Chen",
    specialty: "Dermatologist",
    date: "Apr 05, 2025",
    time: "10:15 AM",
    location: "Skin Care Center",
    avatar: "RC",
  },
  {
    id: "3",
    doctor: "Dr. Maria Garcia",
    specialty: "Neurologist",
    date: "Apr 12, 2025",
    time: "3:45 PM",
    location: "Neurology Associates",
    avatar: "MG",
  },
]

export function UpcomingAppointments() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{appointment.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{appointment.doctor}</p>
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {appointment.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {appointment.location}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem>Add to calendar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Cancel appointment</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        Schedule new appointment
      </Button>
    </div>
  )
}

