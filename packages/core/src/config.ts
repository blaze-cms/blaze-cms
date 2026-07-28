import type { Config, FirebaseConfig } from "@blaze-cms/types";

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function env(key: string, fallback?: string): string {
  return process.env[key] ?? fallback ?? "";
}

function loadFirebaseCredentials(path?: string): FirebaseConfig | null {
  if (!path) return null;
  const resolved = resolve(path);
  if (!existsSync(resolved)) return null;
  try {
    return JSON.parse(readFileSync(resolved, "utf-8")) as FirebaseConfig;
  } catch {
    return null;
  }
}

export async function createFirebaseConfigLoader(overrides?: Partial<Config>): Promise<Config> {
  const credPath = env("FIREBASE_CREDENTIALS", env("GOOGLE_APPLICATION_CREDENTIALS", ""));
  const creds = loadFirebaseCredentials(credPath);

  return {
    auth: {
      expiresIn: env("AUTH_EXPIRES_IN", "7d"),
      secret: env("AUTH_SECRET", "change-me-in-production"),
    },
    firebase: {
      clientEmail: env("FIREBASE_CLIENT_EMAIL", creds?.clientEmail ?? undefined),
      databaseURL: env("FIREBASE_DATABASE_URL", undefined),
      privateKey: env("FIREBASE_PRIVATE_KEY", creds?.privateKey ?? undefined),
      projectId: env("FIREBASE_PROJECT_ID", creds?.projectId ?? ""),
      storageBucket: env(
        "FIREBASE_STORAGE_BUCKET",
        creds?.projectId ? `${creds.projectId}.appspot.com` : undefined,
      ),
    },
    host: env("HOST", "0.0.0.0"),
    plugins: {},
    port: Number(env("PORT", "3000")),
    storage: {
      adapter: env("STORAGE_ADAPTER", "firebase"),
      baseDir: env("STORAGE_BASE_DIR", "./uploads"),
      bucket: env("STORAGE_BUCKET", undefined),
    },
    ...overrides,
  };
}
