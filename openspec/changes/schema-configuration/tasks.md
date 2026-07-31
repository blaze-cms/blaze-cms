## 1. Types (`@blazing-cms/types`)

- [ ] 1.1 Add `CapabilityName` (union of the 7 capabilities: admin, collections, media, roles, workflows, versioning, analytics) and `FeatureFlags` (`Record<CapabilityName, boolean>`)
- [ ] 1.2 Add `CapabilitiesConfig` (`Record<CapabilityName, CapabilityConfig>`) with `CapabilityConfig` supporting collection-scoped `features: Partial<FeatureFlags>` for workflows/versioning and capability-specific settings
- [ ] 1.3 Extend `CollectionDefinition` with `config?: CollectionConfig` (per-collection `features` for workflows/versioning, extends `CapabilityConfig`)
- [ ] 1.4 Extend `GlobalDefinition` with `config?: GlobalConfig` (per-collection-style `features` for versioning)
- [ ] 1.5 Extend `Config` (packages/types/src/core.ts) with `capabilities?: CapabilitiesConfig`

## 2. Schema validation (`@blazing-cms/schema`)

- [ ] 2.1 `defineCollection` / `defineGlobal` accept the new `config` field without runtime changes
- [ ] 2.2 `SchemaValidator` validates `config`: rejects unknown capability names, non-boolean flag values, and invalid per-capability settings
- [ ] 2.3 Rebuild `@blazing-cms/types` / `@blazing-cms/schema` dist so downstream packages pick up the new types

## 3. CLI config loading (`@blazing-cms/cms`)

- [ ] 3.1 Add `jiti` as a direct dependency of `@blazing-cms/cms` (already in lockfile at ^2.7.0) and run pnpm install
- [ ] 3.2 Add `loadProjectConfig` in `packages/cms/src/commands/` that jiti-evaluates `blazing-cms.config.ts` and returns the normalized `CapabilitiesConfig` (replaces the regex-based `extractProjectName` read)
- [ ] 3.3 `defineConfig` / `BlazeUserConfig` in packages/cms/src/index.ts accept `capabilities` (extends `Config`)
- [ ] 3.4 Add `resolveCapabilities` in `packages/cms/src/shared/capabilities.ts` (alias-free, like workflow.ts): merge project config + per-collection config, apply defaults (all capabilities enabled), produce resolved `FeatureFlags`

## 4. Generation (`cms generate`)

- [ ] 4.1 Generate emits resolved `capabilities` / `features` into `__generated__/app-config.ts` alongside `projectName`
- [ ] 4.2 Gate `firestore.rules` generation on resolved flags (omit rules blocks for disabled capabilities: workflows, versioning, RBAC, media)
- [ ] 4.3 Gate `firestore.indexes.json` generation to match enabled capabilities
- [ ] 4.4 `cms lint` validates capability config in `blazing-cms.config.ts` and reports invalid flags as errors

## 5. Admin gating (`@blazing-cms/cms` admin)

- [ ] 5.1 Admin reads resolved flags from `__generated__/app-config`; sidebar/routes hide disabled capabilities (workflows, analytics, roles)
- [ ] 5.2 Versioning toggle and workflow panel honor per-collection `config` (fall back to the project-level flag when unset)
- [ ] 5.3 Regenerate the demo app-config so admin compiles against the new exports

## 6. SDK (`@blazing-cms/sdk`)

- [ ] 6.1 `BlazeClientConfig` gains `features?: FeatureFlags`; `createBlazeClient` reads it and gates capabilities following the `analytics` precedent (packages/sdk/src/types.ts)
- [ ] 6.2 Rebuild `@blazing-cms/sdk` dist so generated clients pick up the new option

## 7. Tests, playground, docs

- [ ] 7.1 Unit tests for `resolveCapabilities` (defaults, overrides, unknown capability rejection)
- [ ] 7.2 Validator tests for invalid capability names / non-boolean flags
- [ ] 7.3 Playground: add `capabilities` to `apps/playground/blazing-cms.config.ts`, disable one capability, regenerate and verify the admin + rules reflect it
- [ ] 7.4 Update TODO.md and ARCHITECTURE.md for the schema-configuration / feature-flag capability
- [ ] 7.5 Full check: typecheck + lint + `fallow:audit` clean
