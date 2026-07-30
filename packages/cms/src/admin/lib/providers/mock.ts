import type { DataProvider, QueryOptions } from "./types";

const store: Map<string, Map<string, Record<string, unknown>>> = new Map();
const globalStore: Map<string, Record<string, unknown>> = new Map();

function getCollection(col: string): Map<string, Record<string, unknown>> {
  if (!store.has(col)) store.set(col, new Map());
  return store.get(col)!;
}

export const mockProvider: DataProvider = {
  name: "mock",
  type: "mock",

  async findOne(collectionName: string, id: string) {
    return getCollection(collectionName).get(id) ?? null;
  },

  async findMany(collectionName: string, options?: QueryOptions) {
    const col = getCollection(collectionName);
    let items = [...col.values()];
    if (options?.filter) {
      for (const [key, val] of Object.entries(options.filter)) {
        items = items.filter((item) => item[key] === val);
      }
    }
    if (options?.sort) {
      items.sort((a, b) => {
        const av = a[options.sort!] as string | number;
        const bv = b[options.sort!] as string | number;
        if (av < bv) return options?.order === "desc" ? 1 : -1;
        if (av > bv) return options?.order === "desc" ? -1 : 1;
        return 0;
      });
    }
    const pageSize = options?.limit ?? 25;
    const hasMore = items.length > pageSize;
    if (hasMore) items = items.slice(0, pageSize);
    return { data: items, hasMore };
  },

  async create(collectionName: string, data: Record<string, unknown>) {
    const id = (data.id as string) ?? crypto.randomUUID();
    getCollection(collectionName).set(id, { ...data, id, updatedAt: new Date().toISOString() });
    return id;
  },

  async update(collectionName: string, id: string, data: Record<string, unknown>) {
    const col = getCollection(collectionName);
    const existing = col.get(id);
    if (!existing) throw new Error(`Document ${id} not found in ${collectionName}`);
    const { id: _, ...rest } = data;
    col.set(id, { ...existing, ...rest, updatedAt: new Date().toISOString() });
  },

  async delete(collectionName: string, id: string) {
    getCollection(collectionName).delete(id);
  },

  async getGlobal(slug: string) {
    return globalStore.get(slug) ?? null;
  },

  async upsertGlobal(slug: string, data: Record<string, unknown>) {
    const existing = globalStore.get(slug) ?? {};
    globalStore.set(slug, { ...existing, ...data, updatedAt: new Date().toISOString() });
  },
};