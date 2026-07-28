import type { CollectionDefinition, GlobalDefinition } from "@blaze-cms/types";

export function generateTypeDefs(
  collections: CollectionDefinition[],
  globals: GlobalDefinition[],
): string {
  const types: string[] = [];

  types.push(`
    scalar DateTime
    scalar JSON

    type Query {
      _empty: String
    }

    type Mutation {
      _empty: String
    }
  `);

  for (const collection of collections) {
    const fields = collection.fields
      .map((f) => `  ${f.name}: ${fieldTypeToGraphQL(f.type)}`)
      .join("\n");

    types.push(`
      type ${pascalCase(collection.slug)} {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        ${fields}
      }

      input ${pascalCase(collection.slug)}Input {
        ${fields}
      }

      extend type Query {
        ${camelCase(collection.slug).pluralize}(limit: Int, offset: Int): [${pascalCase(collection.slug)}!]!
        ${camelCase(collection.slug)}(id: ID!): ${pascalCase(collection.slug)}
      }

      extend type Mutation {
        create${pascalCase(collection.slug)}(data: ${pascalCase(collection.slug)}Input!): ${pascalCase(collection.slug)}!
        update${pascalCase(collection.slug)}(id: ID!, data: ${pascalCase(collection.slug)}Input!): ${pascalCase(collection.slug)}!
        delete${pascalCase(collection.slug)}(id: ID!): Boolean!
      }
    `);
  }

  for (const global of globals) {
    const fields = global.fields
      .map((f) => `  ${f.name}: ${fieldTypeToGraphQL(f.type)}`)
      .join("\n");

    types.push(`
      type ${pascalCase(global.slug)} {
        ${fields}
      }

      input ${pascalCase(global.slug)}Input {
        ${fields}
      }

      extend type Query {
        ${camelCase(global.slug)}: ${pascalCase(global.slug)}
      }

      extend type Mutation {
        update${pascalCase(global.slug)}(data: ${pascalCase(global.slug)}Input!): ${pascalCase(global.slug)}!
      }
    `);
  }

  return types.join("\n");
}

function pascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function camelCase(str: string): string {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

declare global {
  interface String {
    pluralize(): string;
  }
}

function fieldTypeToGraphQL(type: string): string {
  const map: Record<string, string> = {
    boolean: "Boolean",
    checkbox: "Boolean",
    code: "String",
    color: "String",
    date: "DateTime",
    datetime: "DateTime",
    email: "String",
    json: "JSON",
    markdown: "String",
    media: "String",
    multiSelect: "[String!]",
    number: "Float",
    password: "String",
    radio: "String",
    relation: "String",
    richText: "String",
    select: "String",
    slug: "String",
    text: "String",
    textarea: "String",
    upload: "String",
    url: "String",
  };
  return map[type] ?? "String";
}
