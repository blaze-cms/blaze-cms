import type { DatabaseAdapter, QueryOptions } from "@blaze-cms/types";

export class FirestoreRepository {
  private adapter: DatabaseAdapter;
  private collection: string;

  constructor(adapter: DatabaseAdapter, collection: string) {
    this.adapter = adapter;
    this.collection = collection;
  }

  async findOne(id: string, options?: QueryOptions): Promise<Record<string, unknown> | null> {
    return this.adapter.findOne(this.collection, id, options);
  }

  async findMany(
    options?: QueryOptions,
  ): Promise<{ data: Record<string, unknown>[]; total: number }> {
    return this.adapter.findMany(this.collection, options);
  }

  async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.adapter.create(this.collection, data);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    return this.adapter.update(this.collection, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.adapter.delete(this.collection, id);
  }

  async deleteMany(ids: string[]): Promise<number> {
    return this.adapter.deleteMany(this.collection, ids);
  }
}
