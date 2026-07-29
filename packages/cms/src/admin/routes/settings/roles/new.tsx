import { createRoute, useRouter } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const settingsNewRoleRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/roles/new",
  component: SettingsNewRole,
});

function SettingsNewRole() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.history.back()} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl font-bold">New Role</h1>
      </div>
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label>Role Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button>Create</Button>
      </div>
    </div>
  );
}
