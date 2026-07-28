import type { DatabaseAdapter, QueryOptions } from "@blaze-cms/types";

import { applicationDefault, initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, type Firestore } from "firebase-admin/firestore";

export interface FirestoreConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
  databaseURL?: string;
  storageBucket?: string;
}

function fieldPath(name: string): string {
  return name.replace(/\./g, "/");
}

export class FirestoreAdapter implements DatabaseAdapter {
  private db: Firestore | null = null;
  private appName = "blaze-cms";

  async connect(config?: FirestoreConfig): Promise<void> {
    const existing = getApps().find((a) => a.name === this.appName);
    if (existing) {
      this.db = getFirestore(existing);
      return;
    }

    const appOptions: Record<string, unknown> = {
      projectId: config?.projectId,
    };
    if (config?.databaseURL) {
      appOptions.databaseURL = config.databaseURL;
    }
    if (config?.storageBucket) {
      appOptions.storageBucket = config.storageBucket;
    }

    if (config?.privateKey && config.clientEmail) {
      appOptions.credential = cert({
        clientEmail: config.clientEmail,
        privateKey: config.privateKey.replace(/\\n/g, "\n"),
        projectId: config.projectId,
      });
    } else {
      appOptions.credential = applicationDefault();
    }

    const app = initializeApp(appOptions, this.appName);
    this.db = getFirestore(app);
  }

  async disconnect(): Promise<void> {
    const apps = getApps();
    const appToDelete = apps.find((a) => a.name === this.appName) as
      { delete: () => Promise<void> } | undefined;
    if (appToDelete) {
      this.db = null;
      await appToDelete.delete();
    }
    this.db = null;
  }

  private getDb(): Firestore {
    if (!this.db) {
      throw new Error("FirestoreAdapter not connected. Call connect() first.");
    }
    return this.db;
  }

  async findOne(collection: string, id: string): Promise<Record<string, unknown> | null> {
    const doc = await this.getDb().doc(`${collection}/${id}`).get();
    if (!doc.exists) return null;
    const data = doc.data() ?? {};
    return { id: doc.id, ...this.deserializeTimestamps(data) };
  }

  async findMany(
    collection: string,
    options?: QueryOptions,
  ): Promise<{ data: Record<string, unknown>[]; total: number }> {
    let query = this.getDb().collection(collection) as FirebaseFirestore.Query;

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (value !== undefined) {
          query = query.where(fieldPath(key), "==", value);
        }
      }
    }

    if (options?.sort) {
      for (const [key, direction] of Object.entries(options.sort)) {
        query = query.orderBy(fieldPath(key), direction);
      }
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => {
      const d = doc.data() as Record<string, unknown>;
      return { id: doc.id, ...this.deserializeTimestamps(d) };
    });

    const countSnapshot = await this.getDb().collection(collection).count().get();
    const total = countSnapshot.data().count;

    return { data, total };
  }

  async create(
    collection: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const colRef = this.getDb().collection(collection);
    const now = Timestamp.now();

    const docData: Record<string, unknown> = {
      ...this.serializeData(data),
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
    };

    if (data.id) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(data.id);
      await colRef.doc(id).set(docData);
      const doc = await colRef.doc(id).get();
      const saved = doc.data() ?? {};
      return { id: doc.id, ...this.deserializeTimestamps(saved) };
    }

    const docRef = await colRef.add(docData);
    const doc = await docRef.get();
    const saved = doc.data() ?? {};
    return { id: doc.id, ...this.deserializeTimestamps(saved) };
  }

  async update(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null> {
    const docRef = this.getDb().doc(`${collection}/${id}`);
    const now = Timestamp.now();

    const updateData = { ...this.serializeData(data), updatedAt: now };

    await docRef.set(updateData, { merge: true });
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const saved = (doc.data() ?? {}) as Record<string, unknown>;
    return { id: doc.id, ...this.deserializeTimestamps(saved) };
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const docRef = this.getDb().doc(`${collection}/${id}`);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }

  async deleteMany(collection: string, ids: string[]): Promise<number> {
    const db = this.getDb();
    const batch = db.batch();
    for (const id of ids) {
      batch.delete(db.doc(`${collection}/${id}`));
    }
    await batch.commit();
    return ids.length;
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.getDb().runTransaction(async () => {
      return fn();
    });
  }

  private serializeData(data: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "createdAt" || key === "updatedAt") {
        continue;
      }
      if (value instanceof Date) {
        result[key] = Timestamp.fromDate(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((v: unknown) =>
          typeof v === "object" && v !== null
            ? this.serializeData(v as Record<string, unknown>)
            : v,
        );
      } else if (typeof value === "object" && value !== null && !(value instanceof Timestamp)) {
        result[key] = this.serializeData(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private deserializeTimestamps(data: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Timestamp) {
        result[key] = value.toDate().toISOString();
      } else if (Array.isArray(value)) {
        result[key] = value.map((v: unknown) =>
          typeof v === "object" && v !== null
            ? this.deserializeTimestamps(v as Record<string, unknown>)
            : v,
        );
      } else if (typeof value === "object" && value !== null) {
        result[key] = this.deserializeTimestamps(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
