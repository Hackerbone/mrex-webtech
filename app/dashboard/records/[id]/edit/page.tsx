"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RecordForm } from "@/app/dashboard/components/record-form";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";

export default function EditRecordPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/records/${params.id}`, {
          headers: {
            "x-firebase-id": user?.id || "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch record");
        }

        const data = await response.json();
        setRecord(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecord();
    }
  }, [params.id, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        heading="Edit Medical Record"
        text="Update the details of your medical record."
      />
      <div className="max-w-2xl">
        <RecordForm
          initialData={{
            id: record._id,
            name: record.name,
            type: record.type,
            date: new Date(record.date).toISOString().split("T")[0],
            doctor: record.doctor,
            notes: record.notes,
          }}
        />
      </div>
    </div>
  );
}
