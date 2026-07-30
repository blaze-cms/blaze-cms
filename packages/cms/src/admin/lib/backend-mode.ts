export type BackendMode = "firebase" | "server" | "mock";

export function getBackendMode(): BackendMode {
  const mode: string | undefined = import.meta.env.VITE_BACKEND_MODE as string | undefined;
  if (mode === "server") return "server";
  if (mode === "mock") return "mock";
  return "firebase";
}

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}
