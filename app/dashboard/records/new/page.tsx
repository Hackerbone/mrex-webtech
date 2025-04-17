"use client";

import { RecordForm } from "@/app/dashboard/components/record-form";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";

export default function NewRecordPage() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        heading="Add New Medical Record"
        text="Enter the details of your new medical record."
      />
      <div className="max-w-2xl">
        <RecordForm />
      </div>
    </div>
  );
}
