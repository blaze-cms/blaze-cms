import { createRoute } from "@tanstack/react-router";
import { Puzzle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const pluginsRoute = createRoute({
  component: PluginsSettings,
  getParentRoute: () => appLayoutRoute,
  path: "/settings/plugins",
});

function PluginsSettings() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Plugins</h1>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 text-muted-foreground">
          <Puzzle className="h-5 w-5" />
          <p className="text-sm">No plugins installed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
