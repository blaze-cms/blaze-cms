import { defineConfig } from "@playwright/test";

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  reporter: "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3500/admin/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node ../../scripts/serve-spa.mjs dist 3500",
    cwd: "packages/cms",
    port: 3500,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
