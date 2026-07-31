import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

import type {
  AnalyticsApi,
  BlazeClientConfig,
  CollectionApi,
  GlobalApi,
  AuthApi,
  MediaApi,
  RbacApi,
  VersionsApi,
} from "./types.js";

import { createAnalyticsApi } from "./analytics.js";
import { createAuthApi } from "./auth.js";
import { createCollectionApi } from "./collection.js";
import { createGlobalApi } from "./global.js";
import { createMediaApi } from "./media.js";
import { createRbacApi } from "./rbac.js";
import { createVersionsApi } from "./versions.js";

export interface BlazeClient {
  /** Access a Firestore collection by name */
  collection(name: string): CollectionApi;
  /** Globals API (single-document collections) */
  globals: GlobalApi;
  /** Firebase Auth API */
  auth: AuthApi;
  /** Dashboard analytics queries */
  analytics: AnalyticsApi;
  /** Media library: uploads, metadata, folders, usage */
  media: MediaApi;
  /** Roles, user-role assignments, and precomputed grants */
  rbac: RbacApi;
  /** Content versioning: snapshots, diffs, rollback, pruning */
  versions: VersionsApi;
  /** Raw Firebase instances for advanced use */
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}

let appSingleton: FirebaseApp | null = null;

export function createBlazeClient(config: BlazeClientConfig): BlazeClient {
  try {
    if (!appSingleton) {
      appSingleton = initializeApp(config);
    }
  } catch {
    appSingleton = initializeApp(config, "blazing-cms-sdk");
  }

  const app = appSingleton;
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  const collections = new Map<string, CollectionApi>();

  return {
    analytics: createAnalyticsApi(db, config.analytics),
    app,
    auth: createAuthApi(auth),
    collection(name: string): CollectionApi {
      let api = collections.get(name);
      if (!api) {
        api = createCollectionApi(db, name);
        collections.set(name, api);
      }
      return api;
    },
    db,
    globals: createGlobalApi(db),
    media: createMediaApi(db, storage, config.media),
    rbac: createRbacApi(db),
    storage,
    versions: createVersionsApi(db),
  };
}
