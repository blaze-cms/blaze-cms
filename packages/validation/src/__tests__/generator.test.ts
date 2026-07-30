import type { FieldDefinition } from "@blazing-cms/types";

import { describe, it, expect } from "vitest";

import { generateZodSchema } from "../generator.js";

describe("generateZodSchema", () => {
  it("returns a ZodObject", () => {
    const schema = generateZodSchema([]);
    expect(schema.constructor.name).toBe("ZodObject");
  });

  it("validates a text field", () => {
    const fields: FieldDefinition[] = [{ name: "title", type: "text" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ title: "Hello" })).toEqual({ title: "Hello" });
  });

  it("allows omitting non-required text field", () => {
    const fields: FieldDefinition[] = [{ name: "title", type: "text" }];
    const schema = generateZodSchema(fields);
    const result = schema.parse({});
    expect(result.title).toBeUndefined();
  });

  it("validates a required text field", () => {
    const fields: FieldDefinition[] = [
      { name: "title", type: "text", validation: { required: true } },
    ];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({})).toThrow();
  });

  it("validates a number field", () => {
    const fields: FieldDefinition[] = [{ name: "age", type: "number" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ age: 25 })).toEqual({ age: 25 });
  });

  it("rejects string for number field", () => {
    const fields: FieldDefinition[] = [{ name: "age", type: "number" }];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ age: "twenty-five" })).toThrow();
  });

  it("validates a boolean field", () => {
    const fields: FieldDefinition[] = [{ name: "active", type: "boolean" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ active: true })).toEqual({ active: true });
  });

  it("validates select field", () => {
    const fields: FieldDefinition[] = [
      { name: "color", options: [{ label: "R", value: "red" }], type: "select" },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ color: "red" })).toEqual({ color: "red" });
  });

  it("validates multiSelect field as array", () => {
    const fields: FieldDefinition[] = [
      { name: "tags", options: [{ label: "A", value: "a" }], type: "multiSelect" },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ tags: ["a", "b"] })).toEqual({ tags: ["a", "b"] });
  });

  it("validates relation field (singular)", () => {
    const fields: FieldDefinition[] = [{ name: "author", to: "users", type: "relation" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ author: "abc123" })).toEqual({ author: "abc123" });
  });

  it("validates relation field (plural)", () => {
    const fields: FieldDefinition[] = [
      { kind: "manyToMany", name: "tags", to: "tags", type: "relation" },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ tags: ["a", "b"] })).toEqual({ tags: ["a", "b"] });
  });

  it("validates group field as nested object", () => {
    const fields: FieldDefinition[] = [
      {
        fields: [{ name: "key", type: "text" }],
        name: "meta",
        type: "group",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ meta: { key: "value" } })).toEqual({ meta: { key: "value" } });
  });

  it("validates repeater field as array of objects", () => {
    const fields: FieldDefinition[] = [
      {
        fields: [{ name: "name", type: "text" }],
        name: "items",
        type: "repeater",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ items: [{ name: "one" }, { name: "two" }] })).toEqual({
      items: [{ name: "one" }, { name: "two" }],
    });
  });

  it("validates dynamicZone as array with __component", () => {
    const fields: FieldDefinition[] = [
      { components: ["hero", "cta"], name: "blocks", type: "dynamicZone" },
    ];
    const schema = generateZodSchema(fields);
    const parsed = schema.parse({ blocks: [{ __component: "hero", heading: "Hi" }] }) as Record<
      string,
      unknown
    >;
    const blocks = parsed.blocks as Record<string, unknown>[];
    expect(blocks).toHaveLength(1);
    expect(blocks[0]!.__component).toBe("hero");
  });

  it("applies default value", () => {
    const fields: FieldDefinition[] = [{ defaultValue: "draft", name: "status", type: "text" }];
    const schema = generateZodSchema(fields);
    const result = schema.parse({});
    expect(result).toEqual({ status: "draft" });
  });

  it("applies min/max validation for numbers", () => {
    const fields: FieldDefinition[] = [
      { name: "age", type: "number", validation: { max: 150, min: 0 } },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ age: 25 })).toEqual({ age: 25 });
  });

  it("rejects number below min", () => {
    const fields: FieldDefinition[] = [{ name: "age", type: "number", validation: { min: 0 } }];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ age: -1 })).toThrow();
  });

  it("rejects number above max", () => {
    const fields: FieldDefinition[] = [{ name: "age", type: "number", validation: { max: 150 } }];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ age: 200 })).toThrow();
  });

  it("applies minLength/maxLength for strings", () => {
    const fields: FieldDefinition[] = [
      { name: "code", type: "text", validation: { maxLength: 10, minLength: 2 } },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ code: "abc" })).toEqual({ code: "abc" });
  });

  it("rejects string below minLength", () => {
    const fields: FieldDefinition[] = [
      { name: "code", type: "text", validation: { minLength: 2 } },
    ];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ code: "a" })).toThrow();
  });

  it("rejects string above maxLength", () => {
    const fields: FieldDefinition[] = [
      { name: "code", type: "text", validation: { maxLength: 10 } },
    ];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ code: "a".repeat(20) })).toThrow();
  });

  it("validates date field as string", () => {
    const fields: FieldDefinition[] = [{ name: "dob", type: "date" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ dob: "2024-01-01" })).toEqual({ dob: "2024-01-01" });
  });

  it("validates datetime field as string", () => {
    const fields: FieldDefinition[] = [{ name: "publishedAt", type: "datetime" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ publishedAt: "2024-01-01T00:00:00Z" })).toEqual({
      publishedAt: "2024-01-01T00:00:00Z",
    });
  });

  it("validates radio field as string", () => {
    const fields: FieldDefinition[] = [
      { name: "choice", options: [{ label: "A", value: "a" }], type: "radio" },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ choice: "a" })).toEqual({ choice: "a" });
  });

  it("validates email field as string", () => {
    const fields: FieldDefinition[] = [{ name: "email", type: "email" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ email: "test@example.com" })).toEqual({ email: "test@example.com" });
    expect(schema.parse({ email: "not-email" })).toEqual({ email: "not-email" });
  });

  it("validates url field as string", () => {
    const fields: FieldDefinition[] = [{ name: "url", type: "url" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ url: "https://example.com" })).toEqual({ url: "https://example.com" });
    expect(schema.parse({ url: "not-url" })).toEqual({ url: "not-url" });
  });

  it("validates json field as unknown", () => {
    const fields: FieldDefinition[] = [{ name: "data", type: "json" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ data: { anything: "goes" } })).toEqual({ data: { anything: "goes" } });
    expect(schema.parse({ data: 42 })).toEqual({ data: 42 });
  });

  it("validates media/upload fields as strings", () => {
    const fields: FieldDefinition[] = [
      { name: "image", type: "media" },
      { name: "file", type: "upload" },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ file: "doc.pdf", image: "img.jpg" })).toEqual({
      file: "doc.pdf",
      image: "img.jpg",
    });
  });

  it("validates media field as array when multiple is true", () => {
    const fields: FieldDefinition[] = [{ multiple: true, name: "images", type: "media" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ images: ["img1.jpg", "img2.jpg"] })).toEqual({
      images: ["img1.jpg", "img2.jpg"],
    });
    expect(() => schema.parse({ images: "not-array" })).toThrow();
  });

  it("validates object field as nested object", () => {
    const fields: FieldDefinition[] = [
      {
        fields: [{ name: "key", type: "text" }],
        name: "config",
        type: "object",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ config: { key: "value" } })).toEqual({ config: { key: "value" } });
  });

  it("validates repeater with required nested field", () => {
    const fields: FieldDefinition[] = [
      {
        fields: [{ name: "url", type: "url", validation: { required: true } }],
        name: "links",
        type: "repeater",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ links: [{ url: "https://example.com" }] })).toEqual({
      links: [{ url: "https://example.com" }],
    });
    expect(() => schema.parse({ links: [{}] })).toThrow();
  });

  it("validates array field as array of objects", () => {
    const fields: FieldDefinition[] = [
      {
        fields: [{ name: "name", type: "text" }],
        name: "items",
        type: "array",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ items: [{ name: "one" }] })).toEqual({ items: [{ name: "one" }] });
  });

  it("validates tabs field", () => {
    const fields: FieldDefinition[] = [
      {
        name: "settings",
        tabs: [{ fields: [{ name: "title", type: "text" }], label: "General" }],
        type: "tabs",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ settings: { General: { title: "Hello" } } })).toEqual({
      settings: { General: { title: "Hello" } },
    });
  });

  it("validates checkbox field as boolean", () => {
    const fields: FieldDefinition[] = [{ name: "agree", type: "checkbox" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ agree: true })).toEqual({ agree: true });
  });

  it("validates component field as record when not repeatable", () => {
    const fields: FieldDefinition[] = [
      {
        component: "seo",
        fields: [{ name: "title", type: "text" }],
        name: "seo",
        type: "component",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ seo: { title: "Meta" } })).toEqual({ seo: { title: "Meta" } });
  });

  it("validates component field as array when repeatable", () => {
    const fields: FieldDefinition[] = [
      {
        component: "card",
        fields: [{ name: "heading", type: "text" }],
        name: "cards",
        repeatable: true,
        type: "component",
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ cards: [{ heading: "Hello" }] })).toEqual({
      cards: [{ heading: "Hello" }],
    });
  });

  it("handles unknown field type gracefully", () => {
    const fields: FieldDefinition[] = [{ name: "weird", type: "unknown-type" as never }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ weird: "anything" })).toEqual({ weird: "anything" });
  });

  it("applies pattern validation", () => {
    const fields: FieldDefinition[] = [
      { name: "code", type: "text", validation: { pattern: "^[A-Z]+$" } },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ code: "ABC" })).toEqual({ code: "ABC" });
    expect(() => schema.parse({ code: "abc" })).toThrow();
  });
});
