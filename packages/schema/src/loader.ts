import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blaze-cms/types";

import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface SchemaResult {
  collections: CollectionDefinition[];
  globals: GlobalDefinition[];
  components: ComponentDefinition[];
}

export class SchemaLoader {
  private schemaDir: string;

  constructor(schemaDir?: string) {
    this.schemaDir = schemaDir ?? resolve(process.cwd(), "cms");
  }

  setSchemaDir(dir: string): void {
    this.schemaDir = resolve(dir);
  }

  async load(): Promise<SchemaResult> {
    const collections = await this.loadFromDir<CollectionDefinition>("collections");
    const globals = await this.loadFromDir<GlobalDefinition>("globals");
    const components = await this.loadFromDir<ComponentDefinition>("components");
    return { collections, components, globals };
  }

  private async loadFromDir<T>(subdir: string): Promise<T[]> {
    const dir = resolve(this.schemaDir, subdir);
    if (!existsSync(dir)) return [];
    const entries = readdirSync(dir, { withFileTypes: true });
    const results: T[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || (!entry.name.endsWith(".ts") && !entry.name.endsWith(".js"))) continue;
      const filePath = resolve(dir, entry.name);
      const items = await tryLoadFile<T>(filePath);
      results.push(...items);
    }
    return results;
  }
}

async function tryLoadFile<T>(filePath: string): Promise<T[]> {
  try {
    const mod = (await import(filePath)) as Record<string, unknown>;
    const exported = Object.values(mod);
    const results: T[] = [];
    for (const val of exported) {
      if (val && typeof val === "object" && "slug" in val) {
        results.push(val as T);
      }
    }
    return results;
  } catch (err) {
    console.error(`Error loading schema file ${filePath}:`, err);
    return [];
  }
}
