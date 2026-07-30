import type { CollectionDefinition, GlobalDefinition } from "@blazing-cms/types";

import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { TypeGenerator } from "../typegen.js";

describe("TypeGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "typegen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { force: true, recursive: true });
  });

  it("generates TypeScript interfaces for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [
          { name: "title", type: "text" },
          { name: "views", type: "number" },
          { name: "published", type: "boolean" },
        ],
        labels: { plural: "Posts", singular: "Post" },
        slug: "posts",
      },
      {
        fields: [
          { name: "email", type: "email" },
          { name: "name", type: "text" },
        ],
        labels: { plural: "Users", singular: "User" },
        slug: "users",
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
        fields: [{ name: "heroTitle", type: "text" }],
        label: "Homepage",
        slug: "homepage",
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
        fields: [{ name: "body", type: "richText" }],
        labels: { plural: "Rs", singular: "R" },
        slug: "rich-text",
      },
      {
        fields: [{ name: "file", type: "media" }],
        labels: { plural: "Ms", singular: "M" },
        slug: "media-test",
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
        fields: [
          { name: "a", type: "text" },
          { name: "b", type: "textarea" },
          { name: "c", type: "number" },
          { name: "d", type: "boolean" },
          { name: "e", type: "date" },
          { name: "f", type: "email" },
          { name: "g", type: "json" },
          { name: "h", options: [{ label: "A", value: "a" }], type: "multiSelect" },
        ],
        labels: { plural: "Ts", singular: "T" },
        slug: "all-types",
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

  it("uses safeName to avoid globals collision", async () => {
    const collections: CollectionDefinition[] = [
      { fields: [], labels: { plural: "Ss", singular: "S" }, slug: "string" },
      { fields: [], labels: { plural: "Ns", singular: "N" }, slug: "number" },
      { fields: [], labels: { plural: "Bs", singular: "B" }, slug: "boolean" },
    ];

    const gen = new TypeGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("export interface StringEntry");
    expect(output).toContain("export interface NumberEntry");
    expect(output).toContain("export interface BooleanEntry");
  });

  it("creates the output file", async () => {
    const gen = new TypeGenerator();
    await gen.generate([], [], [], outDir);
    expect(existsSync(join(outDir, "types.ts"))).toBe(true);
  });

  it("falls back to string for unknown field type", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [{ name: "weird", type: "unknown-type" as never }],
        labels: { plural: "Ts", singular: "T" },
        slug: "test",
      },
    ];
    const gen = new TypeGenerator();
    await gen.generate(collections, [], [], outDir);
    const output = readFileSync(join(outDir, "types.ts"), "utf-8");
    expect(output).toContain("weird: string");
  });
});
