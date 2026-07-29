import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

const commands = [
  { label: "Go to Dashboard", path: "/" },
  { label: "Collections", path: "/collections" },
  { label: "Globals", path: "/globals" },
  { label: "Media Library", path: "/media" },
  { label: "Users", path: "/users" },
  { label: "Roles", path: "/roles" },
  { label: "Settings", path: "/settings" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const handleSelect = useCallback(
    (path: string) => {
      navigate({ to: path });
      setOpen(false);
      setQuery("");
    },
    [navigate],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background shadow-2xl">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.path}
              className="flex w-full items-center rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onClick={() => handleSelect(cmd.path)}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
