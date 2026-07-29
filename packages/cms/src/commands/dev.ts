import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, type ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_ROOT = path.resolve(__dirname, "../src/admin");

export interface DevOptions {
  port?: number;
  host?: string;
  emulator?: boolean;
}

export async function dev(options: DevOptions): Promise<void> {
  const port = options.port ?? 5173;
  const host = options.host ?? "localhost";

  console.warn(`\n  Blaze CMS Dev Server\n`);
  console.warn(`  Admin panel: http://${host}:${port}/admin/\n`);

  if (options.emulator) {
    console.warn("  Starting Firebase Emulator...");
    const { spawn } = await import("node:child_process");
    const emulator = spawn("npx", ["firebase", "emulators:start", "--only", "firestore,auth,storage"], {
      shell: true,
      stdio: "inherit",
    });
    emulator.on("exit", (code) => {
      if (code !== 0) console.error("Firebase Emulator exited with code", code);
    });
  }

  const server: ViteDevServer = await createServer({
    configFile: false,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": ADMIN_ROOT },
    },
    root: ADMIN_ROOT,
    server: { host, port },
  });

  await server.listen();
  server.printUrls();

  process.on("SIGINT", () => {
    void server.close().then(() => process.exit(0));
  });
}
