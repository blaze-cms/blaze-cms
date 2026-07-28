import { existsSync } from "node:fs";
import { resolve } from "node:path";

export interface DoctorOptions {
  dir?: string;
}

export async function doctor(options: DoctorOptions): Promise<void> {
  const schemaDir = resolve(process.cwd(), options.dir ?? "cms");
  let issues = 0;

  console.warn("Blaze CMS Health Check\n");

  // Check Node version
  const nodeVersion = process.version;
  console.warn(
    `Node.js: ${nodeVersion} ${nodeVersion.startsWith("v22") ? "✓" : "⚠ (v22+ recommended)"}`,
  );

  // Check Firebase env vars
  const projectId = process.env.FIREBASE_PROJECT_ID;
  console.warn(`Firebase Project: ${projectId ? projectId : "✗ Not set"}`);
  if (!projectId) issues++;

  // Check schema dir
  const collectionsDir = resolve(schemaDir, "collections");
  const globalsDir = resolve(schemaDir, "globals");
  console.warn(`Schema collections: ${existsSync(collectionsDir) ? "✓" : "✗ Missing"}`);
  console.warn(`Schema globals: ${existsSync(globalsDir) ? "✓" : "✗ Missing"}`);

  if (issues > 0) {
    console.error(`\n${issues} issue(s) found.`);
    process.exit(1);
  } else {
    console.warn("\nAll checks passed.");
  }
}
