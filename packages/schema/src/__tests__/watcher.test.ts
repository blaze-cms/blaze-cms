import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => ({
  watch: vi.fn(() => ({
    close: vi.fn(),
  })),
}));

const fs = await import("node:fs");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SchemaWatcher", () => {
  it("starts watching collections, globals, and components directories", async () => {
    const { SchemaWatcher } = await import("../watcher.js");
    const onChange = vi.fn();
    const watcher = new SchemaWatcher(null, onChange);
    watcher.start("/my-schema");
    expect(fs.watch).toHaveBeenCalledTimes(3);
    expect(fs.watch).toHaveBeenCalledWith("/my-schema/collections", expect.any(Function));
    expect(fs.watch).toHaveBeenCalledWith("/my-schema/globals", expect.any(Function));
    expect(fs.watch).toHaveBeenCalledWith("/my-schema/components", expect.any(Function));
  });

  it("calls onChange when a file changes", async () => {
    const { SchemaWatcher } = await import("../watcher.js");
    const onChange = vi.fn();
    const watcher = new SchemaWatcher(null, onChange);
    watcher.start("/my-schema");
    const watchCalls = vi.mocked(fs.watch).mock.calls;
    const callback = watchCalls[0][1] as (event: string, filename: string) => void;
    callback("change", "posts.ts");
    expect(onChange).toHaveBeenCalledWith("change", "posts.ts");
  });

  it("maps 'rename' event to 'add'", async () => {
    const { SchemaWatcher } = await import("../watcher.js");
    const onChange = vi.fn();
    const watcher = new SchemaWatcher(null, onChange);
    watcher.start("/my-schema");
    const callback = vi.mocked(fs.watch).mock.calls[0][1] as (
      event: string,
      filename: string,
    ) => void;
    callback("rename", "new-post.ts");
    expect(onChange).toHaveBeenCalledWith("add", "new-post.ts");
  });

  it("stop closes all watchers", async () => {
    const { SchemaWatcher } = await import("../watcher.js");
    const onChange = vi.fn();
    const watcher = new SchemaWatcher(null, onChange);
    watcher.start("/my-schema");
    const closeFns = vi.mocked(fs.watch).mock.results.map((r) => r.value.close);
    watcher.stop();
    for (const close of closeFns) {
      expect(close).toHaveBeenCalled();
    }
  });

  it("handles missing directories without throwing", async () => {
    vi.mocked(fs.watch).mockImplementationOnce(() => {
      throw new Error("ENOENT");
    });
    vi.mocked(fs.watch).mockImplementationOnce(() => {
      throw new Error("ENOENT");
    });
    vi.mocked(fs.watch).mockImplementationOnce(() => {
      throw new Error("ENOENT");
    });
    const { SchemaWatcher } = await import("../watcher.js");
    const watcher = new SchemaWatcher(null, vi.fn());
    expect(() => watcher.start("/missing")).not.toThrow();
  });
});
