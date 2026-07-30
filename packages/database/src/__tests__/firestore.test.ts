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
