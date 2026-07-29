import { getBackendMode } from "@/lib/backend-mode";

import type { DataProvider } from "./types";

import { firebaseProvider } from "./firebase";

let currentProvider: DataProvider | null = null;

export function getProvider(): DataProvider {
  if (currentProvider) return currentProvider;

  const mode = getBackendMode();
  if (mode === "firebase") {
    currentProvider = firebaseProvider;
  } else {
    throw new Error("Server mode provider not implemented yet");
  }

  return currentProvider;
}

export function setProvider(provider: DataProvider) {
  currentProvider = provider;
}

export function resetProvider() {
  currentProvider = null;
}

export { firebaseProvider };
