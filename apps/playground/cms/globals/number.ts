import { defineGlobal, number } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [number("field", { label: "Number Field" })],
  label: "Number Field",
  slug: "number",
});
