import { defineGlobal, richText } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [richText("field", { label: "Rich Text Field" })],
  label: "Rich Text Field",
  slug: "rich-text",
});
