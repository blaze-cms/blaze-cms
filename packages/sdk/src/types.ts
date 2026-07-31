import type { User } from "firebase/auth";

export interface BlazeClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
  measurementId?: string;
  analytics?: AnalyticsConfig;
}

export interface AnalyticsConfig {
  /** Enable/disable analytics queries. Disabled analytics return empty results. */
  enabled?: boolean;
  /** How long analytics results are considered fresh, in milliseconds. */
  staleTimeMs?: number;
}

export interface QueryFilter {
  field: string;
  op:
    | "=="
    | "!="
    | ">"
    | ">="
    | "<"
    | "<="
    | "in"
    | "not-in"
    | "array-contains"
    | "array-contains-any";
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: { field: string; direction?: "asc" | "desc" };
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T = Record<string, unknown>> {
  data: T[];
  hasMore: boolean;
  cursor?: string;
}

export interface CollectionApi {
  findMany(options?: QueryOptions): Promise<PaginatedResult>;
  findById(id: string): Promise<Record<string, unknown> | null>;
  create(data: Record<string, unknown>): Promise<string>;
  update(id: string, data: Record<string, unknown>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface GlobalApi {
  get(slug: string): Promise<Record<string, unknown> | null>;
  upsert(slug: string, data: Record<string, unknown>): Promise<void>;
}

export interface AuthApi {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  onAuthChange(cb: (user: User | null) => void): () => void;
  getCurrentUser(): User | null;
}

export type AnalyticsPeriod = "7d" | "30d" | "90d";

/** Which collections/globals to include in analytics queries. */
export interface AnalyticsScope {
  /** Entry collection slugs (e.g. `["posts", "categories"]`). */
  collections?: string[];
  /** Global slugs. */
  globals?: string[];
}

export interface ContentCounts {
  totalCollections: number;
  totalEntries: number;
  totalGlobals: number;
  totalMedia: number;
  totalUsers: number;
}

export interface CollectionCount {
  slug: string;
  count: number;
}

export interface ChangesOverTimePoint {
  /** YYYY-MM-DD */
  date: string;
  count: number;
}

export interface ChangesOverTime {
  period: AnalyticsPeriod;
  points: ChangesOverTimePoint[];
}

export interface StorageByType {
  image: number;
  video: number;
  audio: number;
  document: number;
  other: number;
}

export interface StorageUsage {
  totalBytes: number;
  byType: StorageByType;
}

export interface TopContributor {
  userId: string;
  count: number;
}

export interface UserActivity {
  activeUsers: number;
  topContributors: TopContributor[];
}

export interface AnalyticsSummary {
  counts: ContentCounts;
  byCollection: CollectionCount[];
  changes: ChangesOverTime;
  storage: StorageUsage;
  activity: UserActivity;
}

export interface AnalyticsQueryOptions {
  period?: AnalyticsPeriod;
  scope?: AnalyticsScope;
}

export interface AnalyticsApi {
  /** Total entry/global/media/user counts, queried via Firestore aggregation. */
  getContentCounts(scope?: AnalyticsScope): Promise<ContentCounts>;
  /** Entry count per collection. */
  getContentByCollection(scope?: AnalyticsScope): Promise<CollectionCount[]>;
  /** Entry creation counts bucketed per day over the selected period. */
  getContentChangesOverTime(options?: AnalyticsQueryOptions): Promise<ChangesOverTime>;
  /** Total media storage and breakdown by file type. */
  getStorageUsage(): Promise<StorageUsage>;
  /** Active users and top contributors derived from authorship fields. */
  getUserActivity(options?: AnalyticsQueryOptions): Promise<UserActivity>;
  /** Combined summary for the dashboard. */
  getSummary(options?: AnalyticsQueryOptions): Promise<AnalyticsSummary>;
}
