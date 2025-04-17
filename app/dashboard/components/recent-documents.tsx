import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentDocumentsProps {
  records: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    doctor: string;
    notes?: string;
  }>;
}

export function RecentDocuments({ records }: RecentDocumentsProps) {
  if (records.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No recent documents found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
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
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      ))}
    </div>
  );
}
