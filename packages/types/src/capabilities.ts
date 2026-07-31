/**
 * Capability configuration types.
 *
 * Capabilities are the named feature areas of the CMS (content, analytics,
 * media, versioning, workflow, notifications, rbac). Each capability can be
 * toggled with an `enabled` feature flag and carries capability-specific
 * settings. Everything defaults to enabled so omitting config preserves
 * current behavior.
 */

export interface CapabilityEnabledConfig {
  enabled?: boolean | undefined;
}

export interface AnalyticsCapabilityConfig extends CapabilityEnabledConfig {
  staleTimeMs?: number | undefined;
}

export interface MediaCapabilityConfig extends CapabilityEnabledConfig {
  maxFileSize?: number | undefined;
}

export interface VersioningCapabilityConfig extends CapabilityEnabledConfig {
  maxPerDoc?: number | undefined;
}

/** Project-level per-capability configuration. */
export type CapabilitiesConfig = {
  content?: CapabilityEnabledConfig | undefined;
  analytics?: AnalyticsCapabilityConfig | undefined;
  media?: MediaCapabilityConfig | undefined;
  versioning?: VersioningCapabilityConfig | undefined;
  workflow?: CapabilityEnabledConfig | undefined;
  notifications?: CapabilityEnabledConfig | undefined;
  rbac?: CapabilityEnabledConfig | undefined;
};

export type CapabilityName = keyof CapabilitiesConfig;

/** Resolved enabled state for every capability. */
export type FeatureFlags = Record<CapabilityName, boolean>;

/**
 * Collection-scoped feature flags. Only capabilities that genuinely vary per
 * content type are allowed here; the validator rejects anything else.
 */
export type CollectionFeatureFlags = Partial<Record<"workflow" | "versioning", boolean>>;

/** Per-collection capability config. */
export interface CollectionCapabilitiesConfig {
  features?: CollectionFeatureFlags | undefined;
}

/** Per-global capability config (only versioning is collection-scoped for globals). */
export interface GlobalCapabilitiesConfig {
  features?: Partial<Record<"versioning", boolean>> | undefined;
}

/**
 * Resolved capability state emitted into generated output. `features` holds the
 * project-wide flag for every capability; `collections` / `globals` hold
 * per-definition overrides for collection-scoped capabilities. Consumers apply
 * an override when present, otherwise the project-wide flag.
 */
export interface ResolvedCapabilities {
  features: FeatureFlags;
  collections: Record<string, Partial<FeatureFlags>>;
  globals: Record<string, Partial<FeatureFlags>>;
}
