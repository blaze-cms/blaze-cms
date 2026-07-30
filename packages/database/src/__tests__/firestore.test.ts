import { describe, it, expect, vi, beforeEach } from "vitest";

import { FirestoreAdapter } from "../firestore.js";

const mocks = vi.hoisted(() => {
  const mockDoc = vi.fn();
  const mockCollection = vi.fn();
  const mockBatch = vi.fn();
  const mockRunTransaction = vi.fn();
  const mockGetFirestore = vi.fn(() => ({
    batch: mockBatch,
    collection: mockCollection,
    doc: mockDoc,
    runTransaction: mockRunTransaction,
  }));
  const mockGetApps = vi.fn(() => [] as Array<{ delete?: () => Promise<void>; name: string }>);
  const mockInitializeApp = vi.fn(() => ({ name: "blazing-cms" }));
  const mockCert = vi.fn(() => ({}));
  const mockApplicationDefault = vi.fn(() => ({}));

  class MockTimestamp {
    readonly seconds: number;
    readonly nanoseconds: number;
    constructor(seconds: number, nanoseconds: number) {
      this.seconds = seconds;
      this.nanoseconds = nanoseconds;
    }
    toDate() {
      return new Date(this.seconds * 1000);
    }
    static now() {
      return new MockTimestamp(1000, 0);
    }
    static fromDate(d: Date) {
      return new MockTimestamp(Math.floor(d.getTime() / 1000), 0);
    }
  }

  return {
    mockApplicationDefault,
    mockBatch,
    mockCert,
    mockCollection,
    mockDoc,
    mockGetApps,
    mockGetFirestore,
    mockInitializeApp,
    mockRunTransaction,
    MockTimestamp,
  };
});

vi.mock("firebase-admin/app", () => ({
  applicationDefault: mocks.mockApplicationDefault,
  cert: mocks.mockCert,
  getApps: mocks.mockGetApps,
  initializeApp: mocks.mockInitializeApp,
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: mocks.mockGetFirestore,
  Timestamp: mocks.MockTimestamp,
}));

const mockDocSnapshot = (exists: boolean, data?: Record<string, unknown>) => ({
  data: () => data ?? null,
  exists,
  id: "doc-1",
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockGetApps.mockReturnValue([]);
});

describe("FirestoreAdapter", () => {
  it("connect initializes firebase app", async () => {
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test-project" });
    expect(mocks.mockInitializeApp).toHaveBeenCalled();
    expect(mocks.mockGetFirestore).toHaveBeenCalled();
  });

  it("connect reuses existing app", async () => {
    mocks.mockGetApps.mockReturnValue([{ name: "blazing-cms" }]);
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test-project" });
    expect(mocks.mockInitializeApp).not.toHaveBeenCalled();
  });

  it("connect uses cert when privateKey and clientEmail provided", async () => {
    const adapter = new FirestoreAdapter();
    await adapter.connect({
      clientEmail: "admin@test.iam.gserviceaccount.com",
      privateKey: "-----BEGIN KEY-----\nkey\n-----END KEY-----",
      projectId: "test-project",
    });
    expect(mocks.mockCert).toHaveBeenCalled();
  });

  it("connect uses applicationDefault when no credentials", async () => {
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test-project" });
    expect(mocks.mockApplicationDefault).toHaveBeenCalled();
  });

  it("disconnect deletes the app", async () => {
    const deleteFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockGetApps.mockReturnValue([{ delete: deleteFn, name: "blazing-cms" }]);
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test-project" });
    await adapter.disconnect();
    expect(deleteFn).toHaveBeenCalled();
  });

  it("findOne returns null when doc does not exist", async () => {
    mocks.mockDoc.mockReturnValue({ get: vi.fn().mockResolvedValue(mockDocSnapshot(false)) });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.findOne("posts", "missing");
    expect(result).toBeNull();
  });

  it("findOne returns document data", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "Test", views: 10 }));
    mocks.mockDoc.mockReturnValue({ get: getFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = (await adapter.findOne("posts", "doc-1")) as Record<string, unknown>;
    expect(result.title).toBe("Test");
    expect(result.id).toBe("doc-1");
  });

  it("delete returns false when doc does not exist", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(false));
    mocks.mockDoc.mockReturnValue({ delete: vi.fn(), get: getFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.delete("posts", "missing");
    expect(result).toBe(false);
  });

  it("delete returns true when doc exists", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, {}));
    const deleteFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ delete: deleteFn, get: getFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.delete("posts", "doc-1");
    expect(result).toBe(true);
    expect(deleteFn).toHaveBeenCalled();
  });

  it("deleteMany uses batch delete", async () => {
    const commitFn = vi.fn().mockResolvedValue(undefined);
    const deleteFn = vi.fn();
    mocks.mockDoc.mockReturnValue({ delete: deleteFn });
    mocks.mockBatch.mockReturnValue({ commit: commitFn, delete: deleteFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const count = await adapter.deleteMany("posts", ["1", "2", "3"]);
    expect(count).toBe(3);
    expect(commitFn).toHaveBeenCalled();
  });

  it("transaction delegates to runTransaction", async () => {
    const txnFn = vi.fn().mockResolvedValue("result");
    mocks.mockRunTransaction.mockImplementation(async (fn: () => Promise<string>) => fn());
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.transaction(txnFn);
    expect(result).toBe("result");
  });

  it("deserializeTimestamps converts nested Timestamps, arrays, and objects", async () => {
    const ts1 = new mocks.MockTimestamp(1, 0);
    const ts2 = new mocks.MockTimestamp(2, 0);
    const ts3 = new mocks.MockTimestamp(3, 0);
    const data = {
      createdAt: ts1,
      nested: {
        tags: [{ modified: ts3, name: "a" }, "plain-string", 42],
        updatedAt: ts2,
      },
      title: "plain",
    };
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, data));
    mocks.mockDoc.mockReturnValue({ get: getFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = (await adapter.findOne("posts", "doc-1")) as Record<string, unknown>;
    expect(result.title).toBe("plain");
    expect(result.createdAt).toBe("1970-01-01T00:00:01.000Z");
    expect((result.nested as Record<string, unknown>).updatedAt).toBe("1970-01-01T00:00:02.000Z");
    const tags = (result.nested as Record<string, unknown>).tags as Array<Record<string, unknown>>;
    expect(tags[0]?.name).toBe("a");
    expect(tags[0]?.modified).toBe("1970-01-01T00:00:03.000Z");
    expect(tags[1]).toBe("plain-string");
    expect(tags[2]).toBe(42);
  });

  it("create adds doc without id", async () => {
    const addGetFn = vi
      .fn()
      .mockResolvedValue(
        mockDocSnapshot(true, { createdAt: new mocks.MockTimestamp(1, 0), title: "New" }),
      );
    const addFn = vi.fn().mockResolvedValue({ get: addGetFn, id: "new-id" });
    mocks.mockDoc.mockReturnValue({ get: vi.fn(), set: vi.fn() });
    mocks.mockCollection.mockReturnValue({
      add: addFn,
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: vi.fn(),
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.create("posts", { title: "New" });
    expect(addFn).toHaveBeenCalled();
    expect(result.id).toBe("doc-1");
  });

  it("create uses setDoc when id is provided", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "Custom" }));
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    mocks.mockCollection.mockReturnValue({
      add: vi.fn(),
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: mocks.mockDoc,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.create("posts", { id: "custom-id", title: "Custom" });
    expect(setFn).toHaveBeenCalled();
    expect(result.id).toBe("doc-1");
  });

  it("update merges data and sets updatedAt", async () => {
    const getFn = vi
      .fn()
      .mockResolvedValue(
        mockDocSnapshot(true, { title: "Updated", updatedAt: new mocks.MockTimestamp(2, 0) }),
      );
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.update("posts", "doc-1", { title: "Updated" });
    expect(setFn).toHaveBeenCalledWith(expect.any(Object), { merge: true });
    expect(result?.title).toBe("Updated");
  });

  it("update returns null when doc not found", async () => {
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({
      get: vi.fn().mockResolvedValue(mockDocSnapshot(false)),
      set: setFn,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.update("posts", "missing", { title: "Nope" });
    expect(result).toBeNull();
  });

  it("findMany returns data and total", async () => {
    const countGet = vi.fn().mockResolvedValue({ data: () => ({ count: 5 }) });
    const queryMock = {
      count: () => ({ get: countGet }),
      get: vi.fn().mockResolvedValue({
        docs: [
          { data: () => ({ title: "A" }), id: "1" },
          { data: () => ({ title: "B" }), id: "2" },
        ],
      }),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    };
    mocks.mockCollection.mockReturnValue(queryMock);
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    const result = await adapter.findMany("posts");
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(5);
  });

  it("findMany applies where, sort, and limit", async () => {
    const countGet = vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) });
    const queryMock = {
      count: () => ({ get: countGet }),
      get: vi.fn().mockResolvedValue({ docs: [] }),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    };
    mocks.mockCollection.mockReturnValue(queryMock);
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.findMany("posts", {
      limit: 10,
      sort: { createdAt: "desc" },
      where: { status: "published" },
    });
    expect(queryMock.where).toHaveBeenCalledWith("status", "==", "published");
    expect(queryMock.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(queryMock.limit).toHaveBeenCalledWith(10);
  });

  it("connect forwards databaseURL and storageBucket", async () => {
    const adapter = new FirestoreAdapter();
    await adapter.connect({
      databaseURL: "https://test.firebaseio.com",
      projectId: "test",
      storageBucket: "test.appspot.com",
    });
    expect(mocks.mockInitializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        databaseURL: "https://test.firebaseio.com",
        storageBucket: "test.appspot.com",
      }),
      "blazing-cms",
    );
  });

  it("serializeData maps primitive array elements with else branch", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "test" }));
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    mocks.mockCollection.mockReturnValue({
      add: vi.fn(),
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: mocks.mockDoc,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.create("posts", { id: "c", scores: [1, 2, 3], tags: ["a", "b", "c"] });
    const callData = setFn.mock.calls[0]![0] as Record<string, unknown>;
    expect(callData.tags).toEqual(["a", "b", "c"]);
    expect(callData.scores).toEqual([1, 2, 3]);
  });

  it("serializeData passes through primitives in else branch", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "test" }));
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    mocks.mockCollection.mockReturnValue({
      add: vi.fn(),
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: mocks.mockDoc,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.create("posts", { active: true, count: 42, id: "c", ratio: 3.14 });
    const callData = setFn.mock.calls[0]![0] as Record<string, unknown>;
    expect(callData.count).toBe(42);
    expect(callData.active).toBe(true);
    expect(callData.ratio).toBe(3.14);
  });

  it("serializeData handles nested arrays/objects and strips id/createdAt/updatedAt", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "test" }));
    const setFn = vi.fn().mockResolvedValue(undefined);
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    mocks.mockCollection.mockReturnValue({
      add: vi.fn(),
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: mocks.mockDoc,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.create("posts", {
      createdAt: new Date(),
      id: "custom-id",
      meta: { key: "value" },
      tags: [{ name: "a" }, { name: "b" }],
      title: "Test",
      updatedAt: new Date(),
    });
    const callData = setFn.mock.calls[0]![0] as Record<string, unknown>;
    expect(callData.title).toBe("Test");
    expect(callData.tags).toEqual([{ name: "a" }, { name: "b" }]);
    expect(callData.meta).toEqual({ key: "value" });
    expect(callData).not.toHaveProperty("id");
    // createdAt and updatedAt are added back by create() after serialization strips them
    expect(callData).toHaveProperty("createdAt");
    expect(callData).toHaveProperty("updatedAt");
  });

  it("serializeData converts Date to Timestamp", async () => {
    const getFn = vi.fn().mockResolvedValue(mockDocSnapshot(true, { title: "test" }));
    const setFn = vi.fn().mockResolvedValue(undefined);
    const tsFromDate = vi.spyOn(mocks.MockTimestamp, "fromDate");
    mocks.mockDoc.mockReturnValue({ get: getFn, set: setFn });
    mocks.mockCollection.mockReturnValue({
      add: vi.fn(),
      count: () => ({ get: vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) }) }),
      doc: mocks.mockDoc,
    });
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.create("posts", { id: "c", publishDate: new Date("2024-06-15") });
    expect(tsFromDate).toHaveBeenCalled();
  });

  it("findMany skips undefined where values", async () => {
    const countGet = vi.fn().mockResolvedValue({ data: () => ({ count: 0 }) });
    const queryMock = {
      count: () => ({ get: countGet }),
      get: vi.fn().mockResolvedValue({ docs: [] }),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    };
    mocks.mockCollection.mockReturnValue(queryMock);
    const adapter = new FirestoreAdapter();
    await adapter.connect({ projectId: "test" });
    await adapter.findMany("posts", {
      where: { deleted: undefined as never, status: "published" },
    });
    expect(queryMock.where).toHaveBeenCalledTimes(1);
    expect(queryMock.where).toHaveBeenCalledWith("status", "==", "published");
  });

  it("throws when not connected", async () => {
    const adapter = new FirestoreAdapter();
    await expect(adapter.findOne("posts", "1")).rejects.toThrow("not connected");
    await expect(adapter.findMany("posts")).rejects.toThrow("not connected");
    await expect(adapter.create("posts", {})).rejects.toThrow("not connected");
    await expect(adapter.update("posts", "1", {})).rejects.toThrow("not connected");
    await expect(adapter.delete("posts", "1")).rejects.toThrow("not connected");
    await expect(adapter.deleteMany("posts", ["1"])).rejects.toThrow("not connected");
    await expect(adapter.transaction(async () => "x")).rejects.toThrow("not connected");
  });
});
