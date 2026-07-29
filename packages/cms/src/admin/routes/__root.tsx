import { createRootRoute, Outlet } from "@tanstack/react-router";
import { CommandPalette } from "@/components/command-palette";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
    </>
  ),
});
