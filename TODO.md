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
