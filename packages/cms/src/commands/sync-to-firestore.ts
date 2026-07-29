import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync } from "node:fs";
import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blazing-cms/types";

interface SyncPayload {
  collections: CollectionDefinition[];
  globals: GlobalDefinition[];
  components: ComponentDefinition[];
}

async function initAdmin() {
  const apps = getApps();
  if (apps.length > 0) return;

  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (saPath && existsSync(saPath)) {
    initializeApp({ credential: cert(saPath) });
    return;
  }

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("VITE_FIREBASE_PROJECT_ID must be set to sync schemas");

  initializeApp({ projectId });
}

async function syncDocs(collectionPath: string, items: ({ slug: string } & Record<string, unknown>)[]) {
  const db = getFirestore();
  const batch = db.batch();
  const colRef = db.collection(collectionPath);

  for (const item of items) {
    const slug = item.slug;
    const docRef = colRef.doc(slug);
    batch.set(docRef, { ...item, syncedAt: new Date().toISOString() }, { merge: true });
  }

  await batch.commit();
  console.warn(`  ✓ Synced ${items.length} ${collectionPath}`);
}

async function deprecateRemoved(collectionPath: string, activeSlugs: string[]) {
  const db = getFirestore();
  const snap = await db.collection(collectionPath).get();
  const batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    if (!activeSlugs.includes(doc.id) && doc.data().deprecated !== true) {
      batch.update(doc.ref, { deprecated: true, deprecatedAt: new Date().toISOString() });
      count++;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.warn(`  ✓ Marked ${count} deprecated in ${collectionPath}`);
  }
}

export async function syncToFirestore(payload: SyncPayload): Promise<void> {
  console.warn("  Syncing schemas to Firestore...\n");

  await initAdmin();

  const colSlugs = payload.collections.map((c) => c.slug);
  const globalSlugs = payload.globals.map((g) => g.slug);
  const compSlugs = payload.components.map((c) => c.slug);

  await syncDocs("_schemas/collections", payload.collections as never);
  await syncDocs("_schemas/globals", payload.globals as never);
  await syncDocs("_schemas/components", payload.components as never);

  await deprecateRemoved("_schemas/collections", colSlugs);
  await deprecateRemoved("_schemas/globals", globalSlugs);
  await deprecateRemoved("_schemas/components", compSlugs);

  console.warn("\n  Sync complete.\n");
}