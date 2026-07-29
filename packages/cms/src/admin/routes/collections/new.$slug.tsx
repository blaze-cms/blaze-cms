import { createRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState, type FormEvent } from "react";

import { collections } from "@/__generated__/schema-registry";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataProvider } from "@/lib/providers/context";
import { appLayoutRoute } from "@/routes/app-layout";

export const newEntryRoute = createRoute({
  component: NewEntry,
  getParentRoute: () => appLayoutRoute,
  path: "/collections/new/$slug",
});

function NewEntry() {
  const { slug } = newEntryRoute.useParams();
  const router = useRouter();
  const provider = useDataProvider();
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const col = collections.find((c) => c.slug === slug);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await provider.create(slug, { createdAt: new Date().toISOString(), status: "draft", title });
      addToast({ description: "Your entry has been created.", title: "Entry created" });
      router.navigate({ params: { slug }, to: "/collections/$slug" as string });
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
        <h1 className="text-3xl font-bold">New {col?.labels?.singular ?? slug}</h1>
      </div>

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
    </div>
  );
}
