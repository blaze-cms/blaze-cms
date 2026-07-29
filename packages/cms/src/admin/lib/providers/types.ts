import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blazing-cms/types";

export interface QueryOptions {
  limit?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}

export interface DataProvider {
  name: string;
  type: "firebase" | "server" | "mock";

  getCollections(): Promise<CollectionDefinition[]>;
  getGlobals(): Promise<GlobalDefinition[]>;
  getComponents(): Promise<ComponentDefinition[]>;

  findOne(collection: string, id: string): Promise<Record<string, unknown> | null>;
  findMany(collection: string, options?: QueryOptions): Promise<PaginatedResult<Record<string, unknown>>>;
  create(collection: string, data: Record<string, unknown>): Promise<string>;
  update(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;

  getGlobal(slug: string): Promise<Record<string, unknown> | null>;
  upsertGlobal(slug: string, data: Record<string, unknown>): Promise<void>;
}
