import { describe, it, expect } from "vitest";
import { generateZodSchema } from "../generator.js";
import type { FieldDefinition } from "@blaze-cms/types";

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
    const fields: FieldDefinition[] = [{ name: "color", type: "select", options: [{ label: "R", value: "red" }] }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ color: "red" })).toEqual({ color: "red" });
  });

  it("validates multiSelect field as array", () => {
    const fields: FieldDefinition[] = [{ name: "tags", type: "multiSelect", options: [{ label: "A", value: "a" }] }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ tags: ["a", "b"] })).toEqual({ tags: ["a", "b"] });
  });

  it("validates relation field (singular)", () => {
    const fields: FieldDefinition[] = [{ name: "author", type: "relation", to: "users" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ author: "abc123" })).toEqual({ author: "abc123" });
  });

  it("validates relation field (plural)", () => {
    const fields: FieldDefinition[] = [{ name: "tags", type: "relation", to: "tags", kind: "manyToMany" }];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ tags: ["a", "b"] })).toEqual({ tags: ["a", "b"] });
  });

  it("validates group field as nested object", () => {
    const fields: FieldDefinition[] = [
      {
        name: "meta",
        type: "group",
        fields: [{ name: "key", type: "text" }],
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ meta: { key: "value" } })).toEqual({ meta: { key: "value" } });
  });

  it("validates repeater field as array of objects", () => {
    const fields: FieldDefinition[] = [
      {
        name: "items",
        type: "repeater",
        fields: [{ name: "name", type: "text" }],
      },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ items: [{ name: "one" }, { name: "two" }] })).toEqual({
      items: [{ name: "one" }, { name: "two" }],
    });
  });

  it("validates dynamicZone as array with __component", () => {
    const fields: FieldDefinition[] = [
      { name: "blocks", type: "dynamicZone", components: ["hero", "cta"] },
    ];
    const schema = generateZodSchema(fields);
    const parsed = schema.parse({ blocks: [{ __component: "hero", heading: "Hi" }] }) as Record<string, unknown>;
    const blocks = parsed.blocks as Record<string, unknown>[];
    expect(blocks).toHaveLength(1);
    expect(blocks[0]!.__component).toBe("hero");
  });

  it("applies default value", () => {
    const fields: FieldDefinition[] = [
      { name: "status", type: "text", defaultValue: "draft" },
    ];
    const schema = generateZodSchema(fields);
    const result = schema.parse({});
    expect(result).toEqual({ status: "draft" });
  });

  it("applies min/max validation for numbers", () => {
    const fields: FieldDefinition[] = [
      { name: "age", type: "number", validation: { min: 0, max: 150 } },
    ];
    const schema = generateZodSchema(fields);
    expect(schema.parse({ age: 25 })).toEqual({ age: 25 });
  });

  it("rejects number below min", () => {
    const fields: FieldDefinition[] = [
      { name: "age", type: "number", validation: { min: 0 } },
    ];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ age: -1 })).toThrow();
  });

  it("rejects number above max", () => {
    const fields: FieldDefinition[] = [
      { name: "age", type: "number", validation: { max: 150 } },
    ];
    const schema = generateZodSchema(fields);
    expect(() => schema.parse({ age: 200 })).toThrow();
  });

  it("applies minLength/maxLength for strings", () => {
    const fields: FieldDefinition[] = [
      { name: "code", type: "text", validation: { minLength: 2, maxLength: 10 } },
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
});
