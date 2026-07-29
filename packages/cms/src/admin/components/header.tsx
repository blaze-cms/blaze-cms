import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b px-6">
      <div className="flex-1" />
      <ModeToggle />
      <Button variant="ghost" size="icon" title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
}
