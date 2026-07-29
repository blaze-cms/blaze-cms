import { createRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";

import { appLayoutRoute } from "@/routes/app-layout";

export const newSchemaRoute = createRoute({
  component: NewSchema,
  getParentRoute: () => appLayoutRoute,
  path: "/schemas/new",
});

function NewSchema() {
  if (import.meta.env.PROD) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Construction className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Schema Builder</h2>
        <p className="max-w-md text-muted-foreground">
          The schema builder is only available in local development mode.
        </p>
      </div>
    );
  }

  return <div>{/* Dev schema creation form — implemented as part of dev mode */}</div>;
}
