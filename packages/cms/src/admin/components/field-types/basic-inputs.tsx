import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode } from "react";

import {
  renderInputField,
  renderSwitchField,
  renderNumberField,
  renderTextareaField,
} from "./field-helpers";

export function renderBasicInput(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
): ReactNode {
  switch (field.type) {
    case "text":
      return renderInputField(field, value, onChange, "text", id);
    case "textarea":
      return renderTextareaField(field, value, onChange, id);
    case "number":
      return renderNumberField(field, value, onChange, id);
    case "boolean":
      return renderSwitchField(field, value, onChange, id);
    case "date":
      return renderInputField(field, value, onChange, "date", id);
    case "datetime":
      return renderInputField(field, value, onChange, "datetime-local", id);
    case "email":
      return renderInputField(field, value, onChange, "email", id);
    case "password":
      return renderInputField(field, value, onChange, "password", id);
    case "url":
      return renderInputField(field, value, onChange, "url", id);
    case "json": {
      const str = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      return (
        <textarea
          id={id}
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
