import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@arche-cms.com";
const ADMIN_PW = "admin123";

async function login(page: import("@playwright/test").Page) {
  await page.goto("login");
  if (await page.getByLabel("Email").isVisible()) {
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PW);
    await page.getByRole("button", { name: "Sign In" }).click();
  }
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 15000 });
}

// ── Auth ──

test.describe("Auth", () => {
  test("login page loads and shows sign-in form", async ({ page }) => {
    await page.goto("login");
    await expect(page.getByText("Blazing CMS")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Sign in to your dashboard")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("login page has input fields with correct placeholders", async ({ page }) => {
    await page.goto("login");
    await expect(page.getByPlaceholder("admin@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  });

  test("page has correct document title", async ({ page }) => {
    await page.goto("login");
    expect(await page.title()).toBe("Blazing CMS");
  });

  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Sign in to your dashboard")).toBeVisible();
  });

  test("login with valid credentials succeeds", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});

// ── Navigation ──

test.describe("Navigation", () => {
  test("sidebar has section headings", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Overview", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("System", { exact: true }).first()).toBeVisible();
  });

  test("sidebar navigation links work", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: "All Collections" }).click();
    await expect(page.getByRole("heading", { name: "Collections" })).toBeVisible();

    await page.getByRole("link", { name: "All Globals" }).click();
    await expect(page.getByRole("heading", { name: "Globals" })).toBeVisible();
  });
});

// ── Collections CRUD ──

test.describe("Collections", () => {
  const COLLECTIONS = [
    { label: "Array Field", plural: "Array Fields", slug: "array" },
    { label: "Boolean Field", plural: "Boolean Fields", slug: "boolean" },
    { label: "Component Field", plural: "Component Fields", slug: "component" },
    { label: "Date Field", plural: "Date Fields", slug: "date" },
    { label: "Dynamic Zone Field", plural: "Dynamic Zone Fields", slug: "dynamic-zone" },
    { label: "Group Field", plural: "Group Fields", slug: "group" },
    { label: "Media Field", plural: "Media Fields", slug: "media-test" },
    { label: "Number Field", plural: "Number Fields", slug: "number" },
    { label: "Post", plural: "Posts", slug: "posts" },
    { label: "Relation Field", plural: "Relation Fields", slug: "relation" },
    { label: "Repeater Field", plural: "Repeater Fields", slug: "repeater" },
    { label: "Rich Text Field", plural: "Rich Text Fields", slug: "rich-text" },
    { label: "Select Field", plural: "Select Fields", slug: "select" },
    { label: "Text Field", plural: "Text Fields", slug: "text" },
  ] as const;

  test("collections listing shows all 14 schemas", async ({ page }) => {
    await login(page);
    await page.goto("collections");
    for (const c of COLLECTIONS) {
      await expect(page.getByText(`/${c.slug}`)).toBeVisible();
      await expect(page.getByText(c.plural).first()).toBeVisible();
    }
  });

  for (const col of COLLECTIONS) {
    test(`${col.slug} detail page loads correctly`, async ({ page }) => {
      await login(page);
      await page.goto(`collections/${col.slug}`);
      await expect(page.getByRole("heading", { name: col.label })).toBeVisible();
      await expect(page.getByRole("link", { name: /New Entry/i })).toBeVisible();
    });
  }

  test("create entries shows in detail list", async ({ page }) => {
    await login(page);
    await page.goto("collections/new/text");
    await page.getByLabel("Title*").fill("List Visibility Entry");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Entry created")).toBeVisible({ timeout: 10000 });
    await page.goto("collections/text");
    await expect(page.getByText("List Visibility Entry").first()).toBeVisible();
  });
});

// ── Per-Schema Create + Update (CR without D) ──

function schemaCreateTests() {
  const SUITE: {
    slug: string;
    title: string;
    fill?: (page: import("@playwright/test").Page) => Promise<void>;
  }[] = [
    {
      fill: async (page) => {
        await page.getByLabel("Text Field").fill("Hello");
      },
      slug: "text",
      title: "CRUD Text",
    },
    {
      fill: async (page) => {
        await page.getByLabel("Number Field").fill("99");
      },
      slug: "number",
      title: "CRUD Number",
    },
    { slug: "boolean", title: "CRUD Boolean" },
    {
      fill: async (page) => {
        await page.getByLabel("Date Field").fill("2026-07-29");
      },
      slug: "date",
      title: "CRUD Date",
    },
    {
      fill: async (page) => {
        await page.getByLabel("Select Field").selectOption("option-b");
      },
      slug: "select",
      title: "CRUD Select",
    },
    { slug: "rich-text", title: "CRUD RichText" },
    {
      fill: async (page) => {
        await page.getByLabel("Content").fill("Post body");
        await page.getByLabel("Excerpt").fill("Post excerpt");
        await page.getByLabel("Category").selectOption("news");
      },
      slug: "posts",
      title: "CRUD Post",
    },
    { slug: "component", title: "CRUD Component" },
    { slug: "repeater", title: "CRUD Repeater" },
    { slug: "array", title: "CRUD Array" },
    { slug: "group", title: "CRUD Group" },
    { slug: "dynamic-zone", title: "CRUD DynamicZone" },
    { slug: "relation", title: "CRUD Relation" },
    { slug: "media-test", title: "CRUD Media" },
  ];

  for (const s of SUITE) {
    test(`create + update ${s.slug} entry`, async ({ page }) => {
      await login(page);
      const baseTitle = `${s.title} ${Date.now()}`;

      // CREATE
      await page.goto(`collections/new/${s.slug}`);
      await expect(page.getByRole("heading", { name: /New / })).toBeVisible();
      await page.getByLabel("Title*").fill(baseTitle);
      if (s.fill) await s.fill(page);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Entry created")).toBeVisible({ timeout: 10000 });

      // Verify we landed on the edit page
      await expect(page.getByText(`Edit`)).toBeVisible();

      // UPDATE — change the title
      const updatedTitle = `${baseTitle} (updated)`;
      await page.getByLabel("Title*").fill(updatedTitle);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Entry has been updated.")).toBeVisible({ timeout: 10000 });

      // READ BACK on listing page
      await page.goto(`collections/${s.slug}`);
      await expect(page.getByText(updatedTitle).first()).toBeVisible();
    });
  }
}

schemaCreateTests();

// ── Globals ──

test.describe("Globals", () => {
  const GLOBALS = [
    { label: "Homepage", slug: "homepage" },
    { label: "Site Settings", slug: "site-settings" },
    { label: "Text Field", slug: "text" },
    { label: "Number Field", slug: "number" },
    { label: "Boolean Field", slug: "boolean" },
    { label: "Select Field", slug: "select" },
    { label: "Rich Text Field", slug: "rich-text" },
    { label: "Code Field", slug: "code" },
    { label: "JSON Field", slug: "json" },
    { label: "Color Field", slug: "color" },
    { label: "Email Field", slug: "email" },
    { label: "URL Field", slug: "url" },
    { label: "Textarea Field", slug: "textarea" },
    { label: "Checkbox Field", slug: "checkbox" },
    { label: "Multi-Select Field", slug: "multi-select" },
    { label: "Radio Field", slug: "radio" },
    { label: "Markdown Field", slug: "markdown" },
    { label: "DateTime Field", slug: "datetime" },
    { label: "Password Field", slug: "password" },
    { label: "Slug Field", slug: "slug" },
    { label: "Date Field", slug: "date" },
    { label: "Media Field", slug: "media-settings" },
  ] as const;

  test("globals listing shows all 22 schemas", async ({ page }) => {
    await login(page);
    await page.goto("globals");
    for (const g of GLOBALS) {
      await expect(page.getByText(`/${g.slug}`, { exact: true })).toBeVisible();
    }
  });

  for (const g of GLOBALS) {
    test(`${g.slug} detail page loads correctly`, async ({ page }) => {
      await login(page);
      await page.goto(`globals/${g.slug}`);
      await expect(page.getByRole("heading", { name: g.label })).toBeVisible();
    });
  }

  test("homepage detail page shows fields", async ({ page }) => {
    await login(page);
    await page.goto("globals/homepage");
    await expect(page.getByRole("heading", { name: "Homepage" })).toBeVisible();
    await expect(page.getByLabel("Hero Title")).toBeVisible();
    await expect(page.getByLabel("Hero Subtitle")).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Show Featured Posts" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Featured Post" })).toBeVisible();
  });

  test("site-settings detail page shows fields", async ({ page }) => {
    await login(page);
    await page.goto("globals/site-settings");
    await expect(page.getByRole("heading", { name: "Site Settings" })).toBeVisible();
    await expect(page.getByLabel("Site Name*")).toBeVisible();
    await expect(page.getByLabel("Tagline")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
    await expect(page.getByLabel("Primary Color")).toBeVisible();
    await expect(page.getByLabel("Secondary Color")).toBeVisible();
    await expect(page.getByLabel("Enable Comments")).toBeVisible();
  });

  test("save a global", async ({ page }) => {
    await login(page);
    await page.goto("globals/homepage");
    await page.getByLabel("Hero Title").fill("E2E Hero");
    await page.getByLabel("Hero Subtitle").fill("Test subtitle");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Global has been saved.")).toBeVisible({ timeout: 10000 });
  });
});
