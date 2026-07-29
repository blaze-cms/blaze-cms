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
    config.ts        # CMS config
  src/
    admin/           # Admin panel (auto-generated)
```

## Define Your First Collection

Create `cms/collections/posts.ts`:

```ts
import { defineCollection, text, slug, richText, status } from "@blazing-cms/schema";

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
    status(),
  ],
});
```

## Start the Dev Server

```bash
pnpm dev
```

This starts the CMS dev server with:
- Admin panel at `http://localhost:5173/admin`
- Auto-generated REST API
- Auto-sync to Firestore (when configured)
