import { build as viteBuild, type InlineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_ROOT = path.resolve(__dirname, "../src/admin");

export interface BuildOptions {
  outDir?: string;
}

export async function build(_options: BuildOptions): Promise<void> {
  console.warn("\n  Blaze CMS Production Build\n");

  console.warn("  [1/3] Generating schema registry...");
  await generate({});

  console.warn("  [2/3] Building admin panel...");
  const config: InlineConfig = {
    configFile: false,
    root: ADMIN_ROOT,
    plugins: [react(), tailwindcss()],
    base: "/admin/",
    build: {
      outDir: path.resolve(ADMIN_ROOT, "../../dist/admin"),
      emptyOutDir: true,
    },
    resolve: {
      alias: { "@": ADMIN_ROOT },
    },
    logLevel: "warn",
  };

  await viteBuild(config);

  console.warn("  [3/3] Build complete.\n");
  console.warn(`  Output: dist/admin/\n`);
}
