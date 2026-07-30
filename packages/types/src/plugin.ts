import type { FieldDefinition } from "./fields.js";
import type { CollectionDefinition, GlobalDefinition } from "./schema.js";

export interface PluginHooks {
  beforeSchemaLoad?: (() => Promise<void>) | undefined;
  afterSchemaLoad?:
    | ((schemas: {
        collections: CollectionDefinition[];
        globals: GlobalDefinition[];
        components: unknown[];
      }) => Promise<void>)
    | undefined;
}

export interface PluginDefinition {
  slug: string;
  name: string;
  description?: string | undefined;
  version?: string | undefined;
  enabled: boolean;
  hooks?: PluginHooks | undefined;
  customFields?: Record<string, FieldDefinition[]> | undefined;
  adminPanels?:
    | Array<{
        slug: string;
        label: string;
        icon?: string | undefined;
        component: string;
        plugin: string;
      }>
    | undefined;
}

export interface PluginRegistration {
  plugin: PluginDefinition;
  options?: Record<string, unknown> | undefined;
}
