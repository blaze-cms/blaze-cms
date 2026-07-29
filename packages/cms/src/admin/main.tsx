import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth";
import { DataProviderWrapper } from "@/lib/providers/index";
import { ToastProvider } from "@/components/toast-provider";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createBrowserHistory } from "@tanstack/history";
import { routeTree } from "@/router";
import "./index.css";

function stripBase(raw: string, b: string): string {
  return raw.startsWith(b) ? "/" + raw.slice(b.length) : raw;
}

const queryClient = new QueryClient();
const base: string = import.meta.env.BASE_URL || "/";
const router = createRouter({
  routeTree,
  history: createBrowserHistory({
    parseLocation: () => {
      const p = stripBase(window.location.pathname + window.location.search + window.location.hash, base);
      const url = new URL(p, "http://localhost");
      return { href: p, pathname: url.pathname, search: url.search, hash: url.hash, state: window.history.state };
    },
    createHref: (href: string) => {
      const full = base.replace(/\/$/, "") + "/" + href.replace(/^\//, "");
      return full.replace(/\/+$/, "") || "/";
    },
  }),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="blaze-cms-theme">
        <AuthProvider>
          <DataProviderWrapper>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </DataProviderWrapper>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
