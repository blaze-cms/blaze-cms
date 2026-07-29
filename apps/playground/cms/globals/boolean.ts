import { defineGlobal, boolean } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [boolean("field", { label: "Boolean Field" })],
  label: "Boolean Field",
  slug: "boolean",
});
