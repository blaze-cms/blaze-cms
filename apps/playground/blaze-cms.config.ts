import { defineConfig } from "@blaze-cms/cms";

export default defineConfig({
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "your-project-id",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
