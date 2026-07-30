import type { CollectionDefinition } from "@blazing-cms/types";

import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { ValidationGenerator } from "../validation.js";

describe("ValidationGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "valgen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { force: true, recursive: true });
  });

  it("generates Zod schemas for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [
          { name: "title", type: "text", validation: { required: true } },
          { name: "email", type: "email" },
          { name: "url", type: "url" },
        ],
        labels: { plural: "Posts", singular: "Post" },
        slug: "posts",
      },
    ];

    const gen = new ValidationGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "validation.ts"), "utf-8");
    expect(output).toContain('import { z } from "zod"');
    expect(output).toContain("export const PostsSchema = z.object({");
    expect(output).toContain("id: z.string().optional()");
    expect(output).toContain("title: z.string()");
    expect(output).toContain("email: z.string().email()");
    expect(output).toContain("url: z.string().url()");
    expect(output).toContain("export type PostsInput = z.infer<typeof PostsSchema>");
  });

  it("marks optional fields with .optional()", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [
          { name: "required", type: "text", validation: { required: true } },
          { name: "optional", type: "text" },
        ],
        labels: { plural: "Ts", singular: "T" },
        slug: "test",
      },
    ];

    const gen = new ValidationGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "validation.ts"), "utf-8");
    expect(output).toContain("required: z.string()");
    expect(output).toContain("optional: z.string().optional()");
  });

  it("creates the output file", async () => {
    const gen = new ValidationGenerator();
    await gen.generate([], [], [], outDir);
    expect(existsSync(join(outDir, "validation.ts"))).toBe(true);
  });

  it("falls back to z.unknown() for unknown field type", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [{ name: "weird", type: "unknown-type" as never }],
        labels: { plural: "Ts", singular: "T" },
        slug: "test",
      },
    ];
    const gen = new ValidationGenerator();
    await gen.generate(collections, [], [], outDir);
    const output = readFileSync(join(outDir, "validation.ts"), "utf-8");
    expect(output).toContain("weird: z.unknown()");
  });

  it("generates correct zod types for all field types", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [
          { name: "num", type: "number" },
          { name: "bool", type: "boolean" },
          { name: "arr", options: [{ label: "A", value: "a" }], type: "multiSelect" },
          { name: "json", type: "json" },
        ],
        labels: { plural: "Ts", singular: "T" },
        slug: "all-types",
      },
    ];

    const gen = new ValidationGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "validation.ts"), "utf-8");
    expect(output).toContain("num: z.number()");
    expect(output).toContain("bool: z.boolean()");
    expect(output).toContain("arr: z.array(z.string())");
    expect(output).toContain("json: z.unknown()");
  });
});
