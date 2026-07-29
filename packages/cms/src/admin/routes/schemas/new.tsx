import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Construction } from "lucide-react";

export const newSchemaRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/schemas/new",
  component: NewSchema,
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
