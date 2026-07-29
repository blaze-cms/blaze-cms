import { createRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/app-layout";
import { rootRoute } from "@/routes/__root";

export const appLayoutRoute = createRoute({
  component: AppLayout,
  getParentRoute: () => rootRoute,
  id: "app",
});
