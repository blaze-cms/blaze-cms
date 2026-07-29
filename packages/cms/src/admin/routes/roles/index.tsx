import { createRoute, Link } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Shield } from "lucide-react";

export const rolesIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/roles",
  component: RolesList,
});

const sampleRoles = [
  { id: "1", name: "Admin", description: "Full access" },
  { id: "2", name: "Editor", description: "Can edit content" },
  { id: "3", name: "Viewer", description: "Read-only access" },
];

function RolesList() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Link to="/roles/new">
          <Button><Plus className="mr-1 h-4 w-4" /> New Role</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {sampleRoles.map((role) => (
          <Link key={role.id} to="/roles/$id" params={{ id: role.id }}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-4">
                <Shield className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{role.name}</p>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
