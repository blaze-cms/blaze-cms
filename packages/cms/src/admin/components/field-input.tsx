import type { FieldDefinition } from "@blazing-cms/types";

import { renderBasicInput } from "@/components/field-types/basic-inputs";
import { renderMediaInput } from "@/components/field-types/media-inputs";
import { renderStructureInput, type RenderChild } from "@/components/field-types/structure-inputs";
import { renderTextInput } from "@/components/field-types/text-inputs";

interface FieldInputProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

const renderChild: RenderChild = (field, value, onChange) => (
  <FieldInput field={field} value={value} onChange={onChange} />
);

function renderField(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
) {
  switch (field.type) {
    case "text":
    case "textarea":
    case "number":
    case "boolean":
    case "date":
    case "datetime":
    case "email":
    case "password":
    case "url":
    case "json":
      return renderBasicInput(field, value, onChange, id);

    case "richText":
    case "markdown":
    case "code":
      return renderTextInput(field, value, onChange, id);

    case "media":
    case "upload":
    case "color":
      return renderMediaInput(field, value, onChange, id);

    default:
      return renderStructureInput(field, value, onChange, id, renderChild);
  }
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
