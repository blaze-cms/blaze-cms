import { createRoute, Link } from "@tanstack/react-router";
import { Plus, FileJson, Construction } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const schemasIndexRoute = createRoute({
  component: SchemasList,
  getParentRoute: () => appLayoutRoute,
  path: "/schemas",
});

const schemas = [
  { label: "Posts", slug: "posts", type: "collection" },
  { label: "Pages", slug: "pages", type: "collection" },
  { label: "Homepage", slug: "homepage", type: "global" },
  { label: "Site Settings", slug: "site-settings", type: "global" },
  { label: "Hero", slug: "hero", type: "component" },
];

function SchemasList() {
  if (import.meta.env.PROD) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Construction className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Schema Builder</h2>
        <p className="max-w-md text-muted-foreground">
          The schema builder is only available in local development mode. Define schemas in code using
          <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">defineCollection()</code>
          and
          <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">defineGlobal()</code>
          in the <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">cms/</code> directory.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schemas</h1>
        <Link to="/schemas/new">
          <Button><Plus className="mr-1 h-4 w-4" /> New Schema</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schemas.map((s) => (
          <Link
            key={`${s.type}-${s.slug}`}
            to={"/schemas/$type/$slug" as string}
            params={{ slug: s.slug, type: s.type } as Record<string, string>}
          >
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileJson className="h-5 w-5" />
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{s.type}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
