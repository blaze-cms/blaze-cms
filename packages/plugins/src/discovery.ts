import type { PluginDefinition } from "@blazing-cms/types";

import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export async function discoverPlugins(scope?: string): Promise<PluginDefinition[]> {
  const plugins: PluginDefinition[] = [];
  const nodeModulesDir = resolve(process.cwd(), "node_modules");

  try {
    const entries = readdirSync(nodeModulesDir);
    const prefix = scope ? `${scope}/blazing-cms-plugin-` : "blazing-cms-plugin-";

    for (const entry of entries) {
      if (!entry.startsWith(prefix)) continue;
      const plugin = await tryLoadPlugin(entry);
      if (plugin) plugins.push(plugin);
    }
  } catch {
    // node_modules not found
  }

  return plugins;
}

async function tryLoadPlugin(entry: string): Promise<PluginDefinition | null> {
  try {
    const mod = (await import(entry)) as { default?: PluginDefinition };
    return mod.default ?? null;
  } catch {
    return null;
  }
}
