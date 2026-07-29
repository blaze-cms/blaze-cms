import { useEffect, useState } from "react";
import { AlertCircle, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-xs text-destructive-foreground">
      <AlertCircle className="h-3 w-3" />
      <span>You are offline</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 underline hover:no-underline"
      >
        <Wifi className="h-3 w-3" />
      </button>
    </div>
  );
}
