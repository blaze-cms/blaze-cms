# Blazing CMS

**Schema-defined CMS for Firebase.** Define your content models in TypeScript — get a full admin panel, REST API, GraphQL API, typed SDK, and Firestore sync, all generated automatically.

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
- **Auto-generated APIs** — REST, GraphQL, OpenAPI docs
- **Typed SDK** — browser SDK with full TypeScript inference from your schemas
- **Firebase backend** — Firestore storage, Firebase Auth, auto-sync to security rules
- **Plugin system** — extend with custom plugins

## Quick Start

```bash
pnpm create @blazing-cms/app my-cms
cd my-cms
pnpm dev
```

---

Ready to dive in? Head to the [Getting Started](/guide/getting-started) guide.
