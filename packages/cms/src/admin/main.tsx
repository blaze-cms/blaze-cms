import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ErrorBoundary } from "@/components/error-boundary";
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
      {import.meta.env.DEV && <ReactQueryDevtools />}
      <ThemeProvider defaultTheme="system" storageKey="blaze-cms-theme">
        <AuthProvider>
          <DataProviderWrapper>
            <ToastProvider>
              <ErrorBoundary>
                <RouterProvider router={router} />
              </ErrorBoundary>
            </ToastProvider>
          </DataProviderWrapper>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
