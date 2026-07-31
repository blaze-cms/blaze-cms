import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getCountFromServer,
  type Firestore,
  type DocumentSnapshot,
} from "firebase/firestore";

import type {
  AnalyticsByType,
  AnalyticsQuery,
  AnalyticsSummary,
  DataProvider,
  QueryOptions,
} from "./types";

import {
  aggregateAuthors,
  authorFields,
  bucketByDay,
  entryCollection,
  MAX_SAMPLE,
  MEDIA_COLLECTION,
  periodStartISO,
  sumMediaUsage,
  toISOString,
  USERS_COLLECTION,
} from "./analytics-helpers";

const firebaseConfig: Record<string, string> = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY ?? ""),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID ?? ""),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? ""),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ""),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? ""),
};

let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch {
  app = initializeApp(firebaseConfig, "blazing-cms-provider");
}

const db: Firestore = getFirestore(app);
const PAGE_SIZE = 25;

function docToData(d: DocumentSnapshot): Record<string, unknown> | null {
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Record<string, unknown>;
}

async function countCollection(db: Firestore, name: string): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(db, name));
    return snap.data().count;
  } catch {
    return 0;
  }
}

async function countEntries(
  db: Firestore,
  collections: string[],
): Promise<{ byCollection: Array<{ slug: string; count: number }>; totalEntries: number }> {
  const byCollection: Array<{ slug: string; count: number }> = [];
  let totalEntries = 0;
  for (const slug of collections) {
    const count = await countCollection(db, entryCollection(slug));
    byCollection.push({ count, slug });
    totalEntries += count;
  }
  return { byCollection, totalEntries };
}

async function countGlobals(db: Firestore, globals: string[]): Promise<number> {
  let totalGlobals = 0;
  for (const slug of globals) {
    totalGlobals += await countCollection(db, `globals_${slug}`);
  }
  return totalGlobals;
}

async function collectMediaUsage(
  db: Firestore,
): Promise<{ totalBytes: number; byType: AnalyticsByType }> {
  try {
    const snap = await getDocs(query(collection(db, MEDIA_COLLECTION), limit(MAX_SAMPLE)));
    return sumMediaUsage(snap.docs.map((d) => d.data() as Record<string, unknown>));
  } catch {
    return { byType: { audio: 0, document: 0, image: 0, other: 0, video: 0 }, totalBytes: 0 };
  }
}

async function queryChangesSince(
  db: Firestore,
  name: string,
  startISO: string,
): Promise<Array<Record<string, unknown>> | null> {
  try {
    const snap = await getDocs(
      query(collection(db, name), where("createdAt", ">=", startISO), limit(MAX_SAMPLE)),
    );
    return snap.docs.map((d) => d.data() as Record<string, unknown>);
  } catch {
    return null;
  }
}

function indexDocs(
  docs: Array<Record<string, unknown>>,
  allDates: string[],
  authors: string[],
): void {
  for (const data of docs) {
    const createdAt = toISOString(data.createdAt);
    if (createdAt) allDates.push(createdAt);
    authors.push(...authorFields(data));
  }
}

async function collectChangesSince(
  db: Firestore,
  collections: string[],
  startISO: string,
): Promise<{ allDates: string[]; authors: string[] }> {
  const allDates: string[] = [];
  const authors: string[] = [];
  for (const slug of collections) {
    const docs = await queryChangesSince(db, entryCollection(slug), startISO);
    if (docs) indexDocs(docs, allDates, authors);
  }
  return { allDates, authors };
}

async function getAnalytics(db: Firestore, queryOpts: AnalyticsQuery): Promise<AnalyticsSummary> {
  const { collections, globals, period } = queryOpts;
  const startISO = periodStartISO(period);

  const { byCollection, totalEntries } = await countEntries(db, collections);
  const totalGlobals = await countGlobals(db, globals);
  const [totalMedia, totalUsers, storage] = await Promise.all([
    countCollection(db, MEDIA_COLLECTION),
    countCollection(db, USERS_COLLECTION),
    collectMediaUsage(db),
  ]);
  const { allDates, authors } = await collectChangesSince(db, collections, startISO);

  return {
    activity: aggregateAuthors(authors),
    byCollection,
    changes: bucketByDay(allDates),
    counts: {
      totalCollections: collections.length,
      totalEntries,
      totalGlobals,
      totalMedia,
      totalUsers,
    },
    storage,
  };
}

export const firebaseProvider: DataProvider = {
  async create(collectionName: string, data: Record<string, unknown>) {
    const col = collection(db, `collections_${collectionName}`);
    const docData = { ...data, updatedAt: new Date().toISOString() };
    if (data.id) {
      await setDoc(doc(col, data.id as string), docData);
      return data.id as string;
    }
    const docRef = await addDoc(col, docData);
    return docRef.id;
  },
  async delete(collectionName: string, id: string) {
    await deleteDoc(doc(db, `collections_${collectionName}`, id));
  },

  async findMany(collectionName: string, options?: QueryOptions) {
    const constraints = [];
    const pageSize = options?.limit ?? PAGE_SIZE;

    if (options?.filter) {
      for (const [key, val] of Object.entries(options.filter)) {
        constraints.push(where(key, "==", val));
      }
    }

    if (options?.sort) {
      constraints.push(orderBy(options.sort, options.order ?? "asc"));
    }

    constraints.push(limit(pageSize + 1));

    const q = query(collection(db, `collections_${collectionName}`), ...constraints);
    const snap = await getDocs(q);
    const docs = snap.docs.map(docToData).filter(Boolean) as Record<string, unknown>[];
    const hasMore = docs.length > pageSize;
    if (hasMore) docs.pop();

    return {
      cursor: hasMore ? snap.docs[pageSize - 1]?.id : undefined,
      data: docs,
      hasMore,
    };
  },

  async findOne(collectionName: string, id: string) {
    const snap = await getDoc(doc(db, `collections_${collectionName}`, id));
    return docToData(snap);
  },

  async getAnalytics(queryOpts: AnalyticsQuery) {
    return getAnalytics(db, queryOpts);
  },

  async getGlobal(slug: string) {
    const snap = await getDoc(doc(db, `globals_${slug}`, "value"));
    return docToData(snap);
  },

  name: "firebase",

  type: "firebase",

  async update(collectionName: string, id: string, data: Record<string, unknown>) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, `collections_${collectionName}`, id), {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  },

  async upsertGlobal(slug: string, data: Record<string, unknown>) {
    await setDoc(
      doc(db, `globals_${slug}`, "value"),
      { ...data, updatedAt: new Date().toISOString() },
      { merge: true },
    );
  },
};
