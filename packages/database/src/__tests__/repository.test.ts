import type { DatabaseAdapter } from "@blazing-cms/types";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { FirestoreRepository } from "../repository.js";

type Mocked<T> = T & { [K in keyof T]: T[K] & ReturnType<typeof vi.fn> };

describe("FirestoreRepository", () => {
  const mockAdapter = {
    connect: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    disconnect: vi.fn(),
    findMany: vi.fn(),
    findOne: vi.fn(),
    transaction: vi.fn(),
  } as unknown as Mocked<DatabaseAdapter>;

  const repo = new FirestoreRepository(mockAdapter, "posts");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("findOne delegates with collection name", async () => {
    mockAdapter.findOne.mockResolvedValue({ id: "1", title: "Post" });
    const result = await repo.findOne("1");
    expect(result).toEqual({ id: "1", title: "Post" });
    expect(mockAdapter.findOne).toHaveBeenCalledWith("posts", "1", undefined);
  });

  it("findMany delegates with collection name", async () => {
    mockAdapter.findMany.mockResolvedValue({ data: [{ id: "1" }], total: 1 });
    const result = await repo.findMany({ limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(mockAdapter.findMany).toHaveBeenCalledWith("posts", { limit: 10 });
  });

  it("create delegates with collection name", async () => {
    mockAdapter.create.mockResolvedValue({ id: "new-id", title: "New" });
    const result = await repo.create({ title: "New" });
    expect(result.id).toBe("new-id");
    expect(mockAdapter.create).toHaveBeenCalledWith("posts", { title: "New" });
  });

  it("update delegates with collection name and id", async () => {
    mockAdapter.update.mockResolvedValue({ id: "1", title: "Updated" });
    const result = await repo.update("1", { title: "Updated" });
    expect(result?.title).toBe("Updated");
    expect(mockAdapter.update).toHaveBeenCalledWith("posts", "1", { title: "Updated" });
  });

  it("delete delegates with collection name", async () => {
    mockAdapter.delete.mockResolvedValue(true);
    const result = await repo.delete("1");
    expect(result).toBe(true);
    expect(mockAdapter.delete).toHaveBeenCalledWith("posts", "1");
  });

  it("deleteMany delegates with collection name", async () => {
    mockAdapter.deleteMany.mockResolvedValue(2);
    const result = await repo.deleteMany(["1", "2"]);
    expect(result).toBe(2);
    expect(mockAdapter.deleteMany).toHaveBeenCalledWith("posts", ["1", "2"]);
  });

  it("returns null from findOne when not found", async () => {
    mockAdapter.findOne.mockResolvedValue(null);
    const result = await repo.findOne("missing");
    expect(result).toBeNull();
  });

  it("returns null from update when not found", async () => {
    mockAdapter.update.mockResolvedValue(null);
    const result = await repo.update("missing", { title: "X" });
    expect(result).toBeNull();
  });
});
