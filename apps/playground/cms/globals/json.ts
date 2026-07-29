import { defineGlobal, json } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [json("field", { label: "JSON Field" })],
  label: "JSON Field",
  slug: "json",
});
