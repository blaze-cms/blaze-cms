# Blazing CMS

**Schema-defined CMS for Firebase.** Define your content models in TypeScript — get a full admin panel, REST API, GraphQL API, typed SDK, Zod validation, and Firestore sync, all generated automatically.

```ts
// cms/collections/posts.ts
import { defineCollection } from '@blazing-cms/schema'

export const posts = defineCollection({
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
  ],
})
```

## Features

- **Schema-as-source-of-truth** — collections, globals, and components defined in TypeScript
- **Auto-generated admin panel** — full CRUD UI with rich text, code, and markdown editors
- **Auto-generated APIs** — REST, GraphQL, OpenAPI docs
- **Typed SDK** — browser SDK with full TypeScript inference from your schemas
- **Zod validation** — runtime validation generated from schemas
- **Firebase backend** — Firestore storage, Firebase Auth, auto-sync from schema to Firestore security rules
- **Plugin system** — extend with custom plugins
- **Media upload** — built-in media library
- **Command palette** — quick navigation across all content

## Packages

| Package | Description |
|---------|-------------|
| `@blazing-cms/cms` | Admin panel + CLI (dev, build, generate) |
| `@blazing-cms/schema` | Schema definition DSL (defineCollection, defineGlobal, defineComponent) |
| `@blazing-cms/core` | Core container, event bus, lifecycle hooks |
| `@blazing-cms/database` | Database adapters (SQLite, Drizzle ORM) |
| `@blazing-cms/auth` | Authentication (Firebase Auth, JWT, API keys) |
| `@blazing-cms/permissions` | Role-based access control |
| `@blazing-cms/generators` | Code generation (types, SDK, OpenAPI, Zod, GraphQL, admin forms) |
| `@blazing-cms/validation` | Zod-based validation generated from schemas |
| `@blazing-cms/storage` | File storage (local, Firebase, S3) |
| `@blazing-cms/plugins` | Plugin registry and hooks |
| `@blazing-cms/sdk` | Browser SDK for typed content consumption |
| `@blazing-cms/types` | Shared TypeScript types |
| `@blazing-cms/create-app` | Project scaffolding CLI |

## Getting Started

```bash
pnpm create @blazing-cms/app my-cms
cd my-cms
pnpm dev
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server with playground
pnpm dev:playground

# Run tests
pnpm test
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Code quality
pnpm fallow
pnpm knip
```

## License

MIT
