import { getBackendMode } from "@/lib/backend-mode";

import type { DataProvider } from "./types";

import { firebaseProvider } from "./firebase";
import { mockProvider } from "./mock";

let currentProvider: DataProvider | null = null;

export function getProvider(): DataProvider {
  if (currentProvider) return currentProvider;

  const mode = getBackendMode();
  if (mode === "firebase") {
    currentProvider = firebaseProvider;
  } else {
    currentProvider = mockProvider;
  }

  return currentProvider;
}
