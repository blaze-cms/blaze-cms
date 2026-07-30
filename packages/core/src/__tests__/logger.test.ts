import { describe, it, expect, vi } from "vitest";

import { createLogger } from "../logger.js";

describe("createLogger", () => {
  it("returns an object with all log levels", () => {
    const log = createLogger("test");
    expect(log.debug).toBeInstanceOf(Function);
    expect(log.info).toBeInstanceOf(Function);
    expect(log.warn).toBeInstanceOf(Function);
    expect(log.error).toBeInstanceOf(Function);
    expect(log.fatal).toBeInstanceOf(Function);
  });

  it("calls console.info for info", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = createLogger("app");
    log.info("hello");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[INFO]"), "hello");
    spy.mockRestore();
  });

  it("calls console.warn for warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const log = createLogger("app");
    log.warn("caution");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[WARN]"), "caution");
    spy.mockRestore();
  });

  it("calls console.error for error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = createLogger("app");
    log.error("fail");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[ERROR]"), "fail");
    spy.mockRestore();
  });

  it("calls console.error for fatal", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = createLogger("app");
    log.fatal("crash");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[ERROR]"), "crash");
    spy.mockRestore();
  });

  it("calls console.debug for debug", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const log = createLogger("test");
    log.debug("verbose");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG]"), "verbose");
    spy.mockRestore();
  });

  it("includes the prefix in the log message", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = createLogger("MYMOD");
    log.info("msg");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[MYMOD]"), "msg");
    spy.mockRestore();
  });

  it("handles multiple arguments", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = createLogger("app");
    log.info("a", { b: 1 }, [2]);
    expect(spy).toHaveBeenCalledWith(expect.any(String), "a", { b: 1 }, [2]);
    spy.mockRestore();
  });

  it("works with empty prefix", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = createLogger("");
    log.info("no-prefix");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[INFO]"), "no-prefix");
    expect(spy.mock.calls[0]![0]).not.toContain("[]");
    spy.mockRestore();
  });
});
