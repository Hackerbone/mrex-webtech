"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import {
  getUserByUid,
  updateUserPreferences,
  getAllUsers,
  updateUserRole,
  UserData,
} from "@/lib/userService";
import { UserSettings } from "@/types/user";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    theme: "system",
    language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/users/${user?.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();
        setSettings(data.preferences);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user, router]);

  const fetchUsers = async () => {
    if (!user) return;
    setIsLoadingUsers(true);

    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      const response = await fetch(`/api/users/${user?.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: updatedSettings }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleUserRoleChange = async (userId: string, isAdmin: boolean) => {
    if (!user) return;

    try {
      await updateUserRole(userId, isAdmin);
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  handleSettingChange("notifications", {
                    ...settings.notifications,
                    email: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Email Notifications
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  handleSettingChange("notifications", {
                    ...settings.notifications,
                    push: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Push Notifications
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.marketing}
                onChange={(e) =>
                  handleSettingChange("notifications", {
                    ...settings.notifications,
                    marketing: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Marketing Communications
            </label>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange("language", e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {user?.isAdmin && (
        <div className="mt-6">
          <Button onClick={fetchUsers} disabled={isLoadingUsers}>
            {isLoadingUsers ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Users"
            )}
          </Button>

          <div className="mt-4 space-y-4">
            {users.map((user) => (
              <div
                key={user._id?.toString()}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor={`admin-${user._id}`}>Admin</Label>
                  <Switch
                    id={`admin-${user._id}`}
                    checked={user.isAdmin}
                    onCheckedChange={(checked) =>
                      handleUserRoleChange(user.uid, checked)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
