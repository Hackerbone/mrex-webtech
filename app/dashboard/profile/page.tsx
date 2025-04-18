"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/users/me", {
          headers: {
            "x-firebase-id": user.id,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${profile._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-id": user.id,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.image || ""} />
                <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{profile?.name}</h3>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={profile?.phoneNumber || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, phoneNumber: e.target.value } : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={profile?.address?.street || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: {
                              ...prev.address,
                              street: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile?.address?.city || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile?.address?.state || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, state: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={profile?.address?.zipCode || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: {
                              ...prev.address,
                              zipCode: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile?.address?.country || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: {
                              ...prev.address,
                              country: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
