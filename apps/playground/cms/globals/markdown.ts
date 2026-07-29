import { defineGlobal, markdown } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [markdown("field", { label: "Markdown Field" })],
  label: "Markdown Field",
  slug: "markdown",
});
