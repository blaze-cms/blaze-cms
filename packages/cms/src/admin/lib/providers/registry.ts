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
  } else if (mode === "mock") {
    currentProvider = mockProvider;
  } else {
    throw new Error("Server mode provider not implemented yet");
  }

  return currentProvider;
}
