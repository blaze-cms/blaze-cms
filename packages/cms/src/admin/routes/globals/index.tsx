import { createRoute, Link } from "@tanstack/react-router";
import { Globe, Database } from "lucide-react";

import { globals } from "@/__generated__/schema-registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const globalsIndexRoute = createRoute({
  component: GlobalsList,
  getParentRoute: () => appLayoutRoute,
  path: "/globals",
});

function GlobalsList() {
  const hasSchemas = globals.length > 0;

  if (!hasSchemas) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Globals</h1>
          <p className="text-muted-foreground text-sm">No globals defined yet</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Database className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No globals found</h2>
          <p className="max-w-md text-muted-foreground">
            Create a global in the <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/globals/</code> directory or
            run <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">blaze scaffold global</code> to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Globals</h1>
        <p className="text-muted-foreground text-sm">{globals.length} global(s) defined</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {globals.map((g) => (
          <Link key={g.slug} to="/globals/$slug" params={{ slug: g.slug }}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  {g.label ?? g.slug}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">/{g.slug}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
