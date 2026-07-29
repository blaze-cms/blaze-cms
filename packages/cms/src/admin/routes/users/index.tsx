import { createRoute, Link } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users as UsersIcon } from "lucide-react";

export const usersIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/users",
  component: UsersList,
});

const sampleUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "2", name: "Editor User", email: "editor@example.com", role: "editor" },
];

function UsersList() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link to="/users/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" /> New User
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {sampleUsers.map((user) => (
          <Link key={user.id} to="/users/$id" params={{ id: user.id }}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UsersIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{user.role}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
