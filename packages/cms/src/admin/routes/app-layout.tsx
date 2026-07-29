import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import { AppLayout } from "@/components/app-layout";

export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});
