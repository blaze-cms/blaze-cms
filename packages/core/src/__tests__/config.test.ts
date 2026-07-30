import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import { existsSync, readFileSync } from "node:fs";

import { createFirebaseConfigLoader } from "../config.js";

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("FIREBASE_CREDENTIALS", "");
  vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createFirebaseConfigLoader", () => {
  it("returns defaults when no env vars are set", async () => {
    const config = await createFirebaseConfigLoader();
    expect(config.plugins).toEqual({});
  });

  it("reads firebase config from env", async () => {
    vi.stubEnv("FIREBASE_PROJECT_ID", "my-project");
    vi.stubEnv("FIREBASE_CLIENT_EMAIL", "admin@my-project.iam.gserviceaccount.com");
    vi.stubEnv(
      "FIREBASE_PRIVATE_KEY",
      "-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----",
    );
    vi.stubEnv("FIREBASE_DATABASE_URL", "https://my-project.firebaseio.com");
    vi.stubEnv("FIREBASE_STORAGE_BUCKET", "my-project.appspot.com");
    const config = await createFirebaseConfigLoader();
    expect(config.firebase.projectId).toBe("my-project");
    expect(config.firebase.clientEmail).toBe("admin@my-project.iam.gserviceaccount.com");
    expect(config.firebase.privateKey).toBe(
      "-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----",
    );
    expect(config.firebase.databaseURL).toBe("https://my-project.firebaseio.com");
    expect(config.firebase.storageBucket).toBe("my-project.appspot.com");
  });

  it("computes default storageBucket from PROJECT_ID env", async () => {
    vi.stubEnv("FIREBASE_STORAGE_BUCKET", "my-project.appspot.com");
    const config = await createFirebaseConfigLoader();
    expect(config.firebase.storageBucket).toBe("my-project.appspot.com");
  });

  it("reads storage config from env", async () => {
    vi.stubEnv("STORAGE_BUCKET", "custom-bucket");
    const config = await createFirebaseConfigLoader();
    expect(config.storage.bucket).toBe("custom-bucket");
  });

  it("merges overrides", async () => {
    const config = await createFirebaseConfigLoader({ plugins: { test: true } });
    expect(config.plugins).toEqual({ test: true });
  });

  it("handles missing credential file gracefully", async () => {
    vi.stubEnv("FIREBASE_CREDENTIALS", "/nonexistent/path.json");
    const config = await createFirebaseConfigLoader();
    expect(config.firebase.projectId).toBe("");
    expect(config.firebase.clientEmail).toBe("");
  });

  it("handles invalid JSON in credential file gracefully", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue("not valid json");
    vi.stubEnv("FIREBASE_CREDENTIALS", "/path/to/invalid.json");
    const config = await createFirebaseConfigLoader();
    expect(config.firebase.projectId).toBe("");
    expect(config.firebase.clientEmail).toBe("");
  });

  it("reads firebase config from credential file", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        clientEmail: "file@test.iam.gserviceaccount.com",
        privateKey: "file-key",
        projectId: "file-project",
      }),
    );
    vi.stubEnv("FIREBASE_CREDENTIALS", "/path/to/valid.json");
    const config = await createFirebaseConfigLoader();
    expect(config.firebase.clientEmail).toBe("file@test.iam.gserviceaccount.com");
    expect(config.firebase.privateKey).toBe("file-key");
    expect(config.firebase.projectId).toBe("file-project");
  });
});
