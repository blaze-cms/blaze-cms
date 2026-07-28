import type { FirestoreAdapter } from "@blaze-cms/database";
import type { FastifyInstance } from "fastify";

export function registerHealth(app: FastifyInstance, _adapter: FirestoreAdapter): void {
  app.get("/api/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}
