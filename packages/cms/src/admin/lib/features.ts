import type { CapabilityName } from "@blazing-cms/types";

import { capabilities } from "@/__generated__/app-config";

export function featureEnabled(name: CapabilityName): boolean {
  return capabilities.features[name];
}

export function collectionFeatureEnabled(slug: string, name: "workflow" | "versioning"): boolean {
  return capabilities.collections[slug]?.[name] ?? capabilities.features[name];
}

export function globalFeatureEnabled(slug: string, name: "versioning"): boolean {
  return capabilities.globals[slug]?.[name] ?? capabilities.features[name];
}
