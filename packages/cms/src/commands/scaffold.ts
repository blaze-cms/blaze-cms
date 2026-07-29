import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { prompt } from "./utils/prompt.js";

export interface ScaffoldOptions {
  type?: string;
  name?: string;
}

const collectionTemplate = (slug: string) => `
import { defineCollection, text, slug, richText, status } from "@blaze-cms/schema";

export default defineCollection({
  slug: "${slug}",
  label: "${slug.charAt(0).toUpperCase() + slug.slice(1)}",
  admin: {
    group: "Content",
  },
  fields: [
    text("title", { required: true }),
    slug("slug", { sourceField: "title" }),
    richText("content"),
    status(),
  ],
});
`;

const globalTemplate = (slug: string) => `
import { defineGlobal, text, richText } from "@blaze-cms/schema";

export default defineGlobal({
  slug: "${slug}",
  label: "${slug.charAt(0).toUpperCase() + slug.slice(1)}",
  fields: [
    text("title"),
    richText("content"),
  ],
});
`;

export async function scaffold(options: ScaffoldOptions): Promise<void> {
  const type = options.type || await prompt("Type? (collection/global/component): ");
  const slug = options.name || await prompt("Slug (e.g. my-collection): ");

  const cmsDir = resolve(process.cwd(), "cms");
  const dir = resolve(cmsDir, type === "global" ? "globals" : `${type}s`);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const filePath = resolve(dir, `${slug}.ts`);
  if (existsSync(filePath)) {
    console.error(`  ✗ ${type} "${slug}" already exists at ${filePath}`);
    process.exit(1);
  }

  const template = type === "global" ? globalTemplate(slug) : collectionTemplate(slug);
  writeFileSync(filePath, template.trimStart());

  console.warn(`  ✓ Created ${type} "${slug}" at ${filePath}\n`);
}
