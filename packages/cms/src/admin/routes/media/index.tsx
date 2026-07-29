import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "@/routes/app-layout";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus } from "lucide-react";

export const mediaRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/media",
  component: MediaLibrary,
});

function MediaLibrary() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="mr-1 h-4 w-4" /> New Folder
          </Button>
          <Button>
            <Upload className="mr-1 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-colors hover:bg-accent"
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl text-muted-foreground">🖼</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-xs text-white">image-{i + 1}.jpg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
