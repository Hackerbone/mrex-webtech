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

interface UpcomingAppointmentsProps {
  appointments: Array<{
    id: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
    notes?: string;
  }>;
}

export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  console.log(appointments);
  if (appointments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No upcoming appointments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {appointment.doctorName
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{appointment.doctorName}</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.type}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
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
  );
}

