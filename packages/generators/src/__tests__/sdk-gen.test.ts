import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { SdkGenerator } from "../sdk.js";
import type { CollectionDefinition, GlobalDefinition } from "@blazing-cms/types";

describe("SdkGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "sdkgen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("generates SDK code for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        slug: "posts",
        labels: { singular: "Post", plural: "Posts" },
        fields: [{ name: "title", type: "text" }],
      },
    ];

    const gen = new SdkGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "sdk.ts"), "utf-8");
    expect(output).toContain('import { createClient } from "@blazing-cms/sdk"');
    expect(output).toContain("export const posts = {");
    expect(output).toContain('api.findMany("posts"');
    expect(output).toContain('api.findOne("posts"');
    expect(output).toContain('api.create("posts"');
    expect(output).toContain('api.update("posts"');
    expect(output).toContain('api.delete("posts"');
  });

  it("generates SDK code for globals", async () => {
    const globals: GlobalDefinition[] = [
      {
        slug: "homepage",
        label: "Homepage",
        fields: [{ name: "title", type: "text" }],
      },
    ];

    const gen = new SdkGenerator();
    await gen.generate([], globals, [], outDir);

    const output = readFileSync(join(outDir, "sdk.ts"), "utf-8");
    expect(output).toContain("export const homepage = {");
    expect(output).toContain('api.findOne("globals_homepage"');
    expect(output).toContain('api.update("globals_homepage"');
  });

  it("creates the output file", async () => {
    const gen = new SdkGenerator();
    await gen.generate([], [], [], outDir);
    expect(existsSync(join(outDir, "sdk.ts"))).toBe(true);
  });
});
