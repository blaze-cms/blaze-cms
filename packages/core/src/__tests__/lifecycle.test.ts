import { describe, it, expect, vi } from "vitest";

import { Lifecycle } from "../lifecycle.js";

describe("Lifecycle", () => {
  it("starts in init state", () => {
    const lc = new Lifecycle();
    expect(lc.getState()).toBe("init");
  });

  it("transitions to ready after init", async () => {
    const lc = new Lifecycle();
    await lc.init();
    expect(lc.getState()).toBe("ready");
  });

  it("throws on init from non-init state", async () => {
    const lc = new Lifecycle();
    await lc.init();
    await expect(lc.init()).rejects.toThrow("Cannot init from state: ready");
  });

  it("transitions to shutdown from ready", async () => {
    const lc = new Lifecycle();
    await lc.init();
    await lc.shutdown();
    expect(lc.getState()).toBe("shutdown");
  });

  it("throws on shutdown from non-ready state", async () => {
    const lc = new Lifecycle();
    await expect(lc.shutdown()).rejects.toThrow("Cannot shutdown from state: init");
  });

  it("calls onInit hook", async () => {
    const onInit = vi.fn();
    const lc = new Lifecycle({ onInit });
    await lc.init();
    expect(onInit).toHaveBeenCalled();
  });

  it("calls onReady hook", async () => {
    const onReady = vi.fn();
    const lc = new Lifecycle({ onReady });
    await lc.init();
    await lc.ready();
    expect(onReady).toHaveBeenCalled();
  });

  it("calls onShutdown hook on shutdown", async () => {
    const onShutdown = vi.fn();
    const lc = new Lifecycle({ onShutdown });
    await lc.init();
    await lc.shutdown();
    expect(onShutdown).toHaveBeenCalled();
  });

  it("sets state to error on onError", async () => {
    const lc = new Lifecycle();
    await lc.onError();
    expect(lc.getState()).toBe("error");
  });

  it("works without hooks", async () => {
    const lc = new Lifecycle();
    await lc.init();
    await lc.ready();
    await lc.shutdown();
    expect(lc.getState()).toBe("shutdown");
  });
});
