import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode } from "react";

import { renderInputField, renderSwitchField, renderNumberField, renderTextareaField } from "./field-helpers";

export function renderBasicInput(field: FieldDefinition, value: unknown, onChange: (v: unknown) => void): ReactNode {
  switch (field.type) {
    case "text":
      return renderInputField(field, value, onChange, "text");
    case "textarea":
      return renderTextareaField(field, value, onChange);
    case "number":
      return renderNumberField(field, value, onChange);
    case "boolean":
      return renderSwitchField(field, value, onChange);
    case "date":
      return renderInputField(field, value, onChange, "date");
    case "datetime":
      return renderInputField(field, value, onChange, "datetime-local");
    case "email":
      return renderInputField(field, value, onChange, "email");
    case "password":
      return renderInputField(field, value, onChange, "password");
    case "url":
      return renderInputField(field, value, onChange, "url");
    case "json": {
      const str = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      return (
        <textarea
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={str}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              onChange(e.target.value);
            }
          }}
        />
      );
    }
    default:
      return null;
  }
}
