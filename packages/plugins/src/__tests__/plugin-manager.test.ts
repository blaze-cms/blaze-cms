import type { PluginDefinition, FieldDefinition } from "@blazing-cms/types";

import { describe, it, expect, vi } from "vitest";

import { PluginManager } from "../plugin-manager.js";

const makePlugin = (slug: string, overrides?: Partial<PluginDefinition>): PluginDefinition => ({
  enabled: true,
  name: `Plugin ${slug}`,
  slug,
  ...overrides,
});

describe("PluginManager", () => {
  it("registers a plugin", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("seo"));
    expect(pm.get("seo")).toBeDefined();
    expect(pm.get("seo")?.plugin.slug).toBe("seo");
  });

  it("returns undefined for unregistered plugin", () => {
    const pm = new PluginManager();
    expect(pm.get("missing")).toBeUndefined();
  });

  it("returns all registered plugins", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("seo"));
    pm.register(makePlugin("analytics"));
    expect(pm.getAll()).toHaveLength(2);
  });

  it("unregisters a plugin", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("seo"));
    pm.unregister("seo");
    expect(pm.get("seo")).toBeUndefined();
  });

  it("runs hook handlers", async () => {
    const pm = new PluginManager();
    const handler = vi.fn();
    pm.register(makePlugin("seo", { hooks: { beforeSchemaLoad: handler } }));
    await pm.runHook("beforeSchemaLoad", "arg1", "arg2");
    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("does nothing for hooks with no handlers", async () => {
    const pm = new PluginManager();
    await expect(pm.runHook("nonexistent")).resolves.toBeUndefined();
  });

  it("runs multiple hook handlers sequentially", async () => {
    const pm = new PluginManager();
    const order: number[] = [];
    pm.register(
      makePlugin("a", {
        hooks: {
          beforeSchemaLoad: async () => {
            order.push(1);
          },
        },
      }),
    );
    pm.register(
      makePlugin("b", {
        hooks: {
          beforeSchemaLoad: async () => {
            order.push(2);
          },
        },
      }),
    );
    await pm.runHook("beforeSchemaLoad");
    expect(order).toEqual([1, 2]);
  });

  it("aggregates custom fields by collection", () => {
    const pm = new PluginManager();
    pm.register(
      makePlugin("seo", {
        customFields: {
          pages: [{ name: "ogImage", type: "media" } as FieldDefinition],
          posts: [{ name: "metaTitle", type: "text" } as FieldDefinition],
        },
      }),
    );
    pm.register(
      makePlugin("analytics", {
        customFields: {
          posts: [{ name: "trackingId", type: "text" } as FieldDefinition],
        },
      }),
    );
    const fields = pm.getCustomFields();
    expect(fields.posts).toHaveLength(2);
    expect(fields.pages).toHaveLength(1);
    expect(fields.posts?.[0]?.name).toBe("metaTitle");
    expect(fields.posts?.[1]?.name).toBe("trackingId");
  });

  it("returns empty object when no custom fields", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("empty"));
    expect(pm.getCustomFields()).toEqual({});
  });

  it("aggregates admin panels", () => {
    const pm = new PluginManager();
    pm.register(
      makePlugin("seo", {
        adminPanels: [
          { component: "./seo.js", label: "SEO Tools", plugin: "seo", slug: "seo-tools" },
        ],
      }),
    );
    pm.register(
      makePlugin("analytics", {
        adminPanels: [
          {
            component: "./analytics.js",
            icon: "Chart",
            label: "Analytics",
            plugin: "analytics",
            slug: "analytics",
          },
        ],
      }),
    );
    const panels = pm.getAdminPanels();
    expect(panels).toHaveLength(2);
    expect(panels[0]?.plugin).toBe("seo");
    expect(panels[1]?.plugin).toBe("analytics");
    expect(panels[1]?.icon).toBe("Chart");
  });

  it("stores options with registration", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("seo"), { apiKey: "xyz" });
    expect(pm.get("seo")?.options).toEqual({ apiKey: "xyz" });
  });

  it("does not register hooks for missing hook definitions", () => {
    const pm = new PluginManager();
    pm.register(makePlugin("no-hooks"));
    // No hooks should be registered
    // This should not throw
    expect(pm.get("no-hooks")).toBeDefined();
  });
});
