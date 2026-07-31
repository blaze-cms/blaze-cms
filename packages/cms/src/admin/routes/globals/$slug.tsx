import type { GlobalDefinition } from "@blazing-cms/types";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";

import { globals } from "@/__generated__/schema-registry";
import { FieldInput } from "@/components/field-input";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VersionPanel } from "@/components/version-panel";
import { useDataProvider } from "@/lib/providers/context";
import { appLayoutRoute } from "@/routes/app-layout";

export const globalDetailRoute = createRoute({
  component: GlobalEditor,
  getParentRoute: () => appLayoutRoute,
  path: "/globals/$slug",
});

function globalLabel(globalDef: GlobalDefinition | undefined, slug: string): string {
  return globalDef?.label ?? slug;
}

function saveButtonLabel(saving: boolean): string {
  return saving ? "Saving..." : "Save";
}

function GlobalVersionHistory({
  entry,
  slug,
}: {
  entry: Record<string, unknown> | null | undefined;
  slug: string;
}) {
  if (!entry) return null;
  return <VersionPanel target={{ kind: "global", slug }} />;
}

function GlobalEditor() {
  const { slug } = globalDetailRoute.useParams();
  const router = useRouter();
  const provider = useDataProvider();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const globalDef = globals.find((g) => g.slug === slug);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryFn: async () => provider.getGlobal(slug),
    queryKey: ["global", slug],
  });

  useEffect(() => {
    if (entry && !initialLoaded) {
      setValues(entry);
      setInitialLoaded(true);
    }
  }, [entry, initialLoaded]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await provider.upsertGlobal(slug, values);
      addToast({ description: "Global has been saved.", title: "Saved" });
      await queryClient.invalidateQueries({ queryKey: ["global", slug] });
    } catch (err) {
      addToast({ description: String(err), title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const label = globalLabel(globalDef, slug);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.history.back()}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl font-bold">{label}</h1>
        <p className="text-muted-foreground text-sm">/{slug}</p>
      </div>

      {isLoading ? (
        <div className="max-w-lg space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
          <Skeleton className="h-10 w-24" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          {globalDef?.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
            />
          ))}
          <Button type="submit" disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> {saveButtonLabel(saving)}
          </Button>
        </form>
      )}
      <GlobalVersionHistory entry={entry} slug={slug} />
    </div>
  );
}
