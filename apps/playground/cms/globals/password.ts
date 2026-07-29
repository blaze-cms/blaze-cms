import { defineGlobal, password } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [password("field", { label: "Password Field" })],
  label: "Password Field",
  slug: "password",
});
