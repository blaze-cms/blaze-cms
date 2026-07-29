# Blaze CMS — Firebase Firestore CMS

A CMS that stores all data in **Firebase Firestore**. The admin panel is a React SPA using the **Firebase client SDK** directly — no backend server. Deployed to **Firebase Hosting**.

**v1 target:** Code-first schema definition → build-time code generation → admin panel + published SDK.

---

## Phase 1: Monorepo Foundation — ✅ Complete

- [x] Root `package.json` (pnpm workspace, scripts)
- [x] `pnpm-workspace.yaml`
- [x] `tsconfig.base.json`
- [x] `turbo.json`
- [x] `.prettierrc`
- [x] `.gitignore`
- [x] `vitest.workspace.ts`
- [x] `eslint.config.js`
- [x] `.nvmrc`
- [x] `.env` template

## Phase 2: Core Packages — v1

### `@blaze-cms/types` — Foundation Types — ✅ Source Complete

- [x] `src/core.ts` — Config, EventMap, CMSContext
- [x] `src/fields.ts` — 29 field type interfaces
- [x] `src/schema.ts` — Collection/Global/Component definitions
- [x] `src/database.ts` — DatabaseAdapter interface (for SDK compat)
- [x] `src/plugin.ts` — PluginDefinition, PluginHooks
- [x] `src/index.ts`
- [x] `tsconfig.json`
- [ ] **Tests**

### `@blaze-cms/schema` — Schema DSL — ✅ Source Complete

- [x] `src/fields.ts` — 29 field helper functions (`text()`, `number()`, etc.)
- [x] `src/loader.ts` — SchemaLoader (discovers `cms/` dir)
- [x] `src/watcher.ts` — Dev-only file watcher for hot-reload
- [x] `src/validator.ts` — Schema validation
- [x] `src/define-collection.ts` — `defineCollection()`
- [x] `src/define-global.ts` — `defineGlobal()`
- [x] `src/define-component.ts` — `defineComponent()`
- [x] `src/index.ts`
- [x] `tsconfig.json`
- [ ] **Tests**

### `@blaze-cms/validation` — Zod Forms — ✅ Source Complete

- [x] `src/index.ts`
- [x] `src/generator.ts` — Zod schemas from `FieldDefinition[]`
- [x] `tsconfig.json`
- [ ] **Tests**

### `@blaze-cms/permissions` — RBAC Engine — ✅ Source Complete

- [x] `src/index.ts`
- [x] `src/types.ts` — Role, Permission, AccessControl types
- [x] `src/access-control.ts` — Field-level CRUD per collection
- [x] `tsconfig.json`
- [ ] **Tests**

## Phase 3: Code Generation

### `@blaze-cms/generators` — Code Gen Pipeline — 🟡 Source Complete

- [x] `src/index.ts`
- [x] `src/generator.ts` — Base interface
- [x] `src/pipeline.ts` — Orchestrator (schema → output)
- [x] `src/typegen.ts` — TypeScript type generation from schemas
- [x] `src/validation.ts` — Zod schema generation
- [x] `src/sdk.ts` — SDK code generation
- [x] `tsconfig.json`
- [x] Inline in CLI: `schema-registry`, `firestore-rules`, `firestore-indexes` generation
- [ ] **Tests**

**Flow:** `blaze generate` produces:
- `src/admin/__generated__/schema-registry.ts` → imported by admin panel at build time
- `firestore.indexes.json` + `firestore.rules` in project root

### `@blaze-cms/sdk` — Browser Client SDK — ✅ Complete

A thin typed wrapper around Firebase client SDK for consuming content from external frontends.

```
npm install @blaze-cms/sdk firebase
```

```ts
import { createBlazeClient } from "@blaze-cms/sdk";
const blaze = createBlazeClient(firebaseConfig);

const posts = await blaze.collection("posts").findMany({
  filters: [{ field: "status", op: "==", value: "published" }],
  orderBy: { field: "createdAt", direction: "desc" },
});
```

- [x] `src/index.ts` — Re-exports all APIs
- [x] `src/client.ts` — `createBlazeClient()` factory
- [x] `src/types.ts` — `BlazeClientConfig`, `CollectionApi`, `GlobalApi`, `AuthApi`, `QueryOptions`
- [x] `src/collection.ts` — `findMany`, `findById`, `create`, `update`, `delete`
- [x] `src/global.ts` — `get()`, `upsert()`
- [x] `src/auth.ts` — Firebase Auth wrapper
- [x] `src/errors.ts` — `BlazeError`, `NotFoundError`, `ValidationError`
- [x] Package configured with `firebase` as peer dependency

> **Firebase security rules** enforce read/write access — no API tokens needed. The SDK uses the Firebase client SDK under the hood.

## Phase 4: CLI + Admin Panel

### `@blaze-cms/cms` — CLI + Admin Panel

#### CLI — ✅ Complete (v1)

The CLI is a build-time and dev-time tool. No server runtime.

- [x] `bin/cms.js` — CLI binary entry
- [x] `src/index.ts` — `defineConfig()`, `main()`, arg parsing (7 commands)
- [x] `src/commands/dev.ts` — **Dev** (Vite dev server + optional Firebase Emulator)
- [x] `src/commands/build.ts` — **Build** (generate + Vite build → `dist/admin/`)
- [x] `src/commands/generate.ts` — **Generate** (types, validation, SDK, registry, rules, indexes)
- [x] `src/commands/deploy.ts` — **Deploy** (`firebase deploy --only hosting`)
- [x] `src/commands/scaffold.ts` — **Scaffold** (new collection/global)
- [x] `src/commands/doctor.ts` — Project health check
- [x] `src/commands/lint.ts` — Schema linting
- [x] **Tests**

#### Admin Panel (React SPA) — ✅ Built

Vite build passes (~920KB JS, ~275KB gzipped). TypeScript check clean.

- [x] Entry files: `index.html`, `index.css`, `main.tsx`, `vite.config.ts`, `vite-env.d.ts`
- [x] `router.tsx` — 31 routes under `rootRoute` → `appLayoutRoute`
- [x] **Admin lib:** `auth.tsx`, `hooks.ts`, `utils.ts`, `backend-mode.ts`, providers
- [x] **UI components:** 16 shadcn-style components (button, input, select, switch, dialog, etc.)
- [x] **App components:** theme-provider, sidebar, header, toast, command-palette, pagination, etc.
- [x] **Field types:** 29 field type renderers across 6 files
- [x] **Routes:** dashboard, login, forgot/reset password, collections CRUD, globals, media (9 components), users CRUD, roles CRUD, schemas list + detail, settings + sub-routes

##### Dev-only Schema Builder — ✅ Complete

- [x] `isDevMode()` exported from `backend-mode.ts` (`import.meta.env.DEV`)
- [x] Schema builder routes guarded with `import.meta.env.PROD` → "Not available in production" notice
- [x] Sidebar conditionally shows "Schemas" link only in dev mode
- [x] Routes always registered, components tree-shaken in production build

#### Admin Panel v1 gaps — ✅ Complete

- [x] Firebase Auth provider wired (login page authenticates via `signInWithEmailAndPassword`)
- [x] Collections list reads from generated `schema-registry.ts`
- [x] Collection entries use `useDataProvider()` → Firestore queries via `firebaseProvider`
- [x] New/edit entry forms use provider `create()`/`update()` and `@tanstack/react-query`
- [x] Schema registry imported from `@/__generated__/schema-registry`
- [x] Stub registry created so Vite builds without running `blaze generate` first
- [x] `QueryClientProvider` wrapping entire app

### `@blaze-cms/create-app` — Scaffolding CLI — ✅ Complete

`npx create-blaze-cms-app my-cms` bootstraps a new project with Firebase config, example collections/globals, build/dev/deploy scripts.

- [x] `bin/create-blaze-cms-app.js`
- [x] `src/index.ts` — Scaffold logic (creates dirs, writes configs, example schemas)
- [x] Templates: `package.json`, `tsconfig.json`, `blaze-cms.config.ts`, `.env`, `.gitignore`, example `posts` collection + `site-settings` global

## Phase 5: Playground App — 🟡 Partially Complete

- [x] `apps/playground/package.json`, `blaze-cms.config.ts`, `.env`
- [x] Example: `cms/collections/posts.ts`
- [x] Example: `cms/globals/homepage.ts`, `cms/globals/site-settings.ts`
- [ ] Example collections covering all 29 field types
- [ ] Example globals
- [ ] Example components

## Phase 6: Testing & Quality — 🔴 Mostly Missing

- [ ] Package tests for v1 packages (vitest)
- [x] Root `vitest.workspace.ts`
- [ ] TypeScript strict mode compliance
- [x] ESLint config
- [x] lint-staged / husky

## Phase 7: Documentation & DevOps — 🔴 Missing

- [ ] `README.md` — Project overview, setup, usage
- [ ] `AGENTS.md` — AI assistant instructions
- [ ] `.github/workflows/ci.yml`
- [ ] `firebase.json` — Hosting config (rewrites → `index.html`)
- [ ] `.firebaserc` — Project aliases
- [ ] Firestore indexes + security rules template

---

## Deprioritized (code exists, not in v1 plan)

These packages are source-complete but are **server-oriented abstractions** not needed for the client-only v1:

| Package | Reason |
|---------|--------|
| `@blaze-cms/core` | DI container, EventBus, lifecycle — server plugin architecture |
| `@blaze-cms/database` | FirestoreAdapter + Repository — Node.js Firestore abstraction |
| `@blaze-cms/auth` | Firebase Auth service + Fastify middleware — server-side auth |
| `@blaze-cms/storage` | Firebase Storage adapter — server file operations |
| `@blaze-cms/plugins` | Plugin system + built-in plugins — server hook system |

## Key Design Decisions

| Concern | Decision |
|---------|----------|
| **Collections** | Each CMS collection → Firestore top-level collection, auto-ID |
| **Globals** | Single-document collections (`globals_<slug>`) |
| **Versions/Drafts** | Subcollection: `{collection}/{id}/versions/{versionId}` |
| **Relations** | Store as document references or string IDs |
| **Auth** | Firebase Auth client SDK in admin panel; security rules enforce access |
| **Storage** | Firebase Storage client SDK for media uploads |
| **Admin panel** | React SPA, Firebase client SDK directly, no backend |
| **Schema definition** | Code-first (TypeScript in `cms/` dir), build-time gen creates registry |
| **Schema builder** | Dev-only admin UI, hidden in production (import.meta.env.DEV guard) |
| **SDK** | Browser-only, wraps Firebase client SDK, consumes published content |
| **Pagination** | Cursor-based with `startAfter`/`endBefore` |
| **Timestamps** | Automatic `createdAt`/`updatedAt` via `serverTimestamp` |
| **Local dev** | Firebase Emulator Suite + Vite dev server |
| **Deployment** | `blaze build && blaze deploy` → Firebase Hosting |
