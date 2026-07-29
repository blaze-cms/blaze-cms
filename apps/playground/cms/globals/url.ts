import { defineGlobal, url } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [url("field", { label: "URL Field" })],
  label: "URL Field",
  slug: "url",
});
