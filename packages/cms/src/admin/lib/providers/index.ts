export { firebaseProvider } from "./firebase";
export { mockProvider } from "./mock";
export { getProvider, setProvider, resetProvider } from "./registry";
export { DataProviderWrapper, useDataProvider } from "./context";
export type { DataProvider, QueryOptions, PaginatedResult } from "./types";
