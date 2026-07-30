import type { MockInstance } from "vitest";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockExistsSync, mockReaddirSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReaddirSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: mockExistsSync,
  readdirSync: mockReaddirSync,
  readFileSync: mockReadFileSync,
}));

import { doctor } from "../commands/doctor.js";

describe("doctor", () => {
  let exitSpy: MockInstance;
  let warnSpy: MockInstance;
  const origEnv = { ...process.env };
  const origVersion = process.version;

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(process, "version", { configurable: true, value: "v22.0.0" });
  });

  afterEach(() => {
    process.env = { ...origEnv };
    Object.defineProperty(process, "version", { configurable: true, value: origVersion });
    vi.restoreAllMocks();
  });

  it("reports all checks passed when everything is healthy", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["posts.ts", "pages.ts"]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(exitSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("All checks passed"));
  });

  it("warns on old Node version", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    Object.defineProperty(process, "version", { configurable: true, value: "v18.0.0" });
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["posts.ts"]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("v22"));
  });

  it("exits with errors when env vars are missing", async () => {
    process.env = {};
    mockExistsSync.mockReturnValue(false);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue("{}");

    await doctor({});

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("warns when schema dir is missing", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(false);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Schema dir missing"));
  });

  it("reports schema counts correctly", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["a.ts", "b.ts", "c.ts"]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Collections: 3"));
    const warnCalls = warnSpy.mock.calls.map((c: unknown[]) => c[0] as string);
    expect(warnCalls.some((c: string) => c.includes("Globals: 3"))).toBe(true);
    expect(warnCalls.some((c: string) => c.includes("Components: 3"))).toBe(true);
  });

  it("warns when @blazing-cms/cms is a dev dependency", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: {}, devDependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("@blazing-cms/cms dependency"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("✓"));
  });

  it("warns when @blazing-cms/cms is missing from package.json", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue(JSON.stringify({ dependencies: {} }));

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("⚠"));
  });

  it("warns when blazing-cms.config.ts is missing", async () => {
    process.env = {
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "app",
      VITE_FIREBASE_AUTH_DOMAIN: "domain",
      VITE_FIREBASE_PROJECT_ID: "project",
      VITE_FIREBASE_STORAGE_BUCKET: "bucket",
    };
    mockExistsSync.mockReturnValue(false);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { "@blazing-cms/cms": "1.0.0" } }),
    );

    await doctor({});

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("blazing-cms.config.ts missing"));
  });
});
