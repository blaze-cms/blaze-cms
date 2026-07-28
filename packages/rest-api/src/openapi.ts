import type { CollectionDefinition } from "@blaze-cms/types";

export function createOpenApiSchema(collections: CollectionDefinition[]): Record<string, unknown> {
  const schemas: Record<string, unknown> = {};
  const paths: Record<string, unknown> = {};

  for (const collection of collections) {
    const slug = collection.slug;
    const properties: Record<string, unknown> = {
      createdAt: { format: "date-time", type: "string" },
      id: { type: "string" },
      updatedAt: { format: "date-time", type: "string" },
    };

    for (const field of collection.fields) {
      properties[field.name] = { type: fieldTypeToOpenApi(field.type) };
    }

    schemas[slug] = {
      properties,
      type: "object",
    };

    paths[`/api/${slug}`] = {
      get: {
        responses: { "200": { description: "OK" } },
        summary: `List ${collection.labels.plural}`,
      },
      post: {
        responses: { "201": { description: "Created" } },
        summary: `Create ${collection.labels.singular}`,
      },
    };

    paths[`/api/${slug}/{id}`] = {
      delete: {
        responses: { "204": { description: "Deleted" } },
        summary: `Delete ${collection.labels.singular}`,
      },
      get: {
        responses: { "200": { description: "OK" } },
        summary: `Get ${collection.labels.singular}`,
      },
      patch: {
        responses: { "200": { description: "OK" } },
        summary: `Update ${collection.labels.singular}`,
      },
    };
  }

  return {
    components: { schemas },
    info: { title: "Blaze CMS API", version: "1.0.0" },
    openapi: "3.1.0",
    paths,
  };
}

function fieldTypeToOpenApi(type: string): string {
  const map: Record<string, string> = {
    boolean: "boolean",
    checkbox: "boolean",
    code: "string",
    color: "string",
    date: "string",
    datetime: "string",
    email: "string",
    json: "object",
    markdown: "string",
    media: "string",
    multiSelect: "array",
    number: "number",
    password: "string",
    radio: "string",
    relation: "string",
    richText: "string",
    select: "string",
    slug: "string",
    text: "string",
    textarea: "string",
    upload: "string",
    url: "string",
  };
  return map[type] ?? "string";
}
