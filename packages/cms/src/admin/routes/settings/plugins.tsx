import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Puzzle } from "lucide-react";

export const pluginsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/plugins",
  component: PluginsSettings,
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
