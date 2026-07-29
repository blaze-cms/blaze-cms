import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { TypeGenerator } from "../typegen.js";
import type { CollectionDefinition, GlobalDefinition } from "@blaze-cms/types";

describe("TypeGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "typegen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("generates TypeScript interfaces for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        slug: "posts",
        labels: { singular: "Post", plural: "Posts" },
        fields: [
          { name: "title", type: "text" },
          { name: "views", type: "number" },
          { name: "published", type: "boolean" },
        ],
      },
      {
        slug: "users",
        labels: { singular: "User", plural: "Users" },
        fields: [
          { name: "email", type: "email" },
          { name: "name", type: "text" },
        ],
      },
    ];

    const gen = new TypeGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("export interface Posts");
    expect(output).toContain("title: string");
    expect(output).toContain("views: number");
    expect(output).toContain("published: boolean");
    expect(output).toContain("export interface Users");
    expect(output).toContain("email: string");
  });

  it("generates TypeScript interfaces for globals", async () => {
    const globals: GlobalDefinition[] = [
      {
        slug: "homepage",
        label: "Homepage",
        fields: [{ name: "heroTitle", type: "text" }],
      },
    ];

    const gen = new TypeGenerator();
    await gen.generate([], globals, [], outDir);

    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("export interface Homepage");
    expect(output).toContain("heroTitle: string");
  });

  it("converts kebab-case slugs to PascalCase", async () => {
    const collections: CollectionDefinition[] = [
      {
        slug: "rich-text",
        labels: { singular: "R", plural: "Rs" },
        fields: [{ name: "body", type: "richText" }],
      },
      {
        slug: "media-test",
        labels: { singular: "M", plural: "Ms" },
        fields: [{ name: "file", type: "media" }],
      },
    ];

    const gen = new TypeGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("export interface RichText");
    expect(output).toContain("export interface MediaTest");
  });

  it("maps all field types to correct TypeScript types", async () => {
    const collections: CollectionDefinition[] = [
      {
        slug: "all-types",
        labels: { singular: "T", plural: "Ts" },
        fields: [
          { name: "a", type: "text" },
          { name: "b", type: "textarea" },
          { name: "c", type: "number" },
          { name: "d", type: "boolean" },
          { name: "e", type: "date" },
          { name: "f", type: "email" },
          { name: "g", type: "json" },
          { name: "h", type: "multiSelect", options: [{ label: "A", value: "a" }] },
        ],
      },
    ];

    const gen = new TypeGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("a: string");
    expect(output).toContain("c: number");
    expect(output).toContain("d: boolean");
    expect(output).toContain("h: string[]");
    expect(output).toContain("f: string");
    expect(output).toContain("g: unknown");
  });

  it("creates the output file", async () => {
    const gen = new TypeGenerator();
    await gen.generate([], [], [], outDir);
    expect(existsSync(join(outDir, "types.ts"))).toBe(true);
  });
});
