import { createRoute } from "@tanstack/react-router";

import { appLayoutRoute } from "@/routes/app-layout";

export const indexRoute = createRoute({
  component: Dashboard,
  getParentRoute: () => appLayoutRoute,
  path: "/",
});

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome to Blaze CMS.</p>
    </div>
  );
}
