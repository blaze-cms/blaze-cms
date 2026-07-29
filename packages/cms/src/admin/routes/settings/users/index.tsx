import { createRoute, Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const settingsUsersRoute = createRoute({
  component: SettingsUsers,
  getParentRoute: () => appLayoutRoute,
  path: "/settings/users",
});

function SettingsUsers() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Settings</h1>
        <Link to="/settings/users/new"><Button><Plus className="mr-1 h-4 w-4" /> New User</Button></Link>
      </div>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 text-muted-foreground">
          <Users className="h-5 w-5" />
          <p className="text-sm">User settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
