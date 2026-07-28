import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blaze-cms/types";

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import type { Generator } from "./generator.js";

export class ValidationGenerator implements Generator {
  name = "validation";

  async generate(
    collections: CollectionDefinition[],
    _globals: GlobalDefinition[],
    _components: ComponentDefinition[],
    outDir: string,
  ): Promise<void> {
    mkdirSync(outDir, { recursive: true });
    let output = 'import { z } from "zod";\n\n';

    for (const collection of collections) {
      const name = pascalCase(collection.slug);
      output += `export const ${name}Schema = z.object({\n`;
      output += `  id: z.string().optional(),\n`;
      for (const field of collection.fields) {
        const optional = field.validation?.required ? "" : ".optional()";
        output += `  ${field.name}: ${fieldTypeToZod(field.type)}${optional},\n`;
      }
      output += `});\n\n`;
      output += `export type ${name}Input = z.infer<typeof ${name}Schema>;\n\n`;
    }

    writeFileSync(resolve(outDir, "validation.ts"), output);
  }
}

function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_: string, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_: string, c: string) => c.toUpperCase());
}

function fieldTypeToZod(type: string): string {
  const map: Record<string, string> = {
    boolean: "z.boolean()",
    checkbox: "z.boolean()",
    code: "z.string()",
    color: "z.string()",
    date: "z.string()",
    datetime: "z.string()",
    email: "z.string().email()",
    json: "z.unknown()",
    markdown: "z.string()",
    media: "z.string()",
    multiSelect: "z.array(z.string())",
    number: "z.number()",
    password: "z.string()",
    radio: "z.string()",
    relation: "z.string()",
    richText: "z.string()",
    select: "z.string()",
    slug: "z.string()",
    text: "z.string()",
    textarea: "z.string()",
    upload: "z.string()",
    url: "z.string().url()",
  };
  return map[type] ?? "z.unknown()";
}
