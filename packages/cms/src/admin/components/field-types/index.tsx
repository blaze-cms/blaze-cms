import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode } from "react";
import { renderBasicInput } from "./basic-inputs";
import { renderTextInput } from "./text-inputs";
import { renderMediaInput } from "./media-inputs";
import { renderStructureInput } from "./structure-inputs";

export function renderField(field: FieldDefinition, value: unknown, onChange: (v: unknown) => void): ReactNode {
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
      return renderBasicInput(field, value, onChange);

    case "richText":
    case "markdown":
    case "code":
      return renderTextInput(field, value, onChange);

    case "media":
    case "upload":
    case "color":
      return renderMediaInput(field, value, onChange);

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
      return renderStructureInput(field, value, onChange);

    default:
      return <p className="text-sm text-muted-foreground">Unknown field type: {(field as FieldDefinition).type}</p>;
  }
}
