import { createServer } from "../server/app.js";

export interface DevOptions {
  port?: number | undefined;
  host?: string | undefined;
}

export async function dev(options: DevOptions): Promise<void> {
  console.warn("Starting Blaze CMS dev server...");
  const server = await createServer({
    config: {
      host: options.host ?? "0.0.0.0",
      port: options.port ?? 3000,
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    },
  });

  await server.start();

  process.on("SIGINT", () => {
    void server.stop().then(() => process.exit(0));
  });
}
