import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { GenerationPipeline } from "../pipeline.js";
import type { Generator } from "../generator.js";

describe("GenerationPipeline", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("runs multiple generators in sequence", async () => {
    const calls: string[] = [];

    const gen1: Generator = {
      name: "gen1",
      generate: async () => { calls.push("gen1"); },
    };
    const gen2: Generator = {
      name: "gen2",
      generate: async () => { calls.push("gen2"); },
    };

    const pipeline = new GenerationPipeline();
    pipeline.addGenerator(gen1);
    pipeline.addGenerator(gen2);
    await pipeline.run([], [], [], outDir);

    expect(calls).toEqual(["gen1", "gen2"]);
  });

  it("works with no generators", async () => {
    const pipeline = new GenerationPipeline();
    await expect(pipeline.run([], [], [], outDir)).resolves.toBeUndefined();
  });

  it("passes schemas and outDir to each generator", async () => {
    const spy = vi.fn<Generator["generate"]>();
    const gen: Generator = { name: "spy", generate: spy };

    const collections = [{ slug: "posts", labels: { singular: "P", plural: "Ps" }, fields: [] }];
    const globals = [{ slug: "homepage", label: "H", fields: [] }];
    const components = [{ slug: "hero", label: "H", fields: [] }];

    const pipeline = new GenerationPipeline();
    pipeline.addGenerator(gen);
    await pipeline.run(collections, globals, components, outDir);

    expect(spy).toHaveBeenCalledWith(collections, globals, components, outDir);
  });
});
