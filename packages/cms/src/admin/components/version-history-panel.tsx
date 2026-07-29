import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";

interface Version {
  id: string;
  createdAt: string;
  author?: string;
}

interface VersionHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  versions: Version[];
  onRestore: (versionId: string) => void;
}

export function VersionHistoryPanel({ open, onClose, versions, onRestore }: VersionHistoryPanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 border-l bg-background shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4" /> Version History
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      <div className="overflow-y-auto p-4">
        {versions.length === 0 && (
          <p className="text-sm text-muted-foreground">No versions yet.</p>
        )}
        {versions.map((v) => (
          <div key={v.id} className="mb-2 rounded-md border p-3 text-sm">
            <p className="font-medium">{new Date(v.createdAt).toLocaleString()}</p>
            {v.author && <p className="text-xs text-muted-foreground">{v.author}</p>}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onRestore(v.id)}
            >
              <RotateCcw className="mr-1 h-3 w-3" /> Restore
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
