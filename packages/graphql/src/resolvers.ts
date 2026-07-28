import type { DatabaseAdapter, CollectionDefinition, GlobalDefinition } from "@blaze-cms/types";

export function createResolvers(
  adapter: DatabaseAdapter,
  collections: CollectionDefinition[],
  globals: GlobalDefinition[],
): Record<string, unknown> {
  const Query: Record<string, unknown> = {};
  const Mutation: Record<string, unknown> = {};

  for (const collection of collections) {
    const slug = collection.slug;
    const name =
      slug.charAt(0).toUpperCase() +
      slug.slice(1).replace(/[-_](.)/g, (_: string, c: string) => c.toUpperCase());
    const plural = `${slug}s`;
    const camelPlural = plural.charAt(0).toLowerCase() + plural.slice(1);
    const camel = slug.charAt(0).toLowerCase() + slug.slice(1);

    Query[camelPlural] = async (_: unknown, args: { limit?: number; offset?: number }) => {
      const result = await adapter.findMany(slug, {
        limit: args.limit ?? 10,
        offset: args.offset ?? 0,
      });
      return result.data;
    };

    Query[camel] = async (_: unknown, args: { id: string }) => {
      return adapter.findOne(slug, args.id);
    };

    Mutation[`create${name}`] = async (_: unknown, args: { data: Record<string, unknown> }) => {
      return adapter.create(slug, args.data);
    };

    Mutation[`update${name}`] = async (
      _: unknown,
      args: { id: string; data: Record<string, unknown> },
    ) => {
      return adapter.update(slug, args.id, args.data);
    };

    Mutation[`delete${name}`] = async (_: unknown, args: { id: string }) => {
      return adapter.delete(slug, args.id);
    };
  }

  for (const global of globals) {
    const slug = global.slug;
    const name =
      slug.charAt(0).toUpperCase() +
      slug.slice(1).replace(/[-_](.)/g, (_: string, c: string) => c.toUpperCase());
    const camel = slug.charAt(0).toLowerCase() + slug.slice(1);

    Query[camel] = async () => {
      return adapter.findOne(`globals_${slug}`, "default");
    };

    Mutation[`update${name}`] = async (_: unknown, args: { data: Record<string, unknown> }) => {
      return adapter.update(`globals_${slug}`, "default", args.data);
    };
  }

  return { Mutation, Query };
}
