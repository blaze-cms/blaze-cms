import { FirestoreAdapter } from "@blaze-cms/database";
import { RouteGenerator, createHandlers } from "@blaze-cms/rest-api";
import { SchemaLoader } from "@blaze-cms/schema";
import Fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from "fastify";

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

  const loader = new SchemaLoader();
  const schema = await loader.load();

  registerHealth(app, adapter);
  registerErrorHandler(app);

  if (schema.collections.length > 0) {
    const routeGenerator = new RouteGenerator();
    const routes = routeGenerator.generateCollectionRoutes(schema.collections);
    const handlers = createHandlers({
      adapter,
      collections: schema.collections,
      globals: schema.globals,
    });

    for (const route of routes) {
      const handlerFn = async (request: FastifyRequest, reply: FastifyReply) => {
        const [action, slug] = route.handler.split(":");
        const collection = schema.collections.find((c) => c.slug === slug);
        if (!collection) {
          reply.code(404).send({ error: "Collection not found" });
          return;
        }

        try {
          const params = request.params as Record<string, string>;
          const body = request.body as Record<string, unknown>;
          const query = request.query as Record<string, string>;

          switch (action) {
            case "findMany": {
              const result = await handlers.findMany(collection.slug, {
                limit: query.limit ? Number(query.limit) : undefined,
                sort: query.sort
                  ? (JSON.parse(query.sort) as Record<string, "asc" | "desc">)
                  : undefined,
                where: query.where
                  ? (JSON.parse(query.where) as Record<string, unknown>)
                  : undefined,
              });
              reply.send(result);
              break;
            }
            case "findOne": {
              const result = await handlers.findOne(collection.slug, params.id as string);
              if (!result) reply.code(404).send({ error: "Not found" });
              else reply.send(result);
              break;
            }
            case "create": {
              const result = await handlers.create(collection.slug, body);
              reply.code(201).send(result);
              break;
            }
            case "update": {
              const result = await handlers.update(collection.slug, params.id as string, body);
              if (!result) reply.code(404).send({ error: "Not found" });
              else reply.send(result);
              break;
            }
            case "delete": {
              const deleted = await handlers.delete(collection.slug, params.id as string);
              if (!deleted) reply.code(404).send({ error: "Not found" });
              else reply.code(204).send();
              break;
            }
            default:
              reply.code(400).send({ error: "Unknown action" });
          }
        } catch (err) {
          reply.code(500).send({ error: err instanceof Error ? err.message : "Internal error" });
        }
      };

      app.route({
        handler: handlerFn,
        method: route.method,
        url: route.path,
      });
    }
  }

  for (const global of schema.globals) {
    app.get(`/api/globals/${global.slug}`, async (_req, reply) => {
      const result = await adapter.findOne(`globals_${global.slug}`, "default");
      reply.send(result ?? {});
    });

    app.put(`/api/globals/${global.slug}`, async (req, reply) => {
      const body = req.body as Record<string, unknown>;
      const existing = await adapter.findOne(`globals_${global.slug}`, "default");
      let result;
      if (existing) {
        result = await adapter.update(`globals_${global.slug}`, "default", body);
      } else {
        result = await adapter.create(`globals_${global.slug}`, { id: "default", ...body });
      }
      reply.send(result);
    });
  }

  app.get("/api/schemas", async (_req, reply) => {
    reply.send(schema);
  });

  app.get("/api/health", async (_req, reply) => {
    reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });

  return {
    adapter,
    app,
    async start() {
      const address = await app.listen({ host: serverConfig.host, port: serverConfig.port });
      console.warn(`Blaze CMS running at ${address}`);
      console.warn(`Firebase Project: ${serverConfig.firebase.projectId}`);
      console.warn(`Collections: ${schema.collections.map((c) => c.slug).join(", ")}`);
    },
    async stop() {
      await app.close();
      await adapter.disconnect();
    },
  };
}
