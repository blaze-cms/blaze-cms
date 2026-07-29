import { Link, createRoute } from "@tanstack/react-router";
import { FileText, Globe, Component, Image, Database, ChevronRight } from "lucide-react";

import { collections, globals, components } from "@/__generated__/schema-registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const indexRoute = createRoute({
  component: Dashboard,
  getParentRoute: () => appLayoutRoute,
  path: "/",
});

function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Blaze CMS.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{collections.length}</p>
            <p className="text-xs text-muted-foreground">defined schemas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Globals</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{globals.length}</p>
            <p className="text-xs text-muted-foreground">defined schemas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <Component className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{components.length}</p>
            <p className="text-xs text-muted-foreground">defined schemas</p>
          </CardContent>
        </Card>
        <Link to="/media">
          <Card className="cursor-pointer transition-colors hover:bg-accent h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Media</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Upload and manage media</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Collections</CardTitle>
            <Link
              to="/collections"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {collections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No collections defined.</p>
            ) : (
              <div className="space-y-1">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{c.labels?.plural ?? c.slug}</span>
                    <span className="ml-auto text-xs text-muted-foreground">/{c.slug}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Globals</CardTitle>
            <Link
              to="/globals"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {globals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No globals defined.</p>
            ) : (
              <div className="space-y-1">
                {globals.map((g) => (
                  <Link
                    key={g.slug}
                    to="/globals/$slug"
                    params={{ slug: g.slug }}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{g.label ?? g.slug}</span>
                    <span className="ml-auto text-xs text-muted-foreground">/{g.slug}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Database className="h-4 w-4" />
                Browse Collections
              </Link>
              <Link
                to="/globals"
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Globe className="h-4 w-4" />
                Browse Globals
              </Link>
              <Link
                to="/media"
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Image className="h-4 w-4" />
                Media Library
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
