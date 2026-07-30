import type { FieldDefinition, FieldType } from "@blazing-cms/types";

import { createRoute, useParams, Link } from "@tanstack/react-router";
import {
  Construction,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

import {
  collections as registryCollections,
  globals as registryGlobals,
  components as registryComponents,
} from "@/__generated__/schema-registry";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appLayoutRoute } from "@/routes/app-layout";

export const schemaDetailRoute = createRoute({
  component: SchemaDetail,
  getParentRoute: () => appLayoutRoute,
  path: "/schemas/$type/$slug",
});

type SchemaType = "collection" | "global" | "component";

interface SchemaShape {
  slug: string;
  label: string;
  fields: FieldDefinition[];
  adminGroup?: string;
  description?: string;
  useAsTitle?: string;
  auth?: boolean;
}

function toPascal(slug: string) {
  return slug
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function generateCode(schema: SchemaShape, type: SchemaType): string {
  const label = schema.label || toPascal(schema.slug);
  const fieldsCode = schema.fields
    .map((f) => {
      const typeFn = fieldTypeToFactory(f);
      const args = [JSON.stringify(f.name)];
      const opts: Record<string, unknown> = {};
      if ((f as { required?: boolean }).required) opts.required = true;
      if (f.label && f.label !== toPascal(f.name)) opts.label = f.label;
      if (f.admin?.description) opts.description = f.admin.description;
      if (f.type === "relation") {
        opts.to = (f as { to: string }).to;
      }
      if (Object.keys(opts).length > 0)
        args.push(
          JSON.stringify(opts, null, 6)
            .replace(/\n\s{6}/g, " ")
            .replace(/\n\s{4}}/g, " }"),
        );
      return `    ${typeFn}(${args.join(", ")})`;
    })
    .join(",\n");

  const adminParts: string[] = [];
  if (schema.adminGroup) adminParts.push(`    group: ${JSON.stringify(schema.adminGroup)}`);
  if (schema.description) adminParts.push(`    description: ${JSON.stringify(schema.description)}`);
  if (schema.useAsTitle) adminParts.push(`    useAsTitle: ${JSON.stringify(schema.useAsTitle)}`);

  const extraParts: string[] = [];
  if (schema.auth) extraParts.push(`  auth: true,`);

  const adminCode = adminParts.length > 0 ? `  admin: {\n${adminParts.join(",\n")},\n  },` : "";

  if (type === "collection") {
    return `import { defineCollection, ${fieldImports(schema.fields).join(", ")} } from "@blazing-cms/schema";\n\nexport default defineCollection({\n  slug: ${JSON.stringify(schema.slug)},\n  labels: {\n    singular: ${JSON.stringify(schema.label || toPascal(schema.slug))},\n    plural: ${JSON.stringify(schema.label || toPascal(schema.slug))},\n  },${adminCode ? `\n${adminCode}` : ""}${extraParts.length > 0 ? `\n${extraParts.join("\n")}` : ""}\n  fields: [\n${fieldsCode},\n  ],\n});\n`;
  }
  if (type === "global") {
    return `import { defineGlobal, ${fieldImports(schema.fields).join(", ")} } from "@blazing-cms/schema";\n\nexport default defineGlobal({\n  slug: ${JSON.stringify(schema.slug)},\n  label: ${JSON.stringify(label)},${adminCode ? `\n${adminCode}` : ""}\n  fields: [\n${fieldsCode},\n  ],\n});\n`;
  }
  return `import { defineComponent, ${fieldImports(schema.fields).join(", ")} } from "@blazing-cms/schema";\n\nexport default defineComponent({\n  slug: ${JSON.stringify(schema.slug)},\n  label: ${JSON.stringify(label)},\n  fields: [\n${fieldsCode},\n  ],\n});\n`;
}

const FIELD_TYPE_MAP: Record<string, string> = {
  boolean: "boolean",
  checkbox: "checkbox",
  code: "code",
  color: "color",
  date: "date",
  datetime: "datetime",
  email: "email",
  json: "json",
  markdown: "markdown",
  media: "media",
  multiSelect: "multiSelect",
  number: "number",
  password: "password",
  radio: "radio",
  relation: "relation",
  richText: "richText",
  select: "select",
  slug: "slug",
  text: "text",
  textarea: "textarea",
  upload: "upload",
  url: "url",
};

function fieldTypeToFactory(f: FieldDefinition): string {
  return FIELD_TYPE_MAP[f.type] ?? f.type;
}

function fieldImports(fields: FieldDefinition[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const f of fields) {
    const name = fieldTypeToFactory(f);
    if (!seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  }
  return result;
}

const ALL_FIELD_TYPES: { value: string; label: string }[] = [
  { label: "Text", value: "text" },
  { label: "Textarea", value: "textarea" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Date", value: "date" },
  { label: "Date Time", value: "datetime" },
  { label: "Email", value: "email" },
  { label: "Password", value: "password" },
  { label: "URL", value: "url" },
  { label: "JSON", value: "json" },
  { label: "Rich Text", value: "richText" },
  { label: "Markdown", value: "markdown" },
  { label: "Code", value: "code" },
  { label: "Color", value: "color" },
  { label: "Media", value: "media" },
  { label: "File Upload", value: "upload" },
  { label: "Select", value: "select" },
  { label: "Multi Select", value: "multiSelect" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Relation", value: "relation" },
  { label: "Slug", value: "slug" },
];

function fieldDefault(name: string, type: FieldType): FieldDefinition {
  const base = {
    label: name.charAt(0).toUpperCase() + name.slice(1),
    name,
    type,
  } as FieldDefinition;
  if (type === "select" || type === "multiSelect" || type === "radio") {
    (base as unknown as Record<string, unknown>).options = [
      { label: "Option 1", value: "option1" },
    ];
  }
  if (type === "relation") {
    (base as unknown as Record<string, unknown>).to = "related-collection";
  }
  return base;
}

function FieldEditor({
  field,
  onChange,
  onDelete,
}: {
  field: FieldDefinition;
  onChange: (f: FieldDefinition) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 px-3 py-2">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
        <button onClick={() => setOpen(!open)} className="flex flex-1 items-center gap-2 text-left">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          <span className="text-sm font-medium">{field.name || "unnamed"}</span>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
            {field.type}
          </span>
          {(field as { required?: boolean }).required && (
            <span className="text-xs text-destructive">required</span>
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {open && (
        <div className="space-y-3 border-t p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input
                value={field.name}
                onChange={(e) => onChange({ ...field, name: e.target.value })}
                className="mt-0.5 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <select
                value={field.type}
                onChange={(e) => onChange(fieldDefault(field.name, e.target.value as FieldType))}
                className="mt-0.5 flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                {ALL_FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Label</Label>
              <Input
                value={field.label ?? ""}
                onChange={(e) => onChange({ ...field, label: e.target.value || undefined })}
                className="mt-0.5 h-8 text-sm"
                placeholder="Auto"
              />
            </div>
            <div>
              <Label className="text-xs">Required</Label>
              <input
                type="checkbox"
                checked={(field as { required?: boolean }).required ?? false}
                onChange={(e) => {
                  const f = { ...field } as unknown as Record<string, unknown>;
                  if (e.target.checked) f.required = true;
                  else delete f.required;
                  onChange(f as unknown as FieldDefinition);
                }}
                className="mt-2 block"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Input
              value={field.admin?.description ?? ""}
              onChange={(e) =>
                onChange({
                  ...field,
                  admin: { ...(field.admin ?? {}), description: e.target.value || undefined },
                })
              }
              className="mt-0.5 h-8 text-sm"
              placeholder="Optional help text"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SchemaDetail() {
  const { addToast } = useToast();
  const { slug, type } = useParams({ from: schemaDetailRoute.id });
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  if (import.meta.env.PROD) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Construction className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Schema Builder</h2>
        <p className="max-w-md text-muted-foreground">
          The schema builder is only available in local development mode.
        </p>
      </div>
    );
  }

  const source =
    type === "collection"
      ? registryCollections.find((c) => c.slug === slug)
      : type === "global"
        ? registryGlobals.find((g) => g.slug === slug)
        : type === "component"
          ? registryComponents.find((c) => c.slug === slug)
          : undefined;

  if (!source) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Schema not found</h2>
        <p className="text-muted-foreground">
          No {type} found with slug &quot;{slug}&quot;.
        </p>
        <Link to="/schemas">
          <Button variant="outline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Schemas
          </Button>
        </Link>
      </div>
    );
  }

  const [schema, setSchema] = useState<SchemaShape>(() => {
    const s = source as unknown as Record<string, unknown>;
    return {
      adminGroup: (s as unknown as { admin?: { group?: string } }).admin?.group,
      auth: (s as unknown as { auth?: boolean }).auth,
      description: (s as unknown as { admin?: { description?: string } }).admin?.description,
      fields: (s.fields as FieldDefinition[]) ?? [],
      label:
        (s as unknown as { label?: string; labels?: { singular?: string } }).label ??
        (s as unknown as { labels?: { singular?: string } }).labels?.singular ??
        slug,
      slug: s.slug as string,
      useAsTitle: (s as unknown as { admin?: { useAsTitle?: string } }).admin?.useAsTitle,
    };
  });

  function updateField(index: number, field: FieldDefinition) {
    const fields = [...schema.fields];
    fields[index] = field;
    setSchema({ ...schema, fields });
  }

  function removeField(index: number) {
    setSchema({ ...schema, fields: schema.fields.filter((_, i) => i !== index) });
  }

  function addField() {
    const name = `field${schema.fields.length + 1}`;
    setSchema({ ...schema, fields: [...schema.fields, fieldDefault(name, "text")] });
  }

  async function handleCopy() {
    const code = generateCode(schema, type as SchemaType);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast({ description: "Schema code copied.", title: "Copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        description: "Could not access clipboard",
        title: "Copy failed",
        variant: "destructive",
      });
    }
  }

  async function handleSave() {
    const code = generateCode(schema, type as SchemaType);
    setSaving(true);
    try {
      const dir =
        type === "collection" ? "collections" : type === "global" ? "globals" : "components";
      const res = await fetch("/__dev-api/save-schema", {
        body: JSON.stringify({ content: code, filename: `${dir}/${schema.slug}.ts` }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        addToast({ description: `Saved to ${data.path}`, title: "Schema Saved!" });
      } else {
        addToast({
          description: data.error ?? "Unknown error",
          title: "Save failed",
          variant: "destructive",
        });
      }
    } catch {
      addToast({
        description: "Could not reach dev server",
        title: "Save failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  const code = generateCode(schema, type as SchemaType);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/schemas">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{schema.label || schema.slug}</h1>
            <p className="text-xs text-muted-foreground">
              {type} &middot; {schema.slug} &middot; {schema.fields.length} field(s)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Schema"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Metadata</h2>
          <div className="mb-6 space-y-3 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Slug</Label>
                <Input
                  value={schema.slug}
                  onChange={(e) => setSchema({ ...schema, slug: e.target.value })}
                  className="mt-0.5 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={schema.label}
                  onChange={(e) => setSchema({ ...schema, label: e.target.value })}
                  className="mt-0.5 h-8 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Admin Group</Label>
                <Input
                  value={schema.adminGroup ?? ""}
                  onChange={(e) =>
                    setSchema({ ...schema, adminGroup: e.target.value || undefined })
                  }
                  className="mt-0.5 h-8 text-sm"
                  placeholder="e.g. Content"
                />
              </div>
              {type === "collection" && (
                <div>
                  <Label className="text-xs">Use as Title</Label>
                  <Input
                    value={schema.useAsTitle ?? ""}
                    onChange={(e) =>
                      setSchema({ ...schema, useAsTitle: e.target.value || undefined })
                    }
                    className="mt-0.5 h-8 text-sm"
                    placeholder="Field name"
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                value={schema.description ?? ""}
                onChange={(e) => setSchema({ ...schema, description: e.target.value || undefined })}
                className="mt-0.5 h-8 text-sm"
              />
            </div>
            {type === "collection" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schema.auth ?? false}
                  onChange={(e) => setSchema({ ...schema, auth: e.target.checked || undefined })}
                />
                <span className="text-sm">Auth (user collection)</span>
              </label>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fields</h2>
            <Button size="sm" onClick={addField}>
              <Plus className="mr-1 h-4 w-4" /> Add Field
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {schema.fields.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No fields defined yet.
              </p>
            ) : (
              schema.fields.map((field, i) => (
                <FieldEditor
                  key={`${field.name}-${i}`}
                  field={field}
                  onChange={(f) => updateField(i, f)}
                  onDelete={() => removeField(i)}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Generated Code</h2>
          <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-relaxed">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}
