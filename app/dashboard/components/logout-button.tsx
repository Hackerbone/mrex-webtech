"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
