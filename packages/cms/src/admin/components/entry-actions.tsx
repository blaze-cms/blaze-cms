import { Button } from "@/components/ui/button";
import { Save, Eye, History, Trash2 } from "lucide-react";

interface EntryActionsProps {
  onSave?: () => void;
  onPreview?: () => void;
  onHistory?: () => void;
  onDelete?: () => void;
  saving?: boolean;
  deleting?: boolean;
}

export function EntryActions({ onSave, onPreview, onHistory, onDelete, saving, deleting }: EntryActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {onPreview && (
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="mr-1 h-4 w-4" /> Preview
        </Button>
      )}
      {onHistory && (
        <Button variant="outline" size="sm" onClick={onHistory}>
          <History className="mr-1 h-4 w-4" /> History
        </Button>
      )}
      {onDelete && (
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleting}>
          <Trash2 className="mr-1 h-4 w-4" /> {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
      {onSave && (
        <Button size="sm" onClick={onSave} disabled={saving}>
          <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
}
