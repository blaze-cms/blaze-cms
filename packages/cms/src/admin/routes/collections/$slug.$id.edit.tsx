import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";

import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataProvider } from "@/lib/providers/context";
import { appLayoutRoute } from "@/routes/app-layout";

export const editEntryRoute = createRoute({
  component: EditEntry,
  getParentRoute: () => appLayoutRoute,
  path: "/collections/$slug/$id",
});

function EditEntry() {
  const { id, slug } = editEntryRoute.useParams();
  const router = useRouter();
  const provider = useDataProvider();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryFn: async () => provider.findOne(slug, id),
    queryKey: ["collection", slug, id],
  });

  useEffect(() => {
    if (entry?.title) setTitle(entry.title as string);
  }, [entry]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await provider.update(slug, id, { title });
      addToast({ description: "Entry has been updated.", title: "Saved" });
      await queryClient.invalidateQueries({ queryKey: ["collection", slug] });
    } catch (err) {
      addToast({ description: String(err), title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.history.back()}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl font-bold">Edit {slug}</h1>
        <p className="text-muted-foreground text-sm">ID: {id}</p>
      </div>

      {isLoading ? (
        <div className="max-w-lg space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              autoFocus
            />
          </div>
          <Button type="submit" disabled={saving || !title.trim()}>
            <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </Button>
        </form>
      )}
    </div>
  );
}
