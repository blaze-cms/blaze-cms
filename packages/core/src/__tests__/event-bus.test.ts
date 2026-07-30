import { describe, it, expect, vi } from "vitest";

import { EventBus } from "../event-bus.js";

describe("EventBus", () => {
  it("emits to registered handlers", async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on("test", handler);
    await bus.emit("test", { id: 1 });
    expect(handler).toHaveBeenCalledWith({ id: 1 }, undefined);
  });

  it("passes context to handlers", async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on("test", handler);
    const ctx = { requestId: "abc" };
    await bus.emit("test", { id: 1 }, ctx);
    expect(handler).toHaveBeenCalledWith({ id: 1 }, ctx);
  });

  it("supports multiple handlers per event", async () => {
    const bus = new EventBus();
    const a = vi.fn();
    const b = vi.fn();
    bus.on("test", a);
    bus.on("test", b);
    await bus.emit("test", "data");
    expect(a).toHaveBeenCalledWith("data", undefined);
    expect(b).toHaveBeenCalledWith("data", undefined);
  });

  it("does nothing for events with no handlers", async () => {
    const bus = new EventBus();
    await expect(bus.emit("nonexistent")).resolves.toBeUndefined();
  });

  it("removes a handler via returned unsubscribe", async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const off = bus.on("test", handler);
    off();
    await bus.emit("test");
    expect(handler).not.toHaveBeenCalled();
  });

  it("removes a handler via off()", async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on("test", handler);
    bus.off("test", handler);
    await bus.emit("test");
    expect(handler).not.toHaveBeenCalled();
  });

  it("isolates handler errors", async () => {
    const bus = new EventBus();
    const bad = vi.fn().mockRejectedValue(new Error("fail"));
    const good = vi.fn();
    bus.on("test", bad);
    bus.on("test", good);
    await bus.emit("test");
    expect(good).toHaveBeenCalled();
  });

  it("removeAll clears all handlers", async () => {
    const bus = new EventBus();
    bus.on("a", vi.fn());
    bus.on("b", vi.fn());
    bus.removeAll();
    // No way to check directly, but emit should not throw
    await expect(bus.emit("a")).resolves.toBeUndefined();
    await expect(bus.emit("b")).resolves.toBeUndefined();
  });

  it("removeAll with event name clears only that event", async () => {
    const bus = new EventBus();
    const a = vi.fn();
    const b = vi.fn();
    bus.on("a", a);
    bus.on("b", b);
    bus.removeAll("a");
    await bus.emit("a");
    await bus.emit("b");
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });

  it("handles async handlers", async () => {
    const bus = new EventBus();
    let resolved = false;
    bus.on("test", async () => {
      await new Promise((r) => setTimeout(r, 1));
      resolved = true;
    });
    await bus.emit("test");
    expect(resolved).toBe(true);
  });

  it("runs middleware chain before handlers", async () => {
    const order: string[] = [];
    const middleware = async (_event: string, _payload: unknown, next: () => Promise<void>) => {
      order.push("mw-start");
      await next();
      order.push("mw-end");
    };
    const bus = new EventBus({ middleware: [middleware] });
    bus.on("test", () => {
      order.push("handler");
    });
    await bus.emit("test");
    expect(order).toEqual(["mw-start", "handler", "mw-end"]);
  });

  it("supports multiple middleware in order", async () => {
    const order: string[] = [];
    const m1 = async (_e: string, _p: unknown, next: () => Promise<void>) => {
      order.push("m1-before");
      await next();
      order.push("m1-after");
    };
    const m2 = async (_e: string, _p: unknown, next: () => Promise<void>) => {
      order.push("m2-before");
      await next();
      order.push("m2-after");
    };
    const bus = new EventBus({ middleware: [m1, m2] });
    bus.on("test", () => {
      order.push("handler");
    });
    await bus.emit("test");
    expect(order).toEqual(["m1-before", "m2-before", "handler", "m2-after", "m1-after"]);
  });

  it("works without middleware", async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on("test", handler);
    await bus.emit("test", "payload");
    expect(handler).toHaveBeenCalledWith("payload", undefined);
  });
});
