import { createRoute, Link } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Key, Puzzle, Users, Shield, Webhook } from "lucide-react";

export const settingsIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings",
  component: SettingsList,
});

const settingsItems = [
  { label: "API Tokens", icon: Key, href: "/settings/api-tokens" },
  { label: "Plugins", icon: Puzzle, href: "/settings/plugins" },
  { label: "Users", icon: Users, href: "/settings/users" },
  { label: "Roles", icon: Shield, href: "/settings/roles" },
  { label: "Webhooks", icon: Webhook, href: "/settings/webhooks" },
];

function SettingsList() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
