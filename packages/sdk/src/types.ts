import type { User } from "firebase/auth";

export interface BlazeClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
  measurementId?: string;
}

export interface QueryFilter {
  field: string;
  op: "==" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "not-in" | "array-contains" | "array-contains-any";
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
