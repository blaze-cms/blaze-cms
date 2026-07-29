export { createBlazeClient } from "./client.js";
export type { BlazeClient } from "./client.js";
export type {
  BlazeClientConfig,
  CollectionApi,
  GlobalApi,
  AuthApi,
  QueryOptions,
  QueryFilter,
  PaginatedResult,
} from "./types.js";

export { BlazeError, NotFoundError, ValidationError } from "./errors.js";
