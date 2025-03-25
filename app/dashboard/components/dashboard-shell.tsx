import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn("bg-background rounded-lg border shadow-sm", className)} {...props}>
      <div className="p-4 md:p-6">{children}</div>
    </div>
  )
}

