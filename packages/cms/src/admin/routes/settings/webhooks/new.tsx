import { createRoute, useRouter } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const settingsNewWebhookRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/webhooks/new",
  component: SettingsNewWebhook,
});

function SettingsNewWebhook() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.history.back()} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl font-bold">New Webhook</h1>
      </div>
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label>URL</Label>
          <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button>Create</Button>
      </div>
    </div>
  );
}
