import { defineGlobal, code } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [code("field", { label: "Code Field" })],
  label: "Code Field",
  slug: "code",
});
