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
  startAfter,
  type Firestore,
  type DocumentSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

import type { DataProvider, QueryOptions, PaginatedResult } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
};

let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch {
  app = initializeApp(firebaseConfig, "blaze-cms-provider");
}

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const PAGE_SIZE = 25;

function docToData(d: DocumentSnapshot): Record<string, unknown> | null {
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Record<string, unknown>;
}

export const firebaseProvider: DataProvider = {
  async create(collectionName: string, data: Record<string, unknown>) {
    const col = collection(db, collectionName);
    if (data.id) {
      await setDoc(doc(col, data.id as string), data);
      return data.id as string;
    }
    const docRef = await addDoc(col, data);
    return docRef.id;
  },
  async delete(collectionName: string, id: string) {
    await deleteDoc(doc(db, collectionName, id));
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
      constraints.push(orderBy(options.sort, options?.order ?? "asc"));
    }

    constraints.push(limit(pageSize + 1));

    const q = query(collection(db, collectionName), ...constraints);
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
    const snap = await getDoc(doc(db, collectionName, id));
    return docToData(snap);
  },

  async getCollections() {
    throw new Error("Schema introspection not supported in Firebase mode directly");
  },

  async getComponents() {
    throw new Error("Schema introspection not supported in Firebase mode directly");
  },

  async getGlobal(slug: string) {
    const snap = await getDoc(doc(db, `globals_${slug}`, "value"));
    return docToData(snap);
  },

  async getGlobals() {
    throw new Error("Schema introspection not supported in Firebase mode directly");
  },

  name: "firebase",

  type: "firebase",

  async update(collectionName: string, id: string, data: Record<string, unknown>) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, collectionName, id), updateData);
  },

  async upsertGlobal(slug: string, data: Record<string, unknown>) {
    await setDoc(doc(db, `globals_${slug}`, "value"), data, { merge: true });
  },
};

export { db, storage, ref, uploadBytes, getDownloadURL };
