"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { FileText, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MedicalRecord {
  _id: string;
  name: string;
  type: string;
  date: string;
  doctor: string;
  notes?: string;
}

export default function RecordsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/records", {
          headers: {
            "x-user-id": user?.uid || "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }

        const data = await response.json();
        setRecords(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecords();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/records/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.uid || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        heading="Medical Records"
        text="Manage and view all your medical documents."
      >
        <div className="flex space-x-2">
          <Button onClick={() => router.push("/dashboard/records/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </DashboardHeader>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DashboardShell>
        {filteredRecords.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No records found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{record.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.type} • {record.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/records/${record._id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(record._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardShell>
    </div>
  );
}

