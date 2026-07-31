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
  type QueryConstraint,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  type FirebaseStorage,
} from "firebase/storage";

import { measureImage, pick, safeFileName, validateMediaFile } from "@/lib/media/validation";

import type {
  AnalyticsByType,
  AnalyticsQuery,
  AnalyticsSummary,
  DataProvider,
  MediaUploadOptions,
  MediaUploadResult,
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
import { isFilterValue } from "./types";

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
const storage: FirebaseStorage = getStorage(app);
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

function startUpload(
  storage: FirebaseStorage,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ url: string; path: string }> {
  const safeName = safeFileName(file.name);
  const path = `media/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(percent);
      },
      reject,
      () => {
        void getDownloadURL(uploadTask.snapshot.ref).then((url) => resolve({ path, url }));
      },
    );
  });
}

function dimValue(value: number | undefined): number | null {
  return value === undefined ? null : value;
}

function mediaDocData(
  file: File,
  url: string,
  path: string,
  options: MediaUploadOptions,
  dims: { width?: number; height?: number },
): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    altText: pick(options.altText, file.name),
    caption: pick(options.caption, ""),
    contentType: file.type,
    createdAt: now,
    folder: pick(options.folder, null),
    height: dimValue(dims.height),
    name: file.name,
    path,
    size: file.size,
    tags: pick(options.tags, []),
    updatedAt: now,
    url,
    width: dimValue(dims.width),
  };
}

function mediaPatch(
  existing: Record<string, unknown>,
  file: File,
  url: string,
  path: string,
  options: MediaUploadOptions,
  dims: { width?: number; height?: number },
): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    altText: pick(options.altText, pick(existing.altText as string, file.name)),
    caption: pick(options.caption, pick(existing.caption as string, "")),
    contentType: file.type,
    height: dimValue(dims.height),
    name: file.name,
    path,
    size: file.size,
    tags: pick(options.tags, pick(existing.tags as string[], [])),
    updatedAt: now,
    url,
    width: dimValue(dims.width),
  };
}

async function writeMediaMetadata(
  db: Firestore,
  file: File,
  url: string,
  path: string,
  options?: MediaUploadOptions,
): Promise<MediaUploadResult> {
  const dims = await measureImage(file);
  const docRef = await addDoc(
    collection(db, MEDIA_COLLECTION),
    mediaDocData(file, url, path, options ?? {}, dims),
  );
  return { id: docRef.id, name: file.name, url };
}

async function uploadMedia(
  db: Firestore,
  storage: FirebaseStorage,
  file: File,
  options?: MediaUploadOptions,
): Promise<MediaUploadResult> {
  validateMediaFile(file);
  const { path, url } = await startUpload(storage, file, options?.onProgress);
  return writeMediaMetadata(db, file, url, path, options);
}

async function deleteStoredObject(storage: FirebaseStorage, path?: string): Promise<void> {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // Old object may not exist; keep going.
  }
}

async function replaceMedia(
  db: Firestore,
  storage: FirebaseStorage,
  id: string,
  file: File,
  options?: MediaUploadOptions,
): Promise<{ url: string }> {
  validateMediaFile(file);
  const snap = await getDoc(doc(db, MEDIA_COLLECTION, id));
  if (!snap.exists()) throw new Error(`Media item not found: ${id}`);
  const existing = snap.data();
  const { path, url } = await startUpload(storage, file, options?.onProgress);
  await deleteStoredObject(storage, existing.path as string);
  const dims = await measureImage(file);
  await updateDoc(
    doc(db, MEDIA_COLLECTION, id),
    mediaPatch(existing, file, url, path, options ?? {}, dims),
  );
  return { url };
}

async function deleteMedia(db: Firestore, storage: FirebaseStorage, id: string): Promise<void> {
  const snap = await getDoc(doc(db, MEDIA_COLLECTION, id));
  if (!snap.exists()) return;
  const data = snap.data();
  await deleteDoc(doc(db, MEDIA_COLLECTION, id));
  await deleteStoredObject(storage, data.path as string);
}

function pageSize(limit?: number): number {
  return limit === undefined ? PAGE_SIZE : limit;
}

function addFilters(constraints: QueryConstraint[], filter?: Record<string, unknown>): void {
  if (!filter) return;
  for (const [key, val] of Object.entries(filter)) {
    if (isFilterValue(val)) {
      constraints.push(where(key, val.op, val.value));
    } else {
      constraints.push(where(key, "==", val));
    }
  }
}

function addSort(constraints: QueryConstraint[], sort?: string, order?: "asc" | "desc"): void {
  if (!sort) return;
  constraints.push(orderBy(sort, order === undefined ? "asc" : order));
}

function buildConstraints(options?: QueryOptions): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];
  addFilters(constraints, options?.filter);
  addSort(constraints, options?.sort, options?.order);
  return constraints;
}

function cursorFor(
  hasMore: boolean,
  snap: { docs: Array<{ id: string }> },
  size: number,
): string | undefined {
  if (!hasMore) return undefined;
  return snap.docs[size - 1]?.id;
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

  async deleteMedia(id: string) {
    await deleteMedia(db, storage, id);
  },

  async findMany(collectionName: string, options?: QueryOptions) {
    const size = pageSize(options?.limit);
    const constraints = buildConstraints(options);
    constraints.push(limit(size + 1));

    const q = query(collection(db, `collections_${collectionName}`), ...constraints);
    const snap = await getDocs(q);
    const docs = snap.docs.map(docToData).filter(Boolean) as Record<string, unknown>[];
    const hasMore = docs.length > size;
    if (hasMore) docs.pop();

    return {
      cursor: cursorFor(hasMore, snap, size),
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

  async replaceMedia(id: string, file: File, options?: MediaUploadOptions) {
    return replaceMedia(db, storage, id, file, options);
  },

  type: "firebase",

  async update(collectionName: string, id: string, data: Record<string, unknown>) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, `collections_${collectionName}`, id), {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  },

  async uploadMedia(file: File, options?: MediaUploadOptions) {
    return uploadMedia(db, storage, file, options);
  },

  async upsertGlobal(slug: string, data: Record<string, unknown>) {
    await setDoc(
      doc(db, `globals_${slug}`, "value"),
      { ...data, updatedAt: new Date().toISOString() },
      { merge: true },
    );
  },
};
