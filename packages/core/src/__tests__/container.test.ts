import { describe, it, expect } from "vitest";

import { Container } from "../container.js";

describe("Container", () => {
  it("resolves a registered factory", async () => {
    const c = new Container();
    c.register("foo", () => "bar");
    expect(await c.resolve<string>("foo")).toBe("bar");
  });

  it("caches singleton instances", async () => {
    let count = 0;
    const c = new Container();
    c.register("counter", () => ++count, true);
    await c.resolve("counter");
    await c.resolve("counter");
    expect(count).toBe(1);
  });

  it("creates new instances for non-singleton", async () => {
    let count = 0;
    const c = new Container();
    c.register("counter", () => ++count, false);
    await c.resolve("counter");
    await c.resolve("counter");
    expect(count).toBe(2);
  });

  it("throws for unregistered service", async () => {
    const c = new Container();
    await expect(c.resolve("missing")).rejects.toThrow("Service not registered: missing");
  });

  it("has returns true for registered services", () => {
    const c = new Container();
    c.register("foo", () => "bar");
    expect(c.has("foo")).toBe(true);
    expect(c.has("missing")).toBe(false);
  });

  it("delegates to parent container on resolve", async () => {
    const parent = new Container();
    parent.register("db", () => "connected");
    const child = parent.createChild();
    expect(await child.resolve<string>("db")).toBe("connected");
  });

  it("checks parent for has()", () => {
    const parent = new Container();
    parent.register("db", () => "connected");
    const child = parent.createChild();
    expect(child.has("db")).toBe(true);
  });

  it("child overrides parent registration", async () => {
    const parent = new Container();
    parent.register("db", () => "parent");
    const child = parent.createChild();
    child.register("db", () => "child");
    expect(await child.resolve<string>("db")).toBe("child");
  });

  it("supports async factories", async () => {
    const c = new Container();
    c.register("async", async () => "delayed");
    expect(await c.resolve<string>("async")).toBe("delayed");
  });

  it("registerInstance stores a pre-built value", async () => {
    const c = new Container();
    const obj = { value: 42 };
    c.registerInstance("config", obj);
    expect(await c.resolve("config")).toBe(obj);
  });

  it("clear removes all registrations", () => {
    const c = new Container();
    c.register("a", () => 1);
    c.register("b", () => 2);
    c.clear();
    expect(c.has("a")).toBe(false);
    expect(c.has("b")).toBe(false);
  });

  it("passes the container to factory functions", async () => {
    const c = new Container();
    c.register("a", () => "value-a");
    c.register("b", (container) => container.resolve("a"));
    expect(await c.resolve<string>("b")).toBe("value-a");
  });
});
