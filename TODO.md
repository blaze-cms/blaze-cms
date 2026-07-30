# Blazing CMS — TODO

## Current Milestone: Admin UI Polish

### Done

- [x] **Login actually works** — calls `login()` from `useAuth`, shows error toasts, redirects if already authenticated
- [x] **Sign-out button wired** — calls `logout()` from `useAuth` on click
- [x] **Route auth guard** — AppLayout redirects to `/login` if unauthenticated, shows loading state
- [x] **Hardcoded data replaced** — users/roles pages use `useQuery` with `provider.findMany("users")` / `provider.findMany("roles")`
- [x] **All Create buttons wired** — users/new, roles/new call `provider.create()`
- [x] **All Save buttons wired** — users/$id, roles/$id call `provider.update()`, globals/$slug calls `provider.upsertGlobal()`
- [x] **Delete buttons wired** — users/$id has confirmation dialog before deleting
- [x] **Schema-aware entry forms** — `collections/new.$slug.tsx`, `collections/$slug.$id.edit.tsx`, `globals/$slug.tsx` render all fields from schema definitions using `FieldInput`
- [x] **Duplicate routes removed** — `/settings/users`, `/settings/roles`, `/settings/webhooks` deleted, router and settings index updated
- [x] **Collection entries use `admin.useAsTitle`** — reads the configured title field from schema
- [x] **Rich text / markdown / code editors** — Tiptap for rich text (toolbar with bold/italic/headings/lists/code blocks), CodeMirror for code (syntax highlighting per language), Markdown preview toggle
- [x] **Component and Dynamic Zone field rendering** — resolve sub-fields from schema registry
- [x] **Error boundary on routes** — wraps `RouterProvider` in main.tsx
- [x] **Media upload functional** — file dialog, upload button, grid view with loading/empty states
- [x] **Unused components cleanup** — removed 6 orphaned components
- [x] **Collapsed sidebar tooltips** — `title` attribute on icon-only items
- [x] **Dynamic command palette** — includes collections/globals from schema registry
- [x] **React Query Devtools** — added in dev mode
- [x] **HTML metadata** — favicon, theme-color, description
- [x] **Use `admin.group` for sidebar grouping** — separate nav sections for grouped items
- [x] **Fix generated type names** — `ArrayEntry`, `BooleanEntry`, etc. to avoid global shadowing
- [x] **Schema editor** — editable fields, metadata, and live generated code preview

## Next Milestone: Schema Writer — Save button writes schema files to disk

### Pending

- [ ] **Add Vite plugin `schema-writer.ts`** — `packages/cms/src/admin/vite-plugins/schema-writer.ts` with `configureServer` middleware at `/__dev-api/save-schema`. Accepts POST `{ filename, content }`, validates path is within the user's `cms/` directory, writes file via `fs.writeFileSync`.
- [ ] **Register plugin in `vite.config.ts`** — Import and append `schemaWriterPlugin()` to the plugins array in `packages/cms/src/admin/vite.config.ts`.
- [ ] **Add "Save" button to schema detail page** — In `packages/cms/src/admin/routes/schemas/$type.$slug.tsx`, add a "Save Schema" button next to "Copy Code". POSTs the generated `defineCollection`/`defineGlobal`/`defineComponent` code to `/__dev-api/save-schema` with the correct filename (e.g. `cms/collections/posts.ts`). Show success/error toast. Only render in dev mode.

### All Done ✨

- [x] **API tokens page** — create, view (with visibility toggle), revoke, delete tokens; token generation with `crypto.getRandomValues`; modal for creation with copy-once flow
- [x] **Plugins page** — searchable directory of known plugins, SDK overview card, status badges (built-in/available/coming-soon)
- [x] **Vite build optimizations** — `manualChunks` splitting into react-vendor, router, firebase, editor-rich (Tiptap), editor-code (CodeMirror), editor-markdown, icons, and vendor chunks; `optimizeDeps` includes for all editor libs

### Pending

- [x] **Set up OpenSpec** — installed `@fission-ai/openspec@1.7.0`, ran `openspec init --tools opencode`, configured project context in `openspec/config.yaml`
- [x] **Create initial specs** — wrote main specs for auth, schema, content, and plugins capabilities
- [ ] **Use `/opsx-propose` for next feature** — try the spec‑driven workflow on the next change

## Test Coverage

### Done

- [x] **core package** — config.ts, event-bus.ts, lifecycle.ts, logger.ts, container.ts all at 100/100/100/100
- [x] **database/firestore.ts** — 100/95.45/100/100 (4 mock‑setup branches remaining that need beforeEach restructure)
- [x] **permissions/access-control.ts** — 100/100/100/100
- [x] **plugins package** — discovery.ts 100/92.3/100/100 (line 29 `?? null` coverage tool quirk), plugin-manager.ts 100/100/100/100
- [x] **schema package** — loader.ts, validator.ts, define-collection.ts, define-global.ts, define-component.ts, index.ts all 100/100/100/100; fields.ts 99.25/100/79.31/99.25 (type‑only function quirk), watcher.ts 97.05/100/100/97.05 (catch‑block quirk)
- [x] **sdk package** — auth.ts, client.ts, collection.ts, errors.ts, global.ts all 100/100/100/100
- [x] **storage/firebase-storage.ts** — 100/100/100/100
- [x] **validation/generator.ts** — 100/100/100/100
- [x] **generators package** — pipeline.ts, sdk.ts, typegen.ts, validation.ts all 100/100/100/100
- [x] **auth package** — middleware.ts, service.ts all 100/100/100/100
- [x] **cms package** — 6 test files, 48 tests written: index.ts, generate.ts, lint.ts, scaffold.ts, doctor.ts, prompt.ts all 100/100/100/100

## Previous Work (Done)

- [x] Schema sync: Firestore writer
- [x] `generate --sync` / `dev --sync` flags
- [x] Firebase provider reads from `_schemas`
- [x] Auth guard on `_schemas` writes
- [x] Per-collection security rules
- [x] Sync-schemas button on Schemas page
- [x] Sync flow documented in CLI help text
- [x] Dynamic collection/global listing in sidebar
- [x] New schema wizard
- [x] Lazy import `firebase-admin`

## Architecture Alignment: Client-side + Firestore-only

### High Priority — Violates client-side-only or Firestore-only goal

- [ ] **Audit `firebase-admin` usage across packages** — `packages/database/`, `packages/storage/`, `packages/auth/` each depend on `firebase-admin` (Node.js server-only SDK). Decide: (a) relegate to CLI-only packages that never run in the browser, or (b) replace with Firebase client SDK equivalents. The admin panel already uses client SDK via `packages/cms/src/admin/lib/providers/firebase.ts`, so the server-side adapters are only needed by CLI commands (`generate`, `sync`, `deploy`).

- [ ] **Rewrite SDK generator to emit Firestore client calls** — `packages/generators/src/sdk.ts` generates `createClient({ baseUrl: "/api" })` and `api.findMany()`, `api.findOne()`, etc., assuming a REST API that doesn't exist. Should generate code directly calling `getFirestore()` / `collection()` / `getDocs()` etc. from the Firebase client SDK, or call the existing `@blazing-cms/sdk` package's DataProvider-style methods.

- [ ] **Remove `"server"` from admin panel backend modes** — Three files reference `"server"` as a valid backend mode:
  - `packages/cms/src/admin/lib/backend-mode.ts:1` — `BackendMode` type includes `"server"`
  - `packages/cms/src/admin/lib/providers/types.ts:17` — `DataProvider.type` includes `"server"`
  - `packages/cms/src/admin/lib/providers/registry.ts:19` — throws `"Server mode provider not implemented yet"`
    Remove the `"server"` variant from all three; only `"firebase"` and `"mock"` should remain.

- [ ] **Remove server-oriented fields from `Config` type** — `packages/types/src/core.ts:24-25` — Config has `port: number` and `host: string` (server config that doesn't apply to client-only). Line 51-52: EventMap has `"server:start"` and `"server:stop"` events. Line 53: `"migration:run"` (non-Firestore DB concept). Remove or flag these as CLI-only.

- [ ] **Remove HTTP server hooks from `PluginHooks` type** — `packages/types/src/plugin.ts:13-16` — Has `beforeRequest`, `afterRequest`, `beforeRouteRegister(fastify)`, `afterRouteRegister(fastify)` — all HTTP server lifecycle hooks that don't exist in a client-only SPA. Remove or clearly document as a future extension point that would require server infrastructure.

- [ ] **Remove server-oriented config loading from `packages/core/src/config.ts`** — Lines 26-28 load `AUTH_EXPIRES_IN`, `AUTH_SECRET` from env. Lines 40-47 load `HOST`, `PORT`, `STORAGE_ADAPTER`, `STORAGE_BASE_DIR`, `STORAGE_BUCKET`. These are server-config values; confirm they're only used by CLI (which is acceptable) or remove them.

- [ ] **Clean up `.env` server variables** — Root `.env` contains `PORT=3000`, `HOST=0.0.0.0`, `AUTH_SECRET=change-me-in-production`, `AUTH_EXPIRES_IN=7d`, `STORAGE_ADAPTER=firebase`. Remove or move to CLI-only env file if not needed by the admin SPA.

- [ ] **Fix README.md claims** — Line 3 claims "REST API, GraphQL API" — neither exist. Line 23: "Auto-generated APIs — REST, GraphQL, OpenAPI docs" — none exist. Line 38: "Database adapters (SQLite, Drizzle ORM)" — only Firestore exists. Line 39: "Authentication (Firebase Auth, JWT, API keys)" — only Firebase Auth exists. Line 41: "Code generation (types, SDK, OpenAPI, Zod, GraphQL, admin forms)" — only types, SDK, Zod exist. Line 43: "File storage (local, Firebase, S3)" — only Firebase Storage exists. Update all to match the actual client-only + Firestore-only architecture.

- [ ] **Fix `apps/docs/index.md` claims** — Same false claims as README: "REST API, GraphQL API" (line 3, 22). Match actual architecture.

- [ ] **Fix `apps/docs/reference/packages.md` claims** — Line 10: "Database adapters (SQLite, Firestore)" — only Firestore exists. Line 11: "Authentication (Firebase Auth, JWT)" — only Firebase Auth. Fix package descriptions.

- [ ] **Fix `apps/docs/reference/cli.md` claims** — Line 37 lists `--openapi` and `--graphql` flags that don't exist in `packages/cms/src/commands/generate.ts`. Lines 58-64 document a `cms sync` command that doesn't exist. Remove these.

- [ ] **Remove dead `.fallowrc.json` references to deleted server files** — `.fallowrc.json` references 14+ files from a prior Fastify/Express server architecture that no longer exist: `packages/cms/src/commands/start.ts`, `packages/cms/src/server/**`, `packages/generators/src/openapi.ts`, `packages/generators/src/graphql-schema.ts`, `packages/generators/src/hooks.ts`, `packages/generators/src/admin-forms.ts`, server route files, auth plugin. Remove these references (they cause spurious "no issues" results and mislead future audits).

- [ ] **Fix or remove `scripts/e2e-server.sh`** — Line 15 calls `node "$ROOT/scripts/serve-spa.mjs"` but that file does not exist. Either create a simple static SPA server (Node http server for the built admin) or remove the script.

- [ ] **Remove `"server"` from CLI help text** — `packages/cms/src/index.ts:44` — `VITE_BACKEND_MODE (firebase|mock|server)` still lists `server`. Update to `(firebase|mock)`.

### Medium Priority — Needs clarification / discussion

- [ ] **Clarify `packages/auth/src/middleware.ts` purpose** — `createAuthMiddleware` verifies Firebase ID tokens via the server-side `FirebaseAuthService`. Confirm this is only used by CLI commands (generate, sync, etc.) and not expected to run in the browser. If CLI-only, document that; if not, replace with client-side `onAuthStateChanged` pattern.

- [ ] **Simplify `DatabaseAdapter` interface** — `packages/types/src/database.ts` defines `QueryOptions` with `offset`, `select`, `populate`, and `transaction` — features not leveraged by the current `FirestoreAdapter` or used in practice. The admin panel uses `DataProvider` (a different interface) not `DatabaseAdapter`. Reduce to only what's needed (`where`, `limit`, `sort`, `cursor`) or consolidate with `DataProvider`.

- [ ] **Assess `FirestoreRepository` value** — `packages/database/src/repository.ts` wraps `DatabaseAdapter` adding a collection-scoped convenience layer. The admin panel doesn't use it (uses `DataProvider`). If `DatabaseAdapter` is CLI-only, this may be fine. If it's meant for client use, it should be replaced or use client SDK.

- [ ] **Verify `deploy` command scope** — `packages/cms/src/commands/deploy.ts` runs `firebase deploy --only hosting`. Valid for static SPA deployment to Firebase Hosting. No change needed, but confirm the docs clearly state it's deploying a static SPA, not a server.

- [ ] **Audit remaining `.fallowrc.json` ignore entries** — After removing deleted-file references, review remaining ignores (e.g., `packages/generators/src/sdk.ts` threshold override references field mapping that may no longer match the simplified Firestore-direct SDK generator).

- [ ] **Remove `packages/cms/src/admin/lib/providers/types.ts` DataProvider comment about server** — Verify no other code references the `"server"` type before removing.
