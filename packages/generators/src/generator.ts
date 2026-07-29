import type { CollectionDefinition, GlobalDefinition, ComponentDefinition } from "@blazing-cms/types";

export interface Generator {
  name: string;
  generate(
    collections: CollectionDefinition[],
    globals: GlobalDefinition[],
    components: ComponentDefinition[],
    outDir: string,
  ): Promise<void>;
}
