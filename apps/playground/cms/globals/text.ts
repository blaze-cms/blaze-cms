import { defineGlobal, text } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [text("field", { label: "Text Field" })],
  label: "Text Field",
  slug: "text",
});
