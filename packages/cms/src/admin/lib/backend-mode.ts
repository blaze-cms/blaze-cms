export type BackendMode = "firebase" | "server" | "mock";

export function getBackendMode(): BackendMode {
  const mode = import.meta.env.VITE_BACKEND_MODE;
  if (mode === "server") return "server";
  if (mode === "mock") return "mock";
  return "firebase";
}

export function isFirebaseMode(): boolean {
  return getBackendMode() === "firebase";
}

export function isServerMode(): boolean {
  return getBackendMode() === "server";
}

export function isMockMode(): boolean {
  return getBackendMode() === "mock";
}

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}
