import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode } from "react";

import { renderBasicInput } from "./basic-inputs";
import { renderMediaInput } from "./media-inputs";
import { renderStructureInput } from "./structure-inputs";
import { renderTextInput } from "./text-inputs";

export function renderField(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
): ReactNode {
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

    case "select":
    case "multiSelect":
    case "radio":
    case "checkbox":
    case "relation":
    case "component":
    case "dynamicZone":
    case "array":
    case "object":
    case "tabs":
    case "group":
    case "repeater":
    case "slug":
      return renderStructureInput(field, value, onChange, id);

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unknown field type: {(field as FieldDefinition).type}
        </p>
      );
  }
}
