import { createRoute, Link } from "@tanstack/react-router";
import { FileText, Database } from "lucide-react";

import { collections } from "@/__generated__/schema-registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const collectionsIndexRoute = createRoute({
  component: CollectionsList,
  getParentRoute: () => appLayoutRoute,
  path: "/collections",
});

function CollectionsList() {
  const hasSchemas = collections.length > 0;

  if (!hasSchemas) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground text-sm">No collections defined yet</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Database className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No collections found</h2>
          <p className="max-w-md text-muted-foreground">
            Create a collection in the <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/collections/</code> directory or
            run <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">blaze scaffold collection</code> to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-muted-foreground text-sm">{collections.length} collection(s) defined</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Link key={col.slug} to="/collections/$slug" params={{ slug: col.slug }}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {col.labels?.singular ?? col.slug}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">/{col.slug}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
