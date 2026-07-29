import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { build } from "./build.js";

export interface DeployOptions {
  project?: string;
}

export async function deploy(options: DeployOptions): Promise<void> {
  console.warn("\n  Blazing CMS Deploy\n");

  // Check for firebase.json
  const firebaseJson = resolve(process.cwd(), "firebase.json");
  if (!existsSync(firebaseJson)) {
    console.error("  ✗ firebase.json not found. Run `firebase init hosting` first.");
    process.exit(1);
  }

  console.warn("  [1/2] Building admin panel...");
  await build({});

  console.warn("  [2/2] Deploying to Firebase Hosting...");
  const projectFlag = options.project ? ` --project ${options.project}` : "";
  execSync(`npx firebase deploy --only hosting${projectFlag}`, {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  console.warn("\n  ✓ Deploy complete.\n");
}
