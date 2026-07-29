import type { FieldDefinition } from "@blazing-cms/types";
import type { ReactNode, ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

export function renderMediaInput(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
): ReactNode {
  switch (field.type) {
    case "media":
    case "upload":
      return (
        <div className="space-y-2">
          <Input
            id={id}
            type="text"
            value={String(value ?? "")}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder="File URL or path..."
          />
          {value ? (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-xs text-muted-foreground">
              <span>Uploaded: {String(value)}</span>
            </div>
          ) : null}
        </div>
      );
    case "color": {
      const format = (field as { format?: string }).format ?? "hex";
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={String(value ?? "#000000")}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-md border"
          />
          <Input
            id={id}
            type="text"
            value={String(value ?? "")}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder={`Color value (${format})...`}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
