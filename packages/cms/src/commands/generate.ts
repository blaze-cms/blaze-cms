import {
  TypeGenerator,
  ValidationGenerator,
  SdkGenerator,
  GenerationPipeline,
} from "@blaze-cms/generators";
import { SchemaLoader } from "@blaze-cms/schema";
import { resolve } from "node:path";

export interface GenerateOptions {
  type?: string;
  dir?: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const schemaDir = resolve(process.cwd(), options.dir ?? "cms");
  const outDir = resolve(process.cwd(), "src/__generated__");

  console.warn(`Loading schemas from ${schemaDir}...`);
  const loader = new SchemaLoader(schemaDir);
  const schema = await loader.load();

  console.warn(`Found ${schema.collections.length} collections, ${schema.globals.length} globals`);

  const pipeline = new GenerationPipeline();

  if (!options.type || options.type === "types") {
    pipeline.addGenerator(new TypeGenerator());
  }
  if (!options.type || options.type === "validation") {
    pipeline.addGenerator(new ValidationGenerator());
  }
  if (!options.type || options.type === "sdk") {
    pipeline.addGenerator(new SdkGenerator());
  }

  await pipeline.run(schema.collections, schema.globals, schema.components, outDir);
  console.warn(`Generated files in ${outDir}`);
}
