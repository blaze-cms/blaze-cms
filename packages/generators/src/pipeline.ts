import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blaze-cms/types";

import type { Generator } from "./generator.js";

export class GenerationPipeline {
  private generators: Generator[] = [];

  addGenerator(generator: Generator): void {
    this.generators.push(generator);
  }

  async run(
    collections: CollectionDefinition[],
    globals: GlobalDefinition[],
    components: ComponentDefinition[],
    outDir: string,
  ): Promise<void> {
    for (const generator of this.generators) {
      await generator.generate(collections, globals, components, outDir);
    }
  }
}
