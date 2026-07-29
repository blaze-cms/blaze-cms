# Blaze CMS — TODO

## Done

- [x] Schema sync: Firestore writer (`_schemas/collections/{slug}` etc.)
- [x] `generate --sync` flag
- [x] `dev --sync` flag
- [x] Firebase provider reads from `_schemas`
- [x] Auth guard on `_schemas` writes (admin claim)
- [x] Per-collection security rules
- [x] Sync-schemas button on Schemas page (admin UI, dev mode only, Firebase backend)
- [x] Sync flow documented in CLI help text
- [x] Dynamic collection/global listing in sidebar (reads from generated schema registry)
- [x] New schema wizard (type/slug form, generates code, copies to clipboard)
- [x] Lazy import `firebase-admin` — only loaded when `--sync` is used
