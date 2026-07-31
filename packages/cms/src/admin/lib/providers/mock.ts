import type { AnalyticsQuery, AnalyticsSummary, DataProvider, QueryOptions } from "./types";

import {
  aggregateAuthors,
  authorFields,
  bucketByDay,
  PERIOD_DAYS,
  sumMediaUsage,
  toISOString,
} from "./analytics-helpers";

const MEDIA = "media";
const USERS = "users";

const store: Map<string, Map<string, Record<string, unknown>>> = new Map();
const globalStore: Map<string, Record<string, unknown>> = new Map();

function getCollection(col: string): Map<string, Record<string, unknown>> {
  if (!store.has(col)) store.set(col, new Map());
  return store.get(col) ?? new Map<string, Record<string, unknown>>();
}

function pushEntryActivity(
  entries: Iterable<Record<string, unknown>>,
  startMs: number,
  allDates: string[],
  authors: string[],
): void {
  for (const entry of entries) {
    const createdAt = toISOString(entry.createdAt);
    if (createdAt && new Date(createdAt).getTime() >= startMs) allDates.push(createdAt);
    authors.push(...authorFields(entry));
  }
}

function collectEntries(
  collections: string[],
  startMs: number,
): {
  allDates: string[];
  authors: string[];
  byCollection: Array<{ slug: string; count: number }>;
  totalEntries: number;
} {
  const byCollection: Array<{ slug: string; count: number }> = [];
  let totalEntries = 0;
  const allDates: string[] = [];
  const authors: string[] = [];
  for (const slug of collections) {
    const entries = [...getCollection(slug).values()];
    byCollection.push({ count: entries.length, slug });
    totalEntries += entries.length;
    pushEntryActivity(entries, startMs, allDates, authors);
  }
  return { allDates, authors, byCollection, totalEntries };
}

async function getAnalytics(queryOpts: AnalyticsQuery): Promise<AnalyticsSummary> {
  const { collections, globals, period } = queryOpts;
  const startMs = Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;

  const { allDates, authors, byCollection, totalEntries } = collectEntries(collections, startMs);

  let totalGlobals = 0;
  for (const slug of globals) {
    if (globalStore.has(slug)) totalGlobals += 1;
  }

  const mediaRecords = [...getCollection(MEDIA).values()];
  const storage = sumMediaUsage(mediaRecords);

  return {
    activity: aggregateAuthors(authors),
    byCollection,
    changes: bucketByDay(allDates),
    counts: {
      totalCollections: collections.length,
      totalEntries,
      totalGlobals,
      totalMedia: getCollection(MEDIA).size,
      totalUsers: getCollection(USERS).size,
    },
    storage,
  };
}

export const mockProvider: DataProvider = {
  async create(collectionName: string, data: Record<string, unknown>) {
    const id = (data.id as string) ?? crypto.randomUUID();
    getCollection(collectionName).set(id, { ...data, id, updatedAt: new Date().toISOString() });
    return id;
  },
  async delete(collectionName: string, id: string) {
    getCollection(collectionName).delete(id);
  },

  async findMany(collectionName: string, options?: QueryOptions) {
    const col = getCollection(collectionName);
    let items = [...col.values()];
    if (options?.filter) {
      for (const [key, val] of Object.entries(options.filter)) {
        items = items.filter((item) => item[key] === val);
      }
    }
    const sortKey = options?.sort;
    if (sortKey) {
      items.sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
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

  async findOne(collectionName: string, id: string) {
    return getCollection(collectionName).get(id) ?? null;
  },

  async getAnalytics(queryOpts: AnalyticsQuery) {
    return getAnalytics(queryOpts);
  },

  async getGlobal(slug: string) {
    return globalStore.get(slug) ?? null;
  },

  name: "mock",

  type: "mock",

  async update(collectionName: string, id: string, data: Record<string, unknown>) {
    const col = getCollection(collectionName);
    const existing = col.get(id);
    if (!existing) throw new Error(`Document ${id} not found in ${collectionName}`);
    const { id: _, ...rest } = data;
    col.set(id, { ...existing, ...rest, updatedAt: new Date().toISOString() });
  },

  async upsertGlobal(slug: string, data: Record<string, unknown>) {
    const existing = globalStore.get(slug) ?? {};
    globalStore.set(slug, { ...existing, ...data, updatedAt: new Date().toISOString() });
  },
};
