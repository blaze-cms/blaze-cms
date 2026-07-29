import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode, ChangeEvent } from "react";

export function renderTextInput(field: FieldDefinition, value: unknown, onChange: (v: unknown) => void): ReactNode {
  switch (field.type) {
    case "richText":
      return (
        <textarea
          className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={String(value ?? "")}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder="Rich text content (HTML)..."
        />
      );
    case "markdown":
      return (
        <textarea
          className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={String(value ?? "")}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder="Markdown content..."
        />
      );
    case "code": {
      const lang = (field as { language?: string }).language ?? "text";
      return (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">{lang}</span>
          <textarea
            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={String(value ?? "")}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
