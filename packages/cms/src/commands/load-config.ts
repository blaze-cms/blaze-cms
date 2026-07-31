import type { CapabilitiesConfig } from "@blazing-cms/types";

import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export interface LoadedProjectConfig {
  projectName: string;
  capabilities: CapabilitiesConfig | undefined;
}

const DEFAULT_PROJECT_NAME = "Blazing CMS";

export async function loadProjectConfig(cwd: string = process.cwd()): Promise<LoadedProjectConfig> {
  const configPath = resolve(cwd, "blazing-cms.config.ts");
  if (!existsSync(configPath)) {
    return { capabilities: undefined, projectName: DEFAULT_PROJECT_NAME };
  }
  try {
    const jiti = createJiti(import.meta.url, { moduleCache: false });
    const mod = (await jiti.import(configPath, { default: true })) as {
      projectName?: string;
      capabilities?: CapabilitiesConfig;
    };
    const projectName =
      typeof mod?.projectName === "string" && mod.projectName.length > 0
        ? mod.projectName
        : DEFAULT_PROJECT_NAME;
    return { capabilities: mod?.capabilities, projectName };
  } catch (err) {
    console.warn(
      `  ⚠ Could not load blazing-cms.config.ts (${err instanceof Error ? err.message : String(err)}). Falling back to defaults.`,
    );
    return { capabilities: undefined, projectName: DEFAULT_PROJECT_NAME };
  }
}
