import { defineGlobal, text, boolean, relation } from "@blaze-cms/schema";

export default defineGlobal({
  admin: { group: "Content" },
  fields: [
    text("heroTitle", { label: "Hero Title" }),
    text("heroSubtitle", { label: "Hero Subtitle" }),
    boolean("showFeaturedPosts", { defaultValue: true, label: "Show Featured Posts" }),
    relation("featuredPost", { kind: "oneToOne", label: "Featured Post", to: "posts" }),
  ],
  label: "Homepage",
  slug: "homepage",
});
