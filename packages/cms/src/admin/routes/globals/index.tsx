import { createRoute, Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const globalsIndexRoute = createRoute({
  component: GlobalsList,
  getParentRoute: () => appLayoutRoute,
  path: "/globals",
});

const globals = [
  { label: "Homepage", slug: "homepage" },
  { label: "Site Settings", slug: "site-settings" },
];

function GlobalsList() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Globals</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {globals.map((g) => (
          <Link key={g.slug} to="/globals/$slug" params={{ slug: g.slug }}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  {g.label}
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
