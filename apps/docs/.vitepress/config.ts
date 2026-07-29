import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Blazing CMS",
  description: "Schema-defined CMS for Firebase",
  themeConfig: {
    logo: false,
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/reference/packages" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Defining Schemas", link: "/guide/schemas" },
            { text: "Admin Panel", link: "/guide/admin" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Packages", link: "/reference/packages" },
            { text: "CLI", link: "/reference/cli" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/blaze-cms/blaze-cms" },
    ],
  },
});
