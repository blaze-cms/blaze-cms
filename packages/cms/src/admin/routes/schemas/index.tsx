import { createRoute, Link } from "@tanstack/react-router";
import { Plus, FileJson, Construction, Upload, CheckCircle, XCircle } from "lucide-react";
import { getFirestore, collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appLayoutRoute } from "@/routes/app-layout";
import {
  collections as registryCollections,
  globals as registryGlobals,
  components as registryComponents,
} from "@/__generated__/schema-registry";
import { useToast } from "@/components/toast-provider";
import { useAuth } from "@/lib/auth";
import { isFirebaseMode } from "@/lib/backend-mode";

export const schemasIndexRoute = createRoute({
  component: SchemasList,
  getParentRoute: () => appLayoutRoute,
  path: "/schemas",
});

type SyncStatus = "idle" | "syncing" | "success" | "error";

async function writeSchemaBatch(
  type: "collections" | "globals" | "components",
  items: { slug: string }[],
  activeSlugs: string[],
) {
  const db = getFirestore();
  const batch = writeBatch(db);
  const colRef = collection(db, "_schemas", type);

  for (const item of items) {
    const ref = doc(colRef, item.slug);
    batch.set(ref, { ...item, syncedAt: new Date().toISOString() }, { merge: true });
  }

  const existingSnap = await getDocs(collection(db, "_schemas", type));

  for (const snapDoc of existingSnap.docs) {
    if (!activeSlugs.includes(snapDoc.id) && snapDoc.data().deprecated !== true) {
      batch.update(snapDoc.ref, { deprecated: true, deprecatedAt: new Date().toISOString() });
    }
  }

  return items.length;
}

function SchemasList() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const isFirebase = isFirebaseMode();
  const hasSchemas =
    registryCollections.length > 0 ||
    registryGlobals.length > 0 ||
    registryComponents.length > 0;

  async function handleSync() {
    if (!user) {
      addToast({ description: "You must be signed in to sync schemas", title: "Not authenticated", variant: "destructive" });
      return;
    }

    try {
      const tokenResult = await user.getIdTokenResult();
      if (!tokenResult.claims.admin) {
        addToast({ description: "Sync requires admin privileges", title: "Access denied", variant: "destructive" });
        return;
      }
    } catch {
      addToast({ description: "Failed to verify admin privileges", title: "Auth error", variant: "destructive" });
      return;
    }

    setSyncStatus("syncing");

    try {
      const colSlugs = registryCollections.map((c) => c.slug);
      const globalSlugs = registryGlobals.map((g) => g.slug);
      const compSlugs = registryComponents.map((c) => c.slug);

      await writeSchemaBatch("collections", registryCollections, colSlugs);
      await writeSchemaBatch("globals", registryGlobals, globalSlugs);
      await writeSchemaBatch("components", registryComponents, compSlugs);

      setSyncStatus("success");
      addToast({
        description: `${colSlugs.length} collections, ${globalSlugs.length} globals, ${compSlugs.length} components synced`,
        title: "Schemas synced",
        variant: "success",
      });
    } catch (e) {
      setSyncStatus("error");
      addToast({
        description: e instanceof Error ? e.message : "Unknown error",
        title: "Sync failed",
        variant: "destructive",
      });
    }
  }

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

  const schemaTypes = [
    { label: "Collections", items: registryCollections, icon: FileJson, badge: "collection" },
    { label: "Globals", items: registryGlobals, icon: FileJson, badge: "global" },
    { label: "Components", items: registryComponents, icon: FileJson, badge: "component" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schemas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {registryCollections.length + registryGlobals.length + registryComponents.length} schema(s) defined in code
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFirebase && hasSchemas && (
            <Button variant="outline" onClick={handleSync} disabled={syncStatus === "syncing"}>
              {syncStatus === "syncing" ? (
                <span className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : syncStatus === "success" ? (
                <CheckCircle className="mr-1 h-4 w-4" />
              ) : syncStatus === "error" ? (
                <XCircle className="mr-1 h-4 w-4" />
              ) : (
                <Upload className="mr-1 h-4 w-4" />
              )}
              {syncStatus === "syncing" ? "Syncing..." : "Sync to Firestore"}
            </Button>
          )}
          <Link to="/schemas/new">
            <Button><Plus className="mr-1 h-4 w-4" /> New Schema</Button>
          </Link>
        </div>
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
                    ? (s as typeof registryCollections[number]).labels.plural
                    : (s as typeof registryGlobals[number]).label ?? s.slug;
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
            No schemas found. Add schema files to <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/collections/</code>,
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/globals/</code>, or
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">cms/components/</code> and run
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5">blaze generate</code>.
          </p>
        </div>
      )}
    </div>
  );
}
