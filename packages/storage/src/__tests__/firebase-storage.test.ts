import { describe, it, expect, vi, beforeEach } from "vitest";

import { FirebaseStorageAdapter } from "../firebase-storage.js";

const mockFile = vi.fn();

const buildBucketMock = () => ({
  file: mockFile,
  getFiles: vi.fn().mockResolvedValue([[{ metadata: { size: "512" }, name: "file1.txt" }]]),
  name: "test-bucket",
});

let currentBucketMock = buildBucketMock();

vi.mock("firebase-admin/storage", () => ({
  getStorage: () => ({
    bucket: vi.fn(() => currentBucketMock),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  currentBucketMock = buildBucketMock();
  mockFile.mockReturnValue({
    delete: vi.fn().mockResolvedValue(undefined),
    download: vi.fn().mockResolvedValue([Buffer.from("data")]),
    exists: vi.fn().mockResolvedValue([true]),
    getSignedUrl: vi.fn().mockResolvedValue(["https://signed-url"]),
    makePublic: vi.fn().mockResolvedValue(undefined),
    metadata: { size: "1024" },
    name: "test-file.txt",
    save: vi.fn().mockResolvedValue(undefined),
  });
});

describe("FirebaseStorageAdapter", () => {
  it("connects with default bucket", async () => {
    const adapter = new FirebaseStorageAdapter();
    await expect(adapter.connect()).resolves.toBeUndefined();
  });

  it("connects with named bucket", async () => {
    const adapter = new FirebaseStorageAdapter("my-bucket");
    await expect(adapter.connect()).resolves.toBeUndefined();
  });

  it("upload saves file and returns signed URL", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const result = await adapter.upload("path/to/file.txt", Buffer.from("hello"), "text/plain");
    expect(result.path).toBe("path/to/file.txt");
    expect(result.url).toBe("https://signed-url");
    expect(mockFile).toHaveBeenCalledWith("path/to/file.txt");
  });

  it("upload works without contentType", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const result = await adapter.upload("test.txt", "raw string");
    expect(result.url).toBe("https://signed-url");
  });

  it("download returns buffer", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const data = await adapter.download("path/to/file.txt");
    expect(data).toEqual(Buffer.from("data"));
  });

  it("delete returns true on success", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const result = await adapter.delete("path/to/file.txt");
    expect(result).toBe(true);
  });

  it("delete returns false on failure", async () => {
    mockFile.mockReturnValue({
      delete: vi.fn().mockRejectedValue(new Error("not found")),
    });
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const result = await adapter.delete("missing.txt");
    expect(result).toBe(false);
  });

  it("list returns files with names and URLs", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const files = await adapter.list("prefix/");
    expect(files).toHaveLength(1);
    expect(files[0]?.name).toBe("file1.txt");
    expect(files[0]?.size).toBe(512);
    expect(files[0]?.url).toContain("test-bucket");
  });

  it("list supports prefix filtering", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    await adapter.list("images/");
    expect(currentBucketMock.getFiles).toHaveBeenCalledWith({ prefix: "images/" });
  });

  it("exists returns true when file exists", async () => {
    const adapter = new FirebaseStorageAdapter();
    await adapter.connect();
    const result = await adapter.exists("test.txt");
    expect(result).toBe(true);
  });

  it("throws when not connected for non-catch methods", async () => {
    const adapter = new FirebaseStorageAdapter();
    await expect(adapter.upload("x", "data")).rejects.toThrow("not connected");
    await expect(adapter.download("x")).rejects.toThrow("not connected");
    await expect(adapter.list()).rejects.toThrow("not connected");
    await expect(adapter.exists("x")).rejects.toThrow("not connected");
  });

  it("returns false on delete when not connected (try/catch)", async () => {
    const adapter = new FirebaseStorageAdapter();
    const result = await adapter.delete("x");
    expect(result).toBe(false);
  });
});
