import { createRoute, Link } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Webhook } from "lucide-react";

export const settingsWebhooksRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/webhooks",
  component: SettingsWebhooks,
});

function SettingsWebhooks() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <Link to="/settings/webhooks/new"><Button><Plus className="mr-1 h-4 w-4" /> New Webhook</Button></Link>
      </div>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 text-muted-foreground">
          <Webhook className="h-5 w-5" />
          <p className="text-sm">No webhooks configured.</p>
        </CardContent>
      </Card>
    </div>
  );
}
