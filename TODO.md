# Blaze CMS — Firebase Firestore CMS

Replicate [arche-cms](https://github.com/Arche-CMS/arche-cms) architecture, replacing SQLite/PostgreSQL with **Firebase Firestore** as the sole database backend.

---

## Phase 1: Monorepo Foundation

- [x] Root `package.json` (pnpm workspace, scripts, deps: firebase-admin, zod)
- [x] `pnpm-workspace.yaml`
- [x] `tsconfig.base.json`
- [x] `turbo.json` (task orchestration)
- [x] `.prettierrc`
- [x] `.gitignore`
- [ ] Root `vitest.workspace.ts`
- [ ] `eslint.config.js` (flat config with typescript-eslint)
- [ ] `.nvmrc`
- [ ] `.env` (template with Firebase config placeholders)

## Phase 2: Core Packages

### `@blaze-cms/types` — Foundation Type Definitions

- [x] `src/core.ts` — Logger, Config (FirebaseConfig), EventMap, CMSContext
- [x] `src/fields.ts` — 29 field type interfaces
- [x] `src/schema.ts` — Collection/Global/Component definitions
- [x] `src/database.ts` — DatabaseAdapter interface (Firestore-compatible)
- [x] `src/plugin.ts` — PluginDefinition, PluginHooks
- [x] `src/index.ts` — Re-exports
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Basic tests

### `@blaze-cms/core` — DI, Events, Lifecycle

- [x] `src/container.ts` — DI Container (singleton/transient, child containers)
- [x] `src/event-bus.ts` — Typed EventBus with middleware chain
- [x] `src/lifecycle.ts` — State machine (init → ready → shutdown)
- [x] `src/logger.ts` — Leveled logger
- [x] `src/config.ts` — Firebase config loader (env vars + JSON credentials)
- [x] `src/index.ts`
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests (container, event-bus, lifecycle, logger, config)

### `@blaze-cms/schema` — Schema DSL & Loader

- [x] `src/fields.ts` — 29 field helper functions (text(), number(), etc.)
- [x] `src/loader.ts` — SchemaLoader (dynamic imports from `cms/` dir)
- [ ] `src/watcher.ts` — SchemaWatcher (file watching for hot-reload)
- [ ] `src/validator.ts` — Schema validation utilities
- [ ] `src/define-collection.ts` — `defineCollection()` helper
- [ ] `src/define-global.ts` — `defineGlobal()` helper
- [ ] `src/define-component.ts` — `defineComponent()` helper
- [ ] `src/index.ts`
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests (loader, watcher, validator, fields)

## Phase 3: Firebase Backend Packages

### `@blaze-cms/database` — Firestore Adapter

- [ ] `src/types.ts` — QueryOptions, DatabaseAdapter interface (already in types package)
- [ ] `src/firestore.ts` — **FirestoreAdapter**: implements DatabaseAdapter
  - `connect()` / `disconnect()` — init Firebase Admin app
  - `findOne()` — `doc(collection, id).get()`
  - `findMany()` — `collectionGroup` / `collection` queries with pagination, sorting, filtering
  - `create()` — `add()` with auto-ID or `set()` with custom ID
  - `update()` — `update()` / `set({...}, {merge: true})`
  - `delete()` — `doc(collection, id).delete()`
  - `deleteMany()` — batch deletes (max 500 per batch)
  - `transaction()` — `runTransaction()`
  - Timestamps handling (createdAt, updatedAt)
  - Subcollection support for versions/drafts
  - Compound index management
- [ ] `src/repository.ts` — Collection-scoped Repository wrapper
- [ ] `src/migration.ts` — Firestore schema migration utilities (collection creation, indexes)
- [ ] `src/migration-generator.ts` — Auto-migration from schema diffs (Firestore indexes, collection groups)
- [ ] `src/index.ts`
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests (FirestoreAdapter CRUD, queries, transactions, pagination)

### `@blaze-cms/auth` — Firebase Auth

- [ ] `src/index.ts`
- [ ] `src/service.ts` — FirebaseAuthService
  - `login()` — `signInWithEmailAndPassword` (client-side) or `verifyIdToken` (server-side)
  - `register()` — `createUser()` via Admin SDK
  - `verifyToken()` — `admin.auth().verifyIdToken()`
  - `getUser()` — `admin.auth().getUser()`
  - Custom claims for RBAC roles
- [ ] `src/middleware.ts` — Fastify middleware for Firebase Auth token verification
- [ ] `src/types.ts` — Auth-specific types
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests (token verification, user CRUD, custom claims)

### `@blaze-cms/storage` — Firebase Storage Adapter

- [ ] `src/index.ts`
- [ ] `src/types.ts` — StorageAdapter interface
- [ ] `src/firebase-storage.ts` — FirebaseStorageAdapter
  - `upload()` — `bucket.file(path).save()`
  - `download()` — `bucket.file(path).download()`
  - `delete()` — `bucket.file(path).delete()`
  - `list()` — `bucket.getFiles()`
  - Signed URL generation for public access
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

## Phase 4: Middleware Packages

### `@blaze-cms/validation` — Zod Validation Generator

- [ ] `src/index.ts`
- [ ] `src/generator.ts` — Generate Zod schemas from FieldDefinition[]
  - Map each field type to Zod schema (z.string(), z.number(), etc.)
  - Handle required/optional, min/max, pattern, unique
  - Nested fields (array, object, group, repeater, tabs, dynamicZone)
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

### `@blaze-cms/permissions` — RBAC Engine

- [ ] `src/index.ts`
- [ ] `src/types.ts` — Role, Permission, AccessControl types
- [ ] `src/access-control.ts` — AccessControl class
  - Role-based access checks
  - CRUD permissions per collection
  - Field-level permissions
  - Middleware integration
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

### `@blaze-cms/plugins` — Plugin System

- [ ] `src/index.ts`
- [ ] `src/plugin-manager.ts` — PluginManager (registry, enable/disable, hook system)
- [ ] `src/discovery.ts` — Auto-discovery from node_modules
- [ ] `src/plugins/seo/index.ts`
- [ ] `src/plugins/audit-log/index.ts`
- [ ] `src/plugins/webhooks/index.ts`
- [ ] `src/plugins/search/index.ts`
- [ ] `src/plugins/comments/index.ts`
- [ ] `src/plugins/analytics/index.ts`
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

## Phase 5: API & Code Generation

### `@blaze-cms/rest-api` — REST Route Generation

- [ ] `src/index.ts`
- [ ] `src/types.ts` — Route config types
- [ ] `src/handlers.ts` — CRUD handler factories
- [ ] `src/middleware.ts` — Common middleware (auth, validation, pagination)
- [ ] `src/route-generator.ts` — Collection/Global route generation
- [ ] `src/register.ts` — Fastify route registration
- [ ] `src/openapi.ts` — OpenAPI schema generation
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

### `@blaze-cms/graphql` — GraphQL Schema

- [ ] `src/index.ts`
- [ ] `src/types.ts` — GraphQL type mapping
- [ ] `src/type-defs.ts` — GraphQL type definitions generator
- [ ] `src/resolvers.ts` — GraphQL resolvers (backed by Firestore)
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

### `@blaze-cms/generators` — Code Generation Pipeline

- [ ] `src/index.ts`
- [ ] `src/generator.ts` — Base Generator interface
- [ ] `src/pipeline.ts` — GenerationPipeline orchestrator
- [ ] `src/typegen.ts` — TypeScript type generation
- [ ] `src/validation.ts` — Zod schema generation (wraps validation package)
- [ ] `src/api-routes.ts` — API route generation
- [ ] `src/graphql-schema.ts` — GraphQL schema generation
- [ ] `src/migrations.ts` — Migration generation
- [ ] `src/openapi.ts` — OpenAPI spec generation
- [ ] `src/admin-forms.ts` — Admin form generation
- [ ] `src/sdk.ts` — SDK generation
- [ ] `src/hooks.ts` — React hooks generation
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

### `@blaze-cms/sdk` — TypeScript Client SDK

- [ ] `src/index.ts`
- [ ] `src/types.ts` — SDK type definitions
- [ ] `src/client.ts` — Base HTTP client
- [ ] `src/client-entry.ts` — Client factory
- [ ] `src/collection.ts` — Collection CRUD methods
- [ ] `src/global.ts` — Global get/upsert
- [ ] `src/auth.ts` — Auth methods
- [ ] `src/media.ts` — Media methods
- [ ] `src/roles.ts` — Role methods
- [ ] `src/users.ts` — User methods
- [ ] `src/activity.ts` — Activity log methods
- [ ] `src/settings.ts` — Settings methods
- [ ] `src/errors.ts` — Custom error types
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

## Phase 6: CMS Server & CLI

### `@blaze-cms/cms` — CLI, Server, Admin Panel

#### CLI (bin/cms.js)

- [ ] `bin/cms.js` — CLI entry point
- [ ] `src/index.ts` — `defineConfig()`, `main()`, CLI arg parsing
- [ ] `src/commands/dev.ts` — Dev server with file watching + Vite HMR
- [ ] `src/commands/start.ts` — Production server start
- [ ] `src/commands/build.ts` — Production build
- [ ] `src/commands/migrate.ts` — Firestore index/migration management
- [ ] `src/commands/generate.ts` — Code generation
- [ ] `src/commands/typegen.ts` — Type generation alias
- [ ] `src/commands/lint.ts` — Schema linting
- [ ] `src/commands/doctor.ts` — Project health check
- [ ] `src/commands/collection.ts` — Scaffold new collection
- [ ] `src/commands/plugin.ts` — Scaffold new plugin
- [ ] `src/templates/templates.ts` — Scaffold templates

#### Server (Fastify)

- [ ] `src/server/config.ts` — ServerConfig with Firebase settings
- [ ] `src/server/app.ts` — Fastify app assembly (routes, plugins, security)
- [ ] `src/server/bootstrap.ts` — Server startup (init Firebase, load schema, start)

##### Server Plugins

- [ ] `src/server/plugins/cors.ts`
- [ ] `src/server/plugins/rate-limit.ts`
- [ ] `src/server/plugins/error-handler.ts`
- [ ] `src/server/plugins/health.ts`
- [ ] `src/server/plugins/request-logger.ts`
- [ ] `src/server/plugins/swagger.ts`
- [ ] `src/server/plugins/auth.ts` — Firebase Auth middleware
- [ ] `src/server/plugins/permissions.ts` — RBAC middleware
- [ ] `src/server/plugins/graphql.ts` — GraphQL (Mercurius)
- [ ] `src/server/plugins/static.ts` — Static file serving for admin panel

##### Server Routes

- [ ] `src/server/routes/collections.ts` — Collection CRUD (auto-generated from schema)
- [ ] `src/server/routes/users.ts` — User management
- [ ] `src/server/routes/roles.ts` — Role management
- [ ] `src/server/routes/api-tokens.ts` — API token management
- [ ] `src/server/routes/webhooks.ts` — Webhook management
- [ ] `src/server/routes/activity.ts` — Activity/audit log
- [ ] `src/server/routes/media.ts` — Media upload/download
- [ ] `src/server/routes/schemas.ts` — Schema introspection

##### Server Lib

- [ ] `src/server/lib/activity.ts` — Activity logger
- [ ] `src/server/lib/errors.ts` — Error types
- [ ] `src/server/lib/utils.ts` — Utility functions
- [ ] `src/server/lib/webhooks.ts` — Webhook dispatcher
- [ ] `src/server/schemas/shared.ts` — Shared JSON schemas
- [ ] `src/server/services/scheduled-publisher.ts` — Scheduled publishing

#### Admin Panel (React SPA)

- [ ] `src/admin/index.html` — HTML entry
- [ ] `src/admin/index.css` — Global styles (Tailwind v4)
- [ ] `src/admin/index.ts` — Entry point
- [ ] `src/admin/main.tsx` — App root with providers
- [ ] `src/admin/router.tsx` — TanStack Router tree
- [ ] `src/admin/vite.config.ts` — Vite config
- [ ] `src/admin/vite-env.d.ts` — Vite env types

##### Admin Lib

- [ ] `src/admin/lib/api.ts` — API client (Firebase REST or Fastify backend)
- [ ] `src/admin/lib/auth.tsx` — Firebase Auth client integration
- [ ] `src/admin/lib/hooks.ts` — Common hooks
- [ ] `src/admin/lib/utils.ts` — Utility functions
- [ ] `src/admin/lib/backend-mode.ts` — Backend mode detection
- [ ] `src/admin/lib/providers/context.tsx` — Provider context
- [ ] `src/admin/lib/providers/index.ts` — Provider exports
- [ ] `src/admin/lib/providers/registry.ts` — Provider registry
- [ ] `src/admin/lib/providers/rest.ts` — REST provider (Fastify backend)
- [ ] `src/admin/lib/providers/types.ts` — Provider type definitions
- [ ] `src/admin/lib/providers/firebase.ts` — **Firebase provider** (direct Firestore access from admin)

##### Admin Components

- [ ] `src/admin/components/theme-provider.tsx`
- [ ] `src/admin/components/sidebar.tsx`
- [ ] `src/admin/components/header.tsx`
- [ ] `src/admin/components/field-input.tsx` — Dynamic field renderer
- [ ] `src/admin/components/entry-actions.tsx`
- [ ] `src/admin/components/confirm-dialog.tsx`
- [ ] `src/admin/components/error-boundary.tsx`
- [ ] `src/admin/components/locale-selector.tsx`
- [ ] `src/admin/components/mode-toggle.tsx`
- [ ] `src/admin/components/offline-indicator.tsx`
- [ ] `src/admin/components/pagination.tsx`
- [ ] `src/admin/components/command-palette.tsx`
- [ ] `src/admin/components/toast-provider.tsx`
- [ ] `src/admin/components/version-history-panel.tsx`

##### Field Type Components

- [ ] `src/admin/components/field-types/index.ts`
- [ ] `src/admin/components/field-types/field-helpers.tsx`
- [ ] `src/admin/components/field-types/basic-inputs.tsx` — text, textarea, number, boolean, date, datetime, email, password, url, json
- [ ] `src/admin/components/field-types/text-inputs.tsx` — richText, markdown, code
- [ ] `src/admin/components/field-types/media-inputs.tsx` — media, upload, color
- [ ] `src/admin/components/field-types/structure-inputs.tsx` — select, multiSelect, radio, checkbox, relation, component, dynamicZone, array, object, tabs, group, repeater, slug

##### UI Components (shadcn-style)

- [ ] `src/admin/components/ui/button.tsx`
- [ ] `src/admin/components/ui/input.tsx`
- [ ] `src/admin/components/ui/select.tsx`
- [ ] `src/admin/components/ui/checkbox.tsx`
- [ ] `src/admin/components/ui/switch.tsx`
- [ ] `src/admin/components/ui/label.tsx`
- [ ] `src/admin/components/ui/badge.tsx`
- [ ] `src/admin/components/ui/card.tsx`
- [ ] `src/admin/components/ui/dialog.tsx`
- [ ] `src/admin/components/ui/alert.tsx`
- [ ] `src/admin/components/ui/skeleton.tsx`
- [ ] `src/admin/components/ui/separator.tsx`
- [ ] `src/admin/components/ui/avatar.tsx`
- [ ] `src/admin/components/ui/tabs.tsx`
- [ ] `src/admin/components/ui/tooltip.tsx`
- [ ] `src/admin/components/ui/password-input.tsx`

##### Admin Routes

- [ ] `src/admin/routes/__root.tsx` — Root layout (sidebar + header + outlet)
- [ ] `src/admin/routes/index.tsx` — Dashboard
- [ ] `src/admin/routes/login.tsx` — Firebase Auth login page
- [ ] `src/admin/routes/not-found.tsx`
- [ ] `src/admin/routes/forgot-password.tsx`
- [ ] `src/admin/routes/reset-password.tsx`
- [ ] `src/admin/routes/collections/index.tsx` — Collections list
- [ ] `src/admin/routes/collections/$slug.tsx` — Collection entries list
- [ ] `src/admin/routes/collections/new.$slug.tsx` — New entry form
- [ ] `src/admin/routes/collections/$id_.$slug.edit.tsx` — Edit entry form
- [ ] `src/admin/routes/globals/index.tsx` — Globals list
- [ ] `src/admin/routes/globals/$slug.tsx` — Global editor
- [ ] `src/admin/routes/media/index.tsx` — Media library
- [ ] `src/admin/routes/media/components/breadcrumb-nav.tsx`
- [ ] `src/admin/routes/media/components/empty-state.tsx`
- [ ] `src/admin/routes/media/components/folder-card.tsx`
- [ ] `src/admin/routes/media/components/index.ts`
- [ ] `src/admin/routes/media/components/loading-skeleton.tsx`
- [ ] `src/admin/routes/media/components/media-card.tsx`
- [ ] `src/admin/routes/media/components/media-header.tsx`
- [ ] `src/admin/routes/media/components/new-folder-input.tsx`
- [ ] `src/admin/routes/media/components/upload-overlay.tsx`
- [ ] `src/admin/routes/users/index.tsx`
- [ ] `src/admin/routes/users/new.tsx`
- [ ] `src/admin/routes/users/$id.tsx`
- [ ] `src/admin/routes/roles/index.tsx`
- [ ] `src/admin/routes/roles/new.tsx`
- [ ] `src/admin/routes/roles/$id.tsx`
- [ ] `src/admin/routes/schemas/index.tsx`
- [ ] `src/admin/routes/schemas/new.tsx`
- [ ] `src/admin/routes/schemas/$type.$slug.tsx`
- [ ] `src/admin/routes/schemas/components/field-config.ts`
- [ ] `src/admin/routes/schemas/components/field-type-picker.tsx`
- [ ] `src/admin/routes/schemas/components/index.ts`
- [ ] `src/admin/routes/schemas/components/loading-skeleton.tsx`
- [ ] `src/admin/routes/settings/index.tsx`
- [ ] `src/admin/routes/settings/api-tokens.tsx`
- [ ] `src/admin/routes/settings/plugins.tsx`
- [ ] `src/admin/routes/settings/users/index.tsx`
- [ ] `src/admin/routes/settings/users/new.tsx`
- [ ] `src/admin/routes/settings/users/$id.tsx`
- [ ] `src/admin/routes/settings/roles/index.tsx`
- [ ] `src/admin/routes/settings/roles/new.tsx`
- [ ] `src/admin/routes/settings/roles/$id.tsx`
- [ ] `src/admin/routes/settings/webhooks/index.tsx`
- [ ] `src/admin/routes/settings/webhooks/new.tsx`
- [ ] `src/admin/routes/settings/webhooks/$id.tsx`

### `@blaze-cms/create-app` — Project Scaffolding CLI

- [ ] `bin/create-blaze-cms-app.js` — CLI entry
- [ ] `src/index.ts` — Scaffold logic (template files, package.json, config)
- [ ] Templates: `explicit/`, `my-cms/`, `my-value/` scaffold directories
- [ ] `tsconfig.json`
- [ ] `vitest.config.ts`
- [ ] Tests

## Phase 7: Application

### Playground App

- [ ] `apps/playground/package.json`
- [ ] `apps/playground/blaze-cms.config.ts` — Firebase config
- [ ] `apps/playground/.env` — Firebase credentials
- [ ] `apps/playground/cms/collections/posts.ts` — Example collection
- [ ] `apps/playground/cms/collections/...` — All 29 field type examples
- [ ] `apps/playground/cms/globals/homepage.ts`
- [ ] `apps/playground/cms/globals/site-settings.ts`
- [ ] `apps/playground/cms/globals/...` — All 29 field type examples
- [ ] `apps/playground/cms/components/hero.ts`
- [ ] `apps/playground/cms/components/...` — Example components

## Phase 8: Testing & Quality

- [ ] Package tests for each package (vitest)
- [ ] Root `vitest.workspace.ts`
- [ ] E2E tests with Playwright
- [ ] TypeScript strict mode compliance
- [ ] ESLint configuration
- [ ] Lint-staged / Husky git hooks

## Phase 9: Documentation & DevOps

- [ ] `README.md` — Project overview, setup, usage
- [ ] `AGENTS.md` — AI assistant instructions
- [ ] `.github/workflows/ci.yml` — CI pipeline
- [ ] Dockerfile — Production container
- [ ] `docker-compose.yml` — Local dev setup (Firebase Emulator)

---

## Key Firestore Design Decisions

| Concern             | Decision                                                                    |
| ------------------- | --------------------------------------------------------------------------- |
| **Collections**     | Each CMS collection → Firestore top-level collection with auto-ID           |
| **Globals**         | Single-document collections (e.g. `globals_homepage`)                       |
| **Versions/Drafts** | Subcollection under each document: `{collection}/{id}/versions/{versionId}` |
| **Relations**       | Store as document references (`doc(path)`) or string IDs                    |
| **Indexes**         | Composite indexes defined in `firestore.indexes.json`                       |
| **Auth**            | Firebase Auth Admin SDK for server-side verification                        |
| **Storage**         | Firebase Storage for media files                                            |
| **Queries**         | Compound queries with `where`, `orderBy`, `limit`, `offset` (via cursors)   |
| **Transactions**    | Firestore `runTransaction` for atomic operations                            |
| **Batch writes**    | Firestore `writeBatch` for bulk operations (max 500)                        |
| **Pagination**      | Cursor-based pagination with `startAfter`/`endBefore`                       |
| **Timestamps**      | Automatic `createdAt`/`updatedAt` via Firestore `serverTimestamp`           |
| **Admin panel**     | Can use Firebase client SDK directly (real-time updates) or via Fastify API |
| **Local dev**       | Firebase Emulator Suite (`firebase emulators:start`)                        |
