import type { GlobalDefinition, FieldDefinition } from "@blaze-cms/types";

export function defineGlobal(config: {
  slug: string;
  label: string;
  fields: FieldDefinition[];
  admin?: {
    group?: string;
    description?: string;
    hide?: boolean;
  };
}): GlobalDefinition {
  return {
    admin: config.admin,
    fields: config.fields,
    label: config.label,
    slug: config.slug,
  };
}
