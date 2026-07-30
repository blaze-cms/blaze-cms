import { defineConfig } from "@blazing-cms/cms";

export default defineConfig({
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "your-project-id",
  },
  projectName: "Blazing CMS Playground",
});
