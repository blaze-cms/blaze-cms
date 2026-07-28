import { watch } from "node:fs";
import { resolve } from "node:path";

export type SchemaChangeHandler = (event: "add" | "change" | "unlink", file: string) => void;

export class SchemaWatcher {
  private watchers: Array<() => void> = [];
  private schemaDir: string;
  private onChange: SchemaChangeHandler;

  constructor(_loader: unknown, onChange: SchemaChangeHandler) {
    this.onChange = onChange;
    this.schemaDir = "";
  }

  start(schemaDir: string): void {
    this.schemaDir = resolve(schemaDir);
    const dirs = ["collections", "globals", "components"];
    for (const dir of dirs) {
      const fullPath = resolve(this.schemaDir, dir);
      try {
        const watcher = watch(fullPath, (eventType, filename) => {
          if (filename) {
            this.onChange(eventType === "rename" ? "add" : "change", filename);
          }
        });
        this.watchers.push(() => watcher.close());
      } catch {
        // directory doesn't exist yet, skip
      }
    }
  }

  stop(): void {
    for (const close of this.watchers) {
      close();
    }
    this.watchers = [];
  }
}
