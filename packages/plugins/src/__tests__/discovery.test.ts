import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => ({
  readdirSync: vi.fn(),
}));

const fsMod = await import("node:fs");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("discoverPlugins", () => {
  it("discovers plugins by prefix in node_modules", async () => {
    vi.mocked(fsMod.readdirSync).mockReturnValue([
      "blazing-cms-plugin-seo",
      "blazing-cms-plugin-analytics",
      "some-other-package",
    ] as never);
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins();
    expect(plugins).toBeInstanceOf(Array);
  });

  it("filters by scope when provided", async () => {
    vi.mocked(fsMod.readdirSync).mockReturnValue(["@myorg", "blazing-cms-plugin-seo"] as never);
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins("@myorg");
    expect(plugins).toBeInstanceOf(Array);
  });

  it("returns empty array when node_modules cannot be read", async () => {
    vi.mocked(fsMod.readdirSync).mockImplementationOnce(() => {
      throw new Error("ENOENT");
    });
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins();
    expect(plugins).toEqual([]);
  });

  it("returns empty array when no plugins found", async () => {
    vi.mocked(fsMod.readdirSync).mockReturnValue(["lodash", "express"] as never);
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins();
    expect(plugins).toEqual([]);
  });

  it("skips plugins with no default export", async () => {
    vi.mock("blazing-cms-plugin-no-default", () => ({ namedExport: "value" }));
    vi.mocked(fsMod.readdirSync).mockReturnValue(["blazing-cms-plugin-no-default"] as never);
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins();
    expect(plugins).toEqual([]);
  });

  it("returns plugin when import succeeds with default export", async () => {
    vi.mock("blazing-cms-plugin-valid", () => ({
      default: { enabled: true, name: "Valid Plugin", slug: "valid" },
    }));
    vi.mocked(fsMod.readdirSync).mockReturnValue(["blazing-cms-plugin-valid"] as never);
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0]!.slug).toBe("valid");
  });

  it("filters by scoped prefix when scope is provided", async () => {
    vi.mocked(fsMod.readdirSync).mockReturnValue([
      "@myorg/blazing-cms-plugin-seo",
      "@myorg/blazing-cms-plugin-analytics",
      "blazing-cms-plugin-other",
      "@myorg/not-a-plugin",
    ] as never);
    vi.mock("@myorg/blazing-cms-plugin-seo", () => ({
      default: { enabled: true, name: "SEO", slug: "seo" },
    }));
    vi.mock("@myorg/blazing-cms-plugin-analytics", () => ({
      default: { enabled: true, name: "Analytics", slug: "analytics" },
    }));
    const { discoverPlugins } = await import("../discovery.js");
    const plugins = await discoverPlugins("@myorg");
    expect(plugins).toHaveLength(2);
  });
});
