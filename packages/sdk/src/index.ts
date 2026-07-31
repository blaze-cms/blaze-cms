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
  MediaApi,
  MediaConfig,
  MediaFolder,
  MediaFoldersApi,
  MediaItem,
  MediaQueryOptions,
  MediaUploadOptions,
  MediaUsage,
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

export { createMediaApi } from "./media.js";
export {
  measureImage,
  mediaItemFromData,
  referencesValue,
  safeFileName,
  validateMediaFile,
} from "./media.js";
