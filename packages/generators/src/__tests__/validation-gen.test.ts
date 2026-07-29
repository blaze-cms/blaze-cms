import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ValidationGenerator } from "../validation.js";
import type { CollectionDefinition } from "@blaze-cms/types";

describe("ValidationGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "valgen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("generates Zod schemas for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        slug: "posts",
        labels: { singular: "Post", plural: "Posts" },
        fields: [
          { name: "title", type: "text", validation: { required: true } },
          { name: "email", type: "email" },
          { name: "url", type: "url" },
        ],
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
        slug: "test",
        labels: { singular: "T", plural: "Ts" },
        fields: [
          { name: "required", type: "text", validation: { required: true } },
          { name: "optional", type: "text" },
        ],
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
});
