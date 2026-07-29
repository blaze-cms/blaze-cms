import { createRoute, useRouter } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

export const globalDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/globals/$slug",
  component: GlobalEditor,
});

function GlobalEditor() {
  const { slug } = globalDetailRoute.useParams();
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.history.back()}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl font-bold capitalize">{slug}</h1>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button>
          <Save className="mr-1 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
}
