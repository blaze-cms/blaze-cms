import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blaze-cms/types";

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import type { Generator } from "./generator.js";

export class SdkGenerator implements Generator {
  name = "sdk";

  async generate(
    collections: CollectionDefinition[],
    globals: GlobalDefinition[],
    _components: ComponentDefinition[],
    outDir: string,
  ): Promise<void> {
    mkdirSync(outDir, { recursive: true });
    let output = `// Auto-generated Blaze CMS SDK — do not edit\n\n`;
    output += `import { createClient } from "@blaze-cms/sdk";\n\n`;
    output += `const api = createClient({ baseUrl: "/api" });\n\n`;

    for (const collection of collections) {
      output += `export const ${camelCase(collection.slug)} = {\n`;
      output += `  findMany: (params?: Record<string, unknown>) => api.findMany("${collection.slug}", params),\n`;
      output += `  findOne: (id: string) => api.findOne("${collection.slug}", id),\n`;
      output += `  create: (data: Record<string, unknown>) => api.create("${collection.slug}", data),\n`;
      output += `  update: (id: string, data: Record<string, unknown>) => api.update("${collection.slug}", id, data),\n`;
      output += `  delete: (id: string) => api.delete("${collection.slug}", id),\n`;
      output += `};\n\n`;
    }

    for (const global of globals) {
      output += `export const ${camelCase(global.slug)} = {\n`;
      output += `  get: () => api.findOne("globals_${global.slug}", "default"),\n`;
      output += `  update: (data: Record<string, unknown>) => api.update("globals_${global.slug}", "default", data),\n`;
      output += `};\n\n`;
    }

    writeFileSync(resolve(outDir, "sdk.ts"), output);
  }
}

function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_: string, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_: string, c: string) => c.toUpperCase());
}

function camelCase(str: string): string {
  const p = pascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
