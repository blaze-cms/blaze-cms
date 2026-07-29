import type { FieldDefinition } from "@blaze-cms/types";

import { renderField } from "@/components/field-types/index";

interface FieldInputProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function FieldInput({ error, field, onChange, value }: FieldInputProps) {
  const fieldId = `field-${field.name}`;
  return (
    <div className="space-y-2">
      {field.type === "tabs" || field.type === "dynamicZone" ? null : (
        <label htmlFor={fieldId} className="text-sm font-medium">
          {field.label ?? field.name}
          {field.validation?.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {field.admin?.description && (
        <p className="text-xs text-muted-foreground">{field.admin.description}</p>
      )}
      {renderField(field, value, onChange, fieldId)}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
