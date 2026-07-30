import { defineCollection, text, array } from "@blazing-cms/schema";

export default defineCollection({
  fields: [
    text("title"),
    array("field", {
      fields: [text("item")],
      label: "Array Field",
    }),
    text("field3"),
  ],
  labels: {
    plural: "Array Field",
    singular: "Array Field",
  },
  slug: "array",
});
