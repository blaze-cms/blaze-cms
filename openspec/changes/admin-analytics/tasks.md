## 1. Data Layer

- [ ] 1.1 Add Firestore composite indexes for time-range queries (createdAt, updatedAt on collections_posts, etc.)
- [ ] 1.2 Define analytics data shape types in types package

## 2. Analytics Queries (Client SDK)

- [ ] 2.1 Implement `analytics.getContentCounts()` — uses `getCountFromServer` per collection for total entries, globals, media, users
- [ ] 2.2 Implement `analytics.getContentByCollection()` — queries each collection for entry count
- [ ] 2.3 Implement `analytics.getContentChangesOverTime({ period })` — queries entries with `createdAt`/`updatedAt` range filters
- [ ] 2.4 Implement `analytics.getStorageUsage()` — sums `size` fields from `media` collection documents, grouped by file type
- [ ] 2.5 Implement `analytics.getUserActivity({ period })` — queries distinct `createdBy`/`updatedBy` across collections within a time range, returns active users and top contributors

## 3. Admin UI

- [ ] 3.1 Replace static dashboard welcome page with live analytics widgets
- [ ] 3.2 Build content statistics widget (total counts, per-collection breakdown with chart)
- [ ] 3.3 Build storage usage widget (total storage, file type breakdown)
- [ ] 3.4 Build user activity widget (active users, top users table)
- [ ] 3.5 Add time period selector (7d, 30d, 90d) that refreshes all widgets
- [ ] 3.6 Create dedicated analytics page with expanded views

## 4. SDK & Config

- [ ] 4.1 Add SDK methods for analytics queries
- [ ] 4.2 Add analytics configuration options (enabled flag, caching stale time)
- [ ] 4.3 Write tests for analytics query functions
