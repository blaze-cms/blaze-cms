export type BackendMode = "firebase" | "mock";

export function getBackendMode(): BackendMode {
  const mode: string | undefined = import.meta.env.VITE_BACKEND_MODE as string | undefined;
  if (mode === "mock") return "mock";
  return "firebase";
}

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}
