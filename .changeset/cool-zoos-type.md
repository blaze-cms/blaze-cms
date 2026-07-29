---
"@blazing-cms/cms": minor
"@blazing-cms/create-app": minor
"@blazing-cms/docs": minor
"blazing-cms": minor
---

Polish: docs site, GitHub workflows, rename, dead code removal, circular dep fix

- Add apps/docs with VitePress site (guide + reference pages)
- Add GitHub Actions CI + publish workflows
- Rename project from "blaze-cms" to "blazing-cms" (all packages, imports, configs, display text)
- Add project README.md
- Add @changesets/cli with config.json
- Remove 15 unused Radix UI deps, class-variance-authority, cmdk, @blazing-cms/permissions, @changesets/changelog-github
- Remove unused scripts/serve-spa.mjs
- Break circular dependency field-input.tsx ↔ structure-inputs.tsx via React.lazy
- Add fallow:audit to pre-push hook
- Clean up stale entries from knip.json ignoreDependencies
- Run graphify knowledge graph build
