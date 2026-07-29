import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { Upload, FolderPlus, Image as ImageIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataProvider } from "@/lib/providers/context";
import { appLayoutRoute } from "@/routes/app-layout";

export const mediaRoute = createRoute({
  component: MediaLibrary,
  getParentRoute: () => appLayoutRoute,
  path: "/media",
});

function MediaLibrary() {
  const provider = useDataProvider();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaItems, isLoading } = useQuery({
    queryFn: async () => {
      const result = await provider.findMany("media", { limit: 50 });
      return result.data;
    },
    queryKey: ["media"],
  });

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      await provider.create("media", {
        createdAt: new Date().toISOString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url,
      });
      addToast({ description: `${file.name} uploaded.`, title: "Uploaded" });
      await queryClient.invalidateQueries({ queryKey: ["media"] });
    } catch (err) {
      addToast({ description: String(err), title: "Upload failed", variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
          <Button variant="outline" disabled>
            <FolderPlus className="mr-1 h-4 w-4" /> New Folder
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-1 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : mediaItems && mediaItems.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {mediaItems.map((item) => {
            const name = (item.name ?? item.id) as string;
            const url = item.url as string | undefined;
            return (
              <div
                key={item.id as string}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-colors hover:bg-accent"
              >
                <div className="flex h-full items-center justify-center">
                  {url ? (
                    <img src={url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs text-white">{name}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No media found</h2>
          <p className="text-muted-foreground">Upload your first file to get started.</p>
        </div>
      )}
    </div>
  );
}
