import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorSelect } from "./doctor-select";
import { Checkbox } from "@/components/ui/checkbox";

interface RecordFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: string;
    date: string;
    doctor: string;
    notes?: string;
    sharedWith?: string[];
  };
  onSuccess?: () => void;
}

export function RecordForm({ initialData, onSuccess }: RecordFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    doctor: initialData?.doctor || "",
    notes: initialData?.notes || "",
    sharedWith: initialData?.sharedWith || [],
  });
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(
    initialData?.sharedWith || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = initialData?.id
        ? `/api/records/${initialData.id}`
        : "/api/records";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-firebase-id": user?.id || "",
        },
        body: JSON.stringify({
          ...formData,
          sharedWith: selectedDoctors,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save record");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/records");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    if (selectedDoctors.includes(doctorId)) {
      setSelectedDoctors(selectedDoctors.filter((id) => id !== doctorId));
    } else {
      setSelectedDoctors([...selectedDoctors, doctorId]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Record Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Record Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select record type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lab Results">Lab Results</SelectItem>
            <SelectItem value="Imaging">Imaging</SelectItem>
            <SelectItem value="Vaccination">Vaccination</SelectItem>
            <SelectItem value="Prescription">Prescription</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor">Doctor</Label>
        <Input
          id="doctor"
          value={formData.doctor}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, doctor: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      <div className="space-y-4">
        <Label>Share with Doctors</Label>
        <div className="border rounded-md p-4 space-y-4">
          <DoctorSelect
            value=""
            onValueChange={handleDoctorSelect}
            placeholder="Select a doctor to share with"
          />

          {selectedDoctors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Doctors:</Label>
              <div className="space-y-1">
                {selectedDoctors.map((doctorId) => (
                  <div key={doctorId} className="flex items-center space-x-2">
                    <Checkbox
                      id={doctorId}
                      checked={true}
                      onCheckedChange={() => handleDoctorSelect(doctorId)}
                    />
                    <Label htmlFor={doctorId} className="text-sm">
                      {doctorId}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
