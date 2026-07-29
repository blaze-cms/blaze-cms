import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Globe,
  Image,
  Users,
  Shield,
  FileJson,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { isDevMode } from "@/lib/backend-mode";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/collections", icon: FileText, label: "Collections" },
  { href: "/globals", icon: Globe, label: "Globals" },
  { href: "/media", icon: Image, label: "Media" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/roles", icon: Shield, label: "Roles" },
  ...(isDevMode() ? [{ href: "/schemas", icon: FileJson, label: "Schemas" } satisfies NavItem] : []),
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar-background text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className={cn("flex items-center border-b border-sidebar-border px-4 py-4", collapsed && "justify-center")}>
        {!collapsed && <span className="text-lg font-bold">Blaze CMS</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "" : "ml-auto",
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
              // active state via [&.active] for TanStack Router
              "[&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
