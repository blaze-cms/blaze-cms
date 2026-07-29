import { defineGlobal, slug } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [slug("field", { label: "Slug Field" })],
  label: "Slug Field",
  slug: "slug",
});
