## 1. Media Library

- [x] 1.1 Define Firestore `media` collection schema and indexes in types package
- [x] 1.2 Configure Firebase Storage bucket rules and upload presets
- [x] 1.3 Implement media upload via Firebase Storage client SDK (`uploadBytesResumable` + `getDownloadURL`)
- [x] 1.4 Implement media CRUD operations via Firestore client SDK directly
- [x] 1.5 Add folder/tag organization (folders as Firestore documents, tags as array fields)
- [x] 1.6 Implement media search via Firestore client-side queries (filename, tag, caption)
- [x] 1.7 Implement media usage tracking (find references across collections via client query)
- [x] 1.8 Build admin UI: media library page with grid/list view, upload dropzone
- [x] 1.9 Build admin UI: media detail page with preview, metadata, usage, replace
- [x] 1.10 Build admin UI: folder tree navigation and tag management
- [x] 1.11 Build admin UI: media picker component for rich text / field inputs
- [x] 1.12 Add SDK methods for media operations
- [x] 1.13 Write tests for media operations

## 2. Role-Based Access Control

- [x] 2.1 Define RBAC data models: `roles`, `user_roles` collections, permission schema in types
- [x] 2.2 Implement role CRUD via Firestore client SDK
- [x] 2.3 Implement user-role assignment via Firestore client SDK
- [x] 2.4 Implement permission cache in React context (refreshed on auth state change)
- [x] 2.5 Apply permission checks via Firestore Security Rules (definitive enforcement)
- [x] 2.6 Add UI-side permission enforcement (hide/disable elements based on cached permissions)
- [x] 2.7 Add field-level permission support (read-only or hidden per field group)
- [x] 2.8 Implement deny logging — client-side reporting to Firestore `access_logs` collection
- [x] 2.9 Migrate existing access control to use new RBAC system
- [x] 2.10 Add SDK methods for role and permission queries
- [x] 2.11 Write tests for RBAC context, Security Rules, and integration

## 3. Webhooks ⚠️ REQUIRES SERVER-SIDE COMPONENT — DEFERRED

> **CONFLICT with client-side-only architecture:** Webhook delivery requires an HTTP client capable of making outbound POST requests to external URLs. A pure client-side SPA cannot reliably deliver webhooks (must keep page open, exposes auth tokens, CORS-limited). Implementation options:
>
> - Add a lightweight server-side component (Cloud Function or tiny Node service) solely for webhook dispatch
> - Use a third-party webhook service (e.g., webhook.site, Svix, Zapier) triggered by Firestore writes
> - Defer webhooks until a server-side component is introduced
>
> **Status:** Deferred until a server-side component is introduced. The tasks below remain open.

- [ ] 3.1 Define `webhooks` Firestore collection schema and `webhook_logs` in types
- [ ] 3.2 Implement webhook CRUD operations via Firestore client SDK and admin UI page
- [ ] 3.3 Implement webhook event dispatcher (internal event bus on content operations)
- [ ] 3.4 Implement webhook delivery via Cloud Function or external service (server-side)
- [ ] 3.5 Implement retry logic with exponential backoff
- [ ] 3.6 Implement delivery logging and admin UI history view
- [ ] 3.7 Add test/sample payload functionality
- [ ] 3.8 Add SDK methods for webhook management
- [ ] 3.9 Write tests for webhook dispatch, retry, and logging

## 4. API Rate Limiting ❌ NOT APPLICABLE (CLIENT-SIDE ONLY)

> **CONFLICT with client-side-only architecture:** Rate limiting is a server-side concept that requires a centralized request gateway. In a client-side-only app where all data access goes directly through the Firebase client SDK to Firestore, there is no application-level API to rate-limit. Firestore itself has built-in rate limiting and quota enforcement via the Firebase platform. This capability should be removed from the roadmap unless a server-side layer is introduced later.

## 5. Content Versioning

- [x] 5.1 Define version schema and Firestore subcollection indexes in types
- [x] 5.2 Implement pre-update snapshot hook — client reads current doc state and writes version to subcollection before each update
- [x] 5.3 Implement version list via Firestore subcollection query
- [x] 5.4 Implement rollback — write current state as new version, then restore target version's data
- [x] 5.5 Implement version pruning — client-side on write (retain last N versions); support Firestore TTL policies for age-based pruning
- [x] 5.6 Build admin UI: version history panel with timeline view
- [x] 5.7 Build admin UI: diff view between versions (side-by-side)
- [x] 5.8 Build admin UI: rollback with confirmation dialog
- [x] 5.9 Extend versioning to globals
- [x] 5.10 Add SDK methods for version operations
- [x] 5.11 Write tests for version snapshots, rollback, pruning

## 6. Admin Analytics

- [x] 6.1 Implement content statistics via Firestore `getCountFromServer` aggregation queries
- [x] 6.2 Implement storage usage summary (sum `size` field from `media` collection documents)
- [x] 6.3 Implement user activity tracking (query `createdBy`/`updatedBy` fields across collections)
- [x] 6.4 Data retention/pruning — N/A, analytics is derived live from existing documents (no collected data to prune)
- [x] 6.5 Build admin UI: dashboard widgets (content counts, charts, storage usage)
- [x] 6.6 Build admin UI: analytics page with time period selector
- [x] 6.7 Add SDK methods for analytics queries
- [x] 6.8 Write tests for analytics queries and data derivation

## 7. Content Workflow

- [x] 7.1 Define workflow state machine schema and entry `workflowState` field in types
- [x] 7.2 Implement workflow config on collection schema (states, transitions, role requirements)
- [x] 7.3 Enforce workflow state transitions in the admin UI before write operations; rely on Firestore Security Rules for server-side enforcement
- [x] 7.4 Implement workflow transition logic (client-side state validation + Firestore write)
- [x] 7.5 Implement reviewer assignment (by user, by role) in Firestore
- [x] 7.6 Implement in-app notifications via Firestore listener (no email/server)
- [x] 7.7 Implement workflow audit log in Firestore subcollection
- [x] 7.8 Build admin UI: workflow state indicator and transition buttons in entry header
- [x] 7.9 Build admin UI: reviewer assignment selector
- [x] 7.10 Build admin UI: workflow history panel
- [x] 7.11 Add SDK methods for workflow operations
- [x] 7.12 Write tests for workflow transitions, permissions, and rollback

## 8. Shared Infrastructure

- [x] 8.1 Deploy Firestore indexes and Security Rules for all new collections
- [x] 8.2 Add configuration schema entries for all capabilities (defaults + overrides)
- [x] 8.3 Update admin sidebar navigation with new feature links
- [x] 8.4 Add feature flags for each capability (enable/disable via config)
- [x] 8.5 Update TSDoc documentation across new packages and routes
- [x] 8.6 Create e2e tests for critical paths across capabilities
