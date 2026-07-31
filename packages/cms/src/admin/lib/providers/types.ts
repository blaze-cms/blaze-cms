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

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface AnalyticsByType {
  image: number;
  video: number;
  audio: number;
  document: number;
  other: number;
}

export interface AnalyticsQuery {
  period: AnalyticsPeriod;
  collections: string[];
  globals: string[];
}

export interface AnalyticsSummary {
  counts: {
    totalCollections: number;
    totalEntries: number;
    totalGlobals: number;
    totalMedia: number;
    totalUsers: number;
  };
  byCollection: Array<{ slug: string; count: number }>;
  changes: Array<{ date: string; count: number }>;
  storage: { totalBytes: number; byType: AnalyticsByType };
  activity: {
    activeUsers: number;
    topContributors: Array<{ userId: string; count: number }>;
  };
}

export interface DataProvider {
  name: string;
  type: "firebase" | "mock";

  findOne(collection: string, id: string): Promise<Record<string, unknown> | null>;
  findMany(
    collection: string,
    options?: QueryOptions,
  ): Promise<PaginatedResult<Record<string, unknown>>>;
  create(collection: string, data: Record<string, unknown>): Promise<string>;
  update(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;

  getGlobal(slug: string): Promise<Record<string, unknown> | null>;
  upsertGlobal(slug: string, data: Record<string, unknown>): Promise<void>;

  getAnalytics(query: AnalyticsQuery): Promise<AnalyticsSummary>;
}
