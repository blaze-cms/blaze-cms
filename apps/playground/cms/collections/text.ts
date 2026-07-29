import { defineCollection, text } from "@blaze-cms/schema";

export default defineCollection({
  fields: [
    text("title", { label: "Title", validation: { required: true } }),
    text("field", { label: "Text Field" }),
  ],
  labels: { plural: "Text Fields", singular: "Text Field" },
  slug: "text",
});
