import type React from "react"
import type { Metadata } from "next"
import { DashboardSidebar } from "./components/dashboard-sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Medical Records Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </DashboardSidebar>
    </div>
  );
}

