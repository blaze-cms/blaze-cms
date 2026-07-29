import { defineConfig } from "@blazing-cms/cms";

export default defineConfig({
  projectName: "Blazing CMS Playground",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "your-project-id",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
