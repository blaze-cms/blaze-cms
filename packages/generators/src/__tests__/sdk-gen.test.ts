import type { CollectionDefinition, GlobalDefinition } from "@blazing-cms/types";

import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { SdkGenerator } from "../sdk.js";

describe("SdkGenerator", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "sdkgen-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { force: true, recursive: true });
  });

  it("generates SDK code for collections", async () => {
    const collections: CollectionDefinition[] = [
      {
        fields: [{ name: "title", type: "text" }],
        labels: { plural: "Posts", singular: "Post" },
        slug: "posts",
      },
    ];

    const gen = new SdkGenerator();
    await gen.generate(collections, [], [], outDir);

    const output = readFileSync(join(outDir, "sdk.ts"), "utf-8");
    expect(output).toContain('import { createBlazeClient } from "@blazing-cms/sdk"');
    expect(output).toContain("export const posts = {");
    expect(output).toContain('client.collection("posts").findMany(');
    expect(output).toContain('client.collection("posts").findById(');
    expect(output).toContain('client.collection("posts").create(');
    expect(output).toContain('client.collection("posts").update(');
    expect(output).toContain('client.collection("posts").delete(');
  });

  it("generates SDK code for globals", async () => {
    const globals: GlobalDefinition[] = [
      {
        fields: [{ name: "title", type: "text" }],
        label: "Homepage",
        slug: "homepage",
      },
    ];

    const gen = new SdkGenerator();
    await gen.generate([], globals, [], outDir);

    const output = readFileSync(join(outDir, "sdk.ts"), "utf-8");
    expect(output).toContain("export const homepage = {");
    expect(output).toContain('client.globals.get("homepage")');
    expect(output).toContain('client.globals.upsert("homepage"');
  });

  it("creates the output file", async () => {
    const gen = new SdkGenerator();
    await gen.generate([], [], [], outDir);
    expect(existsSync(join(outDir, "sdk.ts"))).toBe(true);
  });
});
