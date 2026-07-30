# Blazing CMS

**Schema-defined CMS for Firebase.** Define your content models in TypeScript — get a full admin panel, typed SDK, and Firestore sync, all generated automatically.

```ts
import { defineCollection, text, slug, richText } from "@blazing-cms/schema";

export const posts = defineCollection({
  slug: "posts",
  fields: [
    text("title", { required: true }),
    slug("slug", { sourceField: "title" }),
    richText("body"),
  ],
});
```

## Why Blazing CMS?

- **Schema-as-source-of-truth** — collections, globals, and components defined in TypeScript
- **Auto-generated admin panel** — full CRUD with rich text, code, and markdown editors
- **Auto-generated client SDK** — typed browser SDK for content consumption
- **Firebase backend** — Firestore storage, Firebase Auth, generated security rules
- **Plugin system** — extend with custom plugins

## Quick Start

```bash
pnpm create @blazing-cms/app my-cms
cd my-cms
pnpm dev
```

---

Ready to dive in? Head to the [Getting Started](/guide/getting-started) guide.
