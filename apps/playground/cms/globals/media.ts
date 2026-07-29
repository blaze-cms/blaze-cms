import { defineGlobal, media } from "@blaze-cms/schema";

export default defineGlobal({
  fields: [media("field", { label: "Media Field" })],
  label: "Media Field",
  slug: "media-settings",
});
