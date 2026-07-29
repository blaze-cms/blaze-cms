import { createRoute } from "@tanstack/react-router";
import { Plus, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appLayoutRoute } from "@/routes/app-layout";

export const apiTokensRoute = createRoute({
  component: ApiTokens,
  getParentRoute: () => appLayoutRoute,
  path: "/settings/api-tokens",
});

function ApiTokens() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Tokens</h1>
        <Button><Plus className="mr-1 h-4 w-4" /> New Token</Button>
      </div>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 text-muted-foreground">
          <Key className="h-5 w-5" />
          <p className="text-sm">No API tokens configured.</p>
        </CardContent>
      </Card>
    </div>
  );
}
