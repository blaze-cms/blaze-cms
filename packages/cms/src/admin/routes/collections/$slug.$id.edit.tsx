import { createRoute, useRouter } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/toast-provider";
import { useDataProvider } from "@/lib/providers/context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";

export const editEntryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/collections/$slug/$id",
  component: EditEntry,
});

function EditEntry() {
  const { slug, id } = editEntryRoute.useParams();
  const router = useRouter();
  const provider = useDataProvider();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ["collection", slug, id],
    queryFn: async () => provider.findOne(slug, id),
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
      addToast({ title: "Saved", description: "Entry has been updated." });
      await queryClient.invalidateQueries({ queryKey: ["collection", slug] });
    } catch (err) {
      addToast({ title: "Error", description: String(err), variant: "destructive" });
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
