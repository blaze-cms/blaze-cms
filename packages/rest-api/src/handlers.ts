import type { QueryOptions } from "@blaze-cms/types";

import type { HandlerContext } from "./types.js";

export function createHandlers(context: HandlerContext) {
  return {
    async create(collection: string, data: Record<string, unknown>) {
      return context.adapter.create(collection, data);
    },

    async delete(collection: string, id: string) {
      return context.adapter.delete(collection, id);
    },

    async deleteMany(collection: string, ids: string[]) {
      return context.adapter.deleteMany(collection, ids);
    },

    async findMany(collection: string, options?: QueryOptions) {
      return context.adapter.findMany(collection, options);
    },

    async findOne(collection: string, id: string, options?: QueryOptions) {
      return context.adapter.findOne(collection, id, options);
    },

    async update(collection: string, id: string, data: Record<string, unknown>) {
      return context.adapter.update(collection, id, data);
    },
  };
}
