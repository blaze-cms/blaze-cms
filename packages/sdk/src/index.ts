export { createBlazeClient } from "./client.js";
export type { BlazeClient } from "./client.js";
export type {
  AnalyticsApi,
  AnalyticsConfig,
  AnalyticsPeriod,
  AnalyticsQueryOptions,
  AnalyticsScope,
  AnalyticsSummary,
  BlazeClientConfig,
  ChangesOverTime,
  ChangesOverTimePoint,
  CollectionApi,
  CollectionCount,
  ContentCounts,
  GlobalApi,
  AuthApi,
  PaginatedResult,
  QueryFilter,
  QueryOptions,
  StorageByType,
  StorageUsage,
  TopContributor,
  UserActivity,
} from "./types.js";

export { BlazeError, NotFoundError, ValidationError } from "./errors.js";

export {
  aggregateAuthors,
  bucketByDay,
  categorizeMime,
  entryCollection,
  MEDIA_COLLECTION,
  periodStartISO,
  pickPrimaryAuthor,
  PERIOD_DAYS,
  toISOString,
  USERS_COLLECTION,
} from "./analytics.js";
