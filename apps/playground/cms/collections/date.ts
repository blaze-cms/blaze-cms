import { defineCollection, text, date } from "@blaze-cms/schema";

export default defineCollection({
  fields: [
    text("title", { label: "Title", validation: { required: true } }),
    date("field", { label: "Date Field" }),
  ],
  labels: { plural: "Date Fields", singular: "Date Field" },
  slug: "date",
});
