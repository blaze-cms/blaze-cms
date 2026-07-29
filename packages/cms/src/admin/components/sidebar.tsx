import { cn } from "@/lib/utils";
import { isDevMode } from "@/lib/backend-mode";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
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

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Collections", icon: FileText, href: "/collections" },
  { label: "Globals", icon: Globe, href: "/globals" },
  { label: "Media", icon: Image, href: "/media" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Roles", icon: Shield, href: "/roles" },
  ...(isDevMode() ? [{ label: "Schemas", icon: FileJson, href: "/schemas" } satisfies NavItem] : []),
  { label: "Settings", icon: Settings, href: "/settings" },
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
