# Packages

Blazing CMS is organized as a monorepo with the following packages:

| Package | Description |
|---------|-------------|
| `@blazing-cms/cms` | Admin panel + CLI (dev, build, generate) |
| `@blazing-cms/schema` | Schema definition DSL |
| `@blazing-cms/core` | Core container, event bus, lifecycle |
| `@blazing-cms/database` | Database adapters (SQLite, Firestore) |
| `@blazing-cms/auth` | Authentication (Firebase Auth, JWT) |
| `@blazing-cms/permissions` | Role-based access control |
| `@blazing-cms/generators` | Code generation engine |
| `@blazing-cms/validation` | Zod-based schema validation |
| `@blazing-cms/storage` | File storage adapters |
| `@blazing-cms/plugins` | Plugin registry |
| `@blazing-cms/sdk` | Browser SDK for content consumption |
| `@blazing-cms/types` | Shared TypeScript types |
| `@blazing-cms/create-app` | Project scaffolding CLI |

## @blazing-cms/cms

The main package containing the admin panel UI and CLI commands.

### CLI Commands

```bash
cms dev          # Start dev server
cms build        # Build for production
cms generate     # Generate types, SDK, validation
cms lint         # Lint schema files
cms doctor       # Check project health
```

## @blazing-cms/schema

Schema definition DSL for collections, globals, and components.

```ts
import { defineCollection, text } from "@blazing-cms/schema";
```

## @blazing-cms/sdk

Browser SDK for consuming CMS content. Auto-generated from your schemas.

```ts
import { createClient } from "@blazing-cms/sdk";

const client = createClient({ apiUrl: "..." });
const posts = await client.posts.findMany();
```
