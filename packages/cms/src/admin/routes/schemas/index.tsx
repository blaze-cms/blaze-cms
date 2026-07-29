import { createRoute, Link } from "@tanstack/react-router";
import { Plus, FileJson, Construction } from "lucide-react";

import {
  collections as registryCollections,
  globals as registryGlobals,
  components as registryComponents,
} from "@/__generated__/schema-registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const schemasIndexRoute = createRoute({
  component: SchemasList,
  getParentRoute: () => appLayoutRoute,
  path: "/schemas",
});

function SchemasList() {
  const hasSchemas =
    registryCollections.length > 0 || registryGlobals.length > 0 || registryComponents.length > 0;

  if (import.meta.env.PROD) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Construction className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Schema Builder</h2>
        <p className="max-w-md text-muted-foreground">
          The schema builder is only available in local development mode. Define schemas in code
          using
          <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">
            defineCollection()
          </code>
          and
          <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">defineGlobal()</code>
          in the <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">cms/</code>{" "}
          directory.
        </p>
      </div>
    );
  }

  const schemaTypes = [
    { badge: "collection", icon: FileJson, items: registryCollections, label: "Collections" },
    { badge: "global", icon: FileJson, items: registryGlobals, label: "Globals" },
    { badge: "component", icon: FileJson, items: registryComponents, label: "Components" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schemas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {registryCollections.length + registryGlobals.length + registryComponents.length}{" "}
            schema(s) defined in code
          </p>
        </div>
        <Link to="/schemas/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" /> New Schema
          </Button>
        </Link>
      </div>

      {schemaTypes.map((section) => {
        if (section.items.length === 0) return null;
        return (
          <div key={section.label} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{section.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((s) => {
                const label =
                  section.badge === "collection"
                    ? (s as (typeof registryCollections)[number]).labels.plural
                    : ((s as (typeof registryGlobals)[number]).label ?? s.slug);
                return (
                  <Link
                    key={`${section.badge}-${s.slug}`}
                    to={"/schemas/$type/$slug" as string}
                    params={{ slug: s.slug, type: section.badge } as Record<string, string>}
                  >
                    <Card className="cursor-pointer transition-colors hover:bg-accent">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <section.icon className="h-5 w-5" />
                          {label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">{section.badge}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {!hasSchemas && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <FileJson className="h-12 w-12 text-muted-foreground" />
          <p className="max-w-md text-muted-foreground">
            No schemas found. Add schema files to{" "}
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/collections/</code>,
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/globals/</code>, or
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/components/</code> and run
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">blaze generate</code>.
          </p>
        </div>
      )}
    </div>
  );
}
