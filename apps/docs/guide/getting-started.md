# Getting Started

## Prerequisites

- Node.js >= 22
- pnpm >= 11

## Create a Project

```bash
pnpm create @blazing-cms/app my-cms
cd my-cms
```

If you're starting from the monorepo itself, the playground app serves as a reference:

```bash
cd apps/playground
pnpm dev
```

## Project Structure

```
my-cms/
  cms/
    collections/     # Collection schema files
    globals/         # Global schema files
    components/      # Component schema files
  blazing-cms.config.ts   # Firebase project config
  .env                     # Firebase credentials
```

## Define Your First Collection

Create `cms/collections/posts.ts`:

```ts
import { defineCollection, text, slug, richText } from "@blazing-cms/schema";

export const posts = defineCollection({
  slug: "posts",
  label: "Posts",
  admin: {
    group: "Content",
    useAsTitle: "title",
  },
  fields: [
    text("title", { required: true }),
    slug("slug", { sourceField: "title" }),
    richText("content"),
  ],
});
```

## Start the Dev Server

```bash
pnpm dev
```

This starts the CMS dev server with:
- Admin panel at `http://localhost:5173/`
- Auto-generated types, SDK, and validation on every startup
- Auto-sync to Firestore (when configured)
