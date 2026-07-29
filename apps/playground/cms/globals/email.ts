import { defineGlobal, email } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [email("field", { label: "Email Field" })],
  label: "Email Field",
  slug: "email",
});
