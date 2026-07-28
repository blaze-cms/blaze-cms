import type { CollectionDefinition, GlobalDefinition } from "@blaze-cms/types";

import type { RouteConfig } from "./types.js";

export class RouteGenerator {
  generateCollectionRoutes(collections: CollectionDefinition[]): RouteConfig[] {
    const routes: RouteConfig[] = [];
    for (const collection of collections) {
      routes.push(
        { handler: `findMany:${collection.slug}`, method: "GET", path: `/api/${collection.slug}` },
        {
          handler: `findOne:${collection.slug}`,
          method: "GET",
          path: `/api/${collection.slug}/:id`,
        },
        { handler: `create:${collection.slug}`, method: "POST", path: `/api/${collection.slug}` },
        {
          handler: `update:${collection.slug}`,
          method: "PATCH",
          path: `/api/${collection.slug}/:id`,
        },
        {
          handler: `delete:${collection.slug}`,
          method: "DELETE",
          path: `/api/${collection.slug}/:id`,
        },
        {
          handler: `deleteMany:${collection.slug}`,
          method: "DELETE",
          path: `/api/${collection.slug}/batch`,
        },
      );
    }
    return routes;
  }

  generateGlobalRoutes(globals: GlobalDefinition[]): RouteConfig[] {
    const routes: RouteConfig[] = [];
    for (const global of globals) {
      routes.push(
        { handler: `findOne:${global.slug}`, method: "GET", path: `/api/globals/${global.slug}` },
        { handler: `upsert:${global.slug}`, method: "PUT", path: `/api/globals/${global.slug}` },
      );
    }
    return routes;
  }
}
