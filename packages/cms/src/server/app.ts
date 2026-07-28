import { FirestoreAdapter } from "@blaze-cms/database";
import Fastify, { type FastifyInstance } from "fastify";

import { createServerConfig, type ServerConfig } from "./config.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerHealth } from "./plugins/health.js";

export interface AppOptions {
  config?: Partial<ServerConfig>;
  firebase?: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
    storageBucket?: string;
  };
}

export async function createServer(options: AppOptions = {}): Promise<{
  start: () => Promise<void>;
  stop: () => Promise<void>;
  app: FastifyInstance;
  adapter: FirestoreAdapter;
}> {
  const serverConfig = createServerConfig();

  if (options.config) {
    Object.assign(serverConfig, options.config);
  }
  if (options.firebase) {
    Object.assign(serverConfig.firebase, options.firebase);
  }

  const app = Fastify({
    bodyLimit: 10 * 1024 * 1024,
    logger: { level: serverConfig.logger.level },
  });

  const adapter = new FirestoreAdapter();
  await adapter.connect(serverConfig.firebase);

  registerHealth(app, adapter);
  registerErrorHandler(app);

  return {
    adapter,
    app,
    async start() {
      const address = await app.listen({ host: serverConfig.host, port: serverConfig.port });
      console.warn(`Blaze CMS running at ${address}`);
      console.warn(`Firebase Project: ${serverConfig.firebase.projectId}`);
    },
    async stop() {
      await app.close();
      await adapter.disconnect();
    },
  };
}
