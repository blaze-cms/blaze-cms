import { describe, it, expect } from "vitest";
import { defineCollection } from "../define-collection.js";
import { defineGlobal } from "../define-global.js";
import { defineComponent } from "../define-component.js";
import { text, number, boolean } from "../fields.js";

describe("defineCollection", () => {
  it("returns a CollectionDefinition with all fields", () => {
    const c = defineCollection({
      slug: "posts",
      labels: { singular: "Post", plural: "Posts" },
      fields: [
        text("title", { label: "Title", validation: { required: true } }),
        number("views", { defaultValue: 0 }),
      ],
      timestamps: { createdAt: true, updatedAt: true },
      auth: true,
      admin: { useAsTitle: "title", group: "Content" },
    });

    expect(c.slug).toBe("posts");
    expect(c.labels.singular).toBe("Post");
    expect(c.labels.plural).toBe("Posts");
    expect(c.fields).toHaveLength(2);
    expect(c.fields[0].name).toBe("title");
    expect(c.fields[1].name).toBe("views");
    expect(c.timestamps).toEqual({ createdAt: true, updatedAt: true });
    expect(c.auth).toBe(true);
    expect(c.admin?.useAsTitle).toBe("title");
  });

  it("works with minimal config", () => {
    const c = defineCollection({
      slug: "tags",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [],
    });
    expect(c.slug).toBe("tags");
    expect(c.fields).toEqual([]);
  });
});

describe("defineGlobal", () => {
  it("returns a GlobalDefinition", () => {
    const g = defineGlobal({
      slug: "homepage",
      label: "Homepage",
      fields: [text("title"), boolean("showCta")],
      admin: { group: "Content" },
    });

    expect(g.slug).toBe("homepage");
    expect(g.label).toBe("Homepage");
    expect(g.fields).toHaveLength(2);
    expect(g.admin?.group).toBe("Content");
  });

  it("works without admin config", () => {
    const g = defineGlobal({
      slug: "settings",
      label: "Settings",
      fields: [],
    });
    expect(g.admin).toBeUndefined();
  });
});

describe("defineComponent", () => {
  it("returns a ComponentDefinition", () => {
    const c = defineComponent({
      slug: "hero",
      label: "Hero Block",
      fields: [text("heading", { validation: { required: true } })],
    });

    expect(c.slug).toBe("hero");
    expect(c.label).toBe("Hero Block");
    expect(c.fields).toHaveLength(1);
    expect(c.fields[0].name).toBe("heading");
  });
});
