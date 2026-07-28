import { SchemaLoader, SchemaValidator } from "@blaze-cms/schema";
import { resolve } from "node:path";

export interface LintOptions {
  dir?: string;
  fix?: boolean;
}

export async function lint(options: LintOptions): Promise<void> {
  const schemaDir = resolve(process.cwd(), options.dir ?? "cms");
  console.warn(`Linting schemas in ${schemaDir}...`);

  const loader = new SchemaLoader(schemaDir);
  const schema = await loader.load();
  const validator = new SchemaValidator();
  let hasErrors = false;

  for (const collection of schema.collections) {
    const errors = validator.validateCollection(collection);
    if (errors.length > 0) {
      hasErrors = true;
      console.warn(`\nCollection "${collection.slug}":`);
      for (const err of errors) {
        console.warn(`  ✗ ${err.path}: ${err.message}`);
      }
    }
  }

  if (!hasErrors) {
    console.warn("All schemas valid.");
  }

  process.exit(hasErrors ? 1 : 0);
}
