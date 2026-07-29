import type { FieldDefinition } from "@blaze-cms/types";
import type { ReactNode } from "react";

import { CodeEditor } from "@/components/field-types/code-editor";
import { MarkdownEditor } from "@/components/field-types/markdown-editor";
import { RichTextEditor } from "@/components/field-types/rich-text-editor";

export function renderTextInput(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  _id?: string,
): ReactNode {
  switch (field.type) {
    case "richText":
      return (
        <RichTextEditor
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
          placeholder={(field as { placeholder?: string }).placeholder}
        />
      );
    case "markdown":
      return <MarkdownEditor value={String(value ?? "")} onChange={(v) => onChange(v)} />;
    case "code":
      return (
        <CodeEditor
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
          language={(field as { language?: string }).language}
        />
      );
    default:
      return null;
  }
}
