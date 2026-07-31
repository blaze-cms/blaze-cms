import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import { schemaWriterPlugin } from "./vite-plugins/schema-writer";

export default defineConfig({
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, "../../dist/admin"),
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/.pnpm/") || id.includes("node_modules/")) {
            if (
              id.includes("@tiptap") ||
              id.includes("prosemirror") ||
              id.includes("lowlight") ||
              id.includes("highlight")
            )
              return "editor-rich";
            if (id.includes("codemirror") || id.includes("@codemirror")) return "editor-code";
            if (
              id.includes("react-markdown") ||
              id.includes("remark-") ||
              id.includes("rehype-") ||
              id.includes("unified") ||
              id.includes("mdast") ||
              id.includes("hast") ||
              id.includes("micromark") ||
              id.includes("decode-named-character-reference") ||
              id.includes("character-entities") ||
              id.includes("trim-lines") ||
              id.includes("comma-separated-tokens") ||
              id.includes("property-information") ||
              id.includes("space-separated-tokens") ||
              id.includes("hast-util-") ||
              id.includes("html-void-") ||
              id.includes("zwitch") ||
              id.includes("ccount") ||
              id.includes("number-")
            )
              return "editor-markdown";
            if (id.includes("firebase/") || id.includes("@firebase")) return "firebase";
            if (id.includes("react/") || id.includes("react-dom") || id.includes("scheduler"))
              return "react-vendor";
            if (
              id.includes("@tanstack/react-router") ||
              id.includes("@tanstack/react-query") ||
              id.includes("@tanstack/query")
            )
              return "router";
            if (id.includes("lucide-react")) return "icons";
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "@tiptap/core",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-link",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-underline",
      "@tiptap/extension-code-block-lowlight",
      "lowlight",
      "codemirror",
      "@codemirror/view",
      "@codemirror/state",
      "@codemirror/language",
      "@codemirror/commands",
      "@codemirror/lang-javascript",
      "@codemirror/lang-json",
      "@codemirror/lang-css",
      "@codemirror/lang-html",
      "@codemirror/lang-markdown",
      "@codemirror/lang-xml",
      "react-markdown",
      "remark-gfm",
    ],
  },
  plugins: [react(), tailwindcss(), schemaWriterPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  root: path.resolve(__dirname),
});
