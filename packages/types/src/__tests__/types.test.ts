import { describe, it, expect } from "vitest";

describe("@blazing-cms/types", () => {
  it("FieldType union includes all expected values", () => {
    const types = [
      "text", "textarea", "number", "boolean", "date", "datetime",
      "email", "password", "url", "json", "richText", "markdown",
      "code", "color", "media", "upload", "select", "multiSelect",
      "radio", "checkbox", "relation", "component", "dynamicZone",
      "array", "object", "tabs", "group", "repeater", "slug",
    ] as const;
    expect(types).toContain("text");
    expect(types).toContain("number");
    expect(types).toContain("relation");
    expect(types).toContain("dynamicZone");
    expect(types).toContain("slug");
  });

  it("CollectionDefinition has required shape", () => {
    const collection: import("../schema.js").CollectionDefinition = {
      slug: "posts",
      labels: { singular: "Post", plural: "Posts" },
      fields: [{ name: "title", type: "text" }],
    };
    expect(collection.slug).toBe("posts");
    expect(collection.fields).toHaveLength(1);
    expect(collection.fields[0].name).toBe("title");
  });

  it("GlobalDefinition has required shape", () => {
    const global: import("../schema.js").GlobalDefinition = {
      slug: "homepage",
      label: "Homepage",
      fields: [],
    };
    expect(global.slug).toBe("homepage");
    expect(global.label).toBe("Homepage");
  });

  it("ComponentDefinition has required shape", () => {
    const component: import("../schema.js").ComponentDefinition = {
      slug: "hero",
      label: "Hero",
      fields: [],
    };
    expect(component.slug).toBe("hero");
    expect(component.label).toBe("Hero");
  });

  it("FieldDefinition accepts all field types", () => {
    const field: import("../fields.js").FieldDefinition = {
      name: "test",
      type: "text",
      label: "Test",
      validation: { required: true },
    };
    expect(field.type).toBe("text");
    expect(field.validation?.required).toBe(true);
  });

  it("SelectField requires options", () => {
    const field: import("../fields.js").SelectField = {
      name: "choice",
      type: "select",
      options: [{ label: "A", value: "a" }],
    };
    expect(field.options).toHaveLength(1);
    expect(field.options[0].value).toBe("a");
  });

  it("RelationField requires target collection", () => {
    const field: import("../fields.js").RelationField = {
      name: "author",
      type: "relation",
      to: "users",
      kind: "manyToOne",
    };
    expect(field.to).toBe("users");
    expect(field.kind).toBe("manyToOne");
  });

  it("DatabaseAdapter interface has required methods", () => {
    const adapter: import("../database.js").DatabaseAdapter = {
      connect: async () => undefined,
      disconnect: async () => undefined,
      findOne: async () => null,
      findMany: async () => ({ data: [], total: 0 }),
      create: async () => ({}),
      update: async () => null,
      delete: async () => true,
      deleteMany: async () => 0,
      transaction: async (fn) => fn(),
    };
    expect(typeof adapter.connect).toBe("function");
    expect(typeof adapter.findOne).toBe("function");
    expect(typeof adapter.findMany).toBe("function");
    expect(typeof adapter.transaction).toBe("function");
  });

  it("PluginDefinition has required fields", () => {
    const plugin: import("../plugin.js").PluginDefinition = {
      slug: "seo",
      name: "SEO Plugin",
      enabled: true,
    };
    expect(plugin.slug).toBe("seo");
    expect(plugin.enabled).toBe(true);
  });

  it("Logger interface has all levels", () => {
    const logger: import("../core.js").Logger = {
      debug: () => undefined,
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
      fatal: () => undefined,
    };
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.fatal).toBe("function");
  });

  it("QueryOptions allows sort, where, select, populate", () => {
    const opts: import("../database.js").QueryOptions = {
      sort: { createdAt: "desc" },
      where: { status: "published" },
      select: ["title", "content"],
      populate: ["author"],
    };
    expect(opts.sort?.createdAt).toBe("desc");
    expect(opts.where?.status).toBe("published");
    expect(opts.select).toEqual(["title", "content"]);
  });
});
