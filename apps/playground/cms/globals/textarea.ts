import { defineGlobal, textarea } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [textarea("field", { label: "Textarea Field" })],
  label: "Textarea Field",
  slug: "textarea",
});
