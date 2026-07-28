import type { DatabaseAdapter, CollectionDefinition, GlobalDefinition } from "@blaze-cms/types";

export interface RouteConfig {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  handler: string;
}

export interface HandlerContext {
  adapter: DatabaseAdapter;
  collections: CollectionDefinition[];
  globals: GlobalDefinition[];
}
