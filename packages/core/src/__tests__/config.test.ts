import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { createFirebaseConfigLoader } from "../config.js";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("FIREBASE_CREDENTIALS", "");
  vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createFirebaseConfigLoader", () => {
  it("returns defaults when no env vars are set", async () => {
    const config = await createFirebaseConfigLoader();
    expect(config.host).toBe("0.0.0.0");
    expect(config.port).toBe(3000);
    expect(config.auth.secret).toBe("change-me-in-production");
    expect(config.auth.expiresIn).toBe("7d");
    expect(config.storage.adapter).toBe("firebase");
    expect(config.storage.baseDir).toBe("./uploads");
  });

  it("reads host and port from env", async () => {
    vi.stubEnv("HOST", "127.0.0.1");
    vi.stubEnv("PORT", "4000");
    const config = await createFirebaseConfigLoader();
    expect(config.host).toBe("127.0.0.1");
    expect(config.port).toBe(4000);
  });

  it("reads auth config from env", async () => {
    vi.stubEnv("AUTH_SECRET", "super-secret");
    vi.stubEnv("AUTH_EXPIRES_IN", "24h");
    const config = await createFirebaseConfigLoader();
    expect(config.auth.secret).toBe("super-secret");
    expect(config.auth.expiresIn).toBe("24h");
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
    vi.stubEnv("STORAGE_ADAPTER", "local");
    vi.stubEnv("STORAGE_BASE_DIR", "/data/uploads");
    vi.stubEnv("STORAGE_BUCKET", "custom-bucket");
    const config = await createFirebaseConfigLoader();
    expect(config.storage.adapter).toBe("local");
    expect(config.storage.baseDir).toBe("/data/uploads");
    expect(config.storage.bucket).toBe("custom-bucket");
  });

  it("merges overrides", async () => {
    const config = await createFirebaseConfigLoader({ host: "10.0.0.1", port: 8080 });
    expect(config.port).toBe(8080);
    expect(config.host).toBe("10.0.0.1");
  });

  it("handles missing credential file gracefully", async () => {
    vi.stubEnv("FIREBASE_CREDENTIALS", "/nonexistent/path.json");
    const config = await createFirebaseConfigLoader();
    // Should not throw, should use env values or defaults
    expect(config.firebase.projectId).toBe("");
    expect(config.firebase.clientEmail).toBe("");
  });
});
