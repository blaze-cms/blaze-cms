import { createRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appLayoutRoute } from "@/routes/app-layout";

export const userDetailRoute = createRoute({
  component: UserDetail,
  getParentRoute: () => appLayoutRoute,
  path: "/users/$id",
});

function UserDetail() {
  const { id } = userDetailRoute.useParams();
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => router.history.back()} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive"><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
          <Button><Save className="mr-1 h-4 w-4" /> Save</Button>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
