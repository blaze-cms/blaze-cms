# Blaze CMS — TODO

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
