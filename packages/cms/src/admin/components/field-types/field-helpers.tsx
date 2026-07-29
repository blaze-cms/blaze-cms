import type { FieldDefinition } from "@blaze-cms/types";
import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function renderInputField(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  type: string = "text",
  id?: string,
) {
  return (
    <Input
      id={id}
      type={type}
      value={String(value ?? "")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={field.admin?.placeholder}
    />
  );
}

export function renderSwitchField(
  _field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
) {
  return (
    <Switch
      id={id}
      checked={Boolean(value)}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.checked)}
    />
  );
}

export function renderNumberField(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
) {
  return (
    <Input
      id={id}
      type="number"
      value={String(value ?? "")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val === "" ? undefined : Number(val));
      }}
      placeholder={field.admin?.placeholder}
      min={field.validation?.min}
      max={field.validation?.max}
    />
  );
}

export function renderTextareaField(
  field: FieldDefinition,
  value: unknown,
  onChange: (v: unknown) => void,
  id?: string,
) {
  return (
    <textarea
      id={id}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={String(value ?? "")}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      placeholder={field.admin?.placeholder}
    />
  );
}
