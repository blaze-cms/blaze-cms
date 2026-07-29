import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { AuthProvider } from "@/lib/auth";
import { DataProviderWrapper } from "@/lib/providers/index";
import { routeTree } from "@/router";

import "./index.css";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

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
