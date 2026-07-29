import type { ComponentDefinition, FieldDefinition } from "@blazing-cms/types";

export function defineComponent(config: {
  slug: string;
  label: string;
  fields: FieldDefinition[];
}): ComponentDefinition {
  return {
    fields: config.fields,
    label: config.label,
    slug: config.slug,
  };
}
