export type BackendMode = "firebase" | "server";

export function getBackendMode(): BackendMode {
  const mode = import.meta.env.VITE_BACKEND_MODE;
  if (mode === "server") return "server";
  return "firebase";
}

export function isFirebaseMode(): boolean {
  return getBackendMode() === "firebase";
}

export function isServerMode(): boolean {
  return getBackendMode() === "server";
}

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}
