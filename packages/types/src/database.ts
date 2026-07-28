export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: Record<string, "asc" | "desc"> | undefined;
  where?: Record<string, unknown> | undefined;
  select?: string[] | undefined;
  populate?: string[] | undefined;
}

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  findOne(
    collection: string,
    id: string,
    options?: QueryOptions,
  ): Promise<Record<string, unknown> | null>;
  findMany(
    collection: string,
    options?: QueryOptions,
  ): Promise<{ data: Record<string, unknown>[]; total: number }>;
  create(collection: string, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  update(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null>;
  delete(collection: string, id: string): Promise<boolean>;
  deleteMany(collection: string, ids: string[]): Promise<number>;

  transaction<T>(fn: () => Promise<T>): Promise<T>;
}
