import type { Logger } from "@blazing-cms/types";

export function createLogger(prefix: string): Logger {
  function log(level: string, ...args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const prefixStr = prefix ? `[${prefix}]` : "";
    // eslint-disable-next-line no-console
    console[level as "log"](`${timestamp} ${prefixStr} [${level.toUpperCase()}]`, ...args);
  }

  return {
    debug(...args: unknown[]) {
      log("debug", ...args);
    },
    error(...args: unknown[]) {
      log("error", ...args);
    },
    fatal(...args: unknown[]) {
      log("error", ...args);
    },
    info(...args: unknown[]) {
      log("info", ...args);
    },
    warn(...args: unknown[]) {
      log("warn", ...args);
    },
  };
}
