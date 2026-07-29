import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface DoctorOptions {
  dir?: string;
}

export async function doctor(options: DoctorOptions): Promise<void> {
  const schemaDir = resolve(process.cwd(), options.dir ?? "cms");
  const errors: string[] = [];
  const warnings: string[] = [];

  console.warn("Blaze CMS Health Check\n");

  // Node version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split(".")[0] ?? "0", 10);
  if (major >= 22) {
    console.warn(`  ✓ Node.js ${nodeVersion}`);
  } else {
    warnings.push(`Node.js ${nodeVersion} — v22+ recommended`);
    console.warn(`  ⚠ Node.js ${nodeVersion} (v22+ recommended)`);
  }

  // Firebase env vars (VITE_ prefixed — used by admin panel)
  const requiredVars = ["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_PROJECT_ID", "VITE_FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_APP_ID"];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      errors.push(`Missing ${v} in environment`);
      console.warn(`  ✗ ${v} not set`);
    } else {
      console.warn(`  ✓ ${v} set`);
    }
  }

  // Schema directories
  const collectionsDir = resolve(schemaDir, "collections");
  const globalsDir = resolve(schemaDir, "globals");
  const componentsDir = resolve(schemaDir, "components");

  if (existsSync(schemaDir)) {
    console.warn(`  ✓ Schema dir: ${schemaDir}`);
  } else {
    warnings.push(`Schema directory not found at ${schemaDir}`);
    console.warn(`  ⚠ Schema dir missing: ${schemaDir}`);
  }

  const colCount = existsSync(collectionsDir) ? readdirSync(collectionsDir).filter(f => f.endsWith(".ts")).length : 0;
  const globalCount = existsSync(globalsDir) ? readdirSync(globalsDir).filter(f => f.endsWith(".ts")).length : 0;
  const compCount = existsSync(componentsDir) ? readdirSync(componentsDir).filter(f => f.endsWith(".ts")).length : 0;

  console.warn(`  Collections: ${colCount} schema(s)`);
  console.warn(`  Globals: ${globalCount} schema(s)`);
  console.warn(`  Components: ${compCount} schema(s)`);

  // blaze-cms.config.ts
  const configPath = resolve(process.cwd(), "blaze-cms.config.ts");
  if (existsSync(configPath)) {
    console.warn(`  ✓ blaze-cms.config.ts`);
  } else {
    warnings.push("blaze-cms.config.ts not found");
    console.warn(`  ⚠ blaze-cms.config.ts missing`);
  }

  // Package.json blaze scripts
  const pkgPath = resolve(process.cwd(), "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const hasBlazeDep = !!(pkg.dependencies?.["@blaze-cms/cms"] || pkg.devDependencies?.["@blaze-cms/cms"]);
    console.warn(`  ${hasBlazeDep ? "✓" : "⚠"} @blaze-cms/cms dependency`);
  }

  console.warn("");

  if (errors.length > 0) {
    console.error(`  ${errors.length} error(s) found:`);
    for (const e of errors) console.error(`    ✗ ${e}`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`  ${warnings.length} warning(s) — review recommended.\n`);
  } else {
    console.warn("  All checks passed.\n");
  }
}
