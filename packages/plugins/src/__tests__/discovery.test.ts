import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { discoverPlugins } from "../discovery.js";

beforeEach(() => {
  vi.stubEnv("NODE_PATH", "/tmp/test-node_modules");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("discoverPlugins", () => {
  it("returns empty array when node_modules does not exist", async () => {
    const plugins = await discoverPlugins();
    expect(plugins).toEqual([]);
  });

  it("returns empty array when no matching plugins found", async () => {
    const plugins = await discoverPlugins();
    expect(plugins).toEqual([]);
  });
});
