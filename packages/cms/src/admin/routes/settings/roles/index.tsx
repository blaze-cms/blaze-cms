import { createRoute, Link } from "@tanstack/react-router";
import { Plus, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const settingsRolesRoute = createRoute({
  component: SettingsRoles,
  getParentRoute: () => appLayoutRoute,
  path: "/settings/roles",
});

function SettingsRoles() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Role Settings</h1>
        <Link to="/settings/roles/new"><Button><Plus className="mr-1 h-4 w-4" /> New Role</Button></Link>
      </div>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 text-muted-foreground">
          <Shield className="h-5 w-5" />
          <p className="text-sm">Role management.</p>
        </CardContent>
      </Card>
    </div>
  );
}
