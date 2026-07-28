import { createServer } from "../server/app.js";

export interface StartOptions {
  port?: number;
}

export async function start(options: StartOptions): Promise<void> {
  console.warn("Starting Blaze CMS production server...");
  const server = await createServer({
    config: {
      host: process.env.HOST ?? "0.0.0.0",
      port: options.port ?? Number(process.env.PORT ?? "3000"),
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
