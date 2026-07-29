import { test, expect } from "@playwright/test";

test.describe("Blaze CMS Admin Panel", () => {
  test("login page loads and shows sign-in form", async ({ page }) => {
    await page.goto("login");

    await expect(page.getByText("Blaze CMS")).toBeVisible({ timeout: 10000 });
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

    const title = await page.title();
    expect(title).toBe("Blaze CMS");
  });

  test("dashboard page is accessible when unauthenticated", async ({ page }) => {
    await page.goto(".");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Welcome to Blaze CMS")).toBeVisible();
  });

  test("sidebar has section headings", async ({ page }) => {
    await page.goto(".");

    await expect(page.getByText("Overview")).toBeVisible();
    await expect(page.getByText("Content")).toBeVisible();
    await expect(page.getByText("System")).toBeVisible();
  });

  test("sidebar navigation links work", async ({ page }) => {
    await page.goto(".");

    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.getByRole("link", { name: "Collections" }).click();
    await expect(page.getByRole("heading", { name: "Collections" })).toBeVisible();

    await page.getByRole("link", { name: /^Globals$/ }).click();
    await expect(page.getByRole("heading", { name: "Globals" })).toBeVisible();
  });

  test("collections page lists schemas from registry", async ({ page }) => {
    await page.goto("collections");

    await expect(page.getByRole("link", { name: /Post.*\/posts/i })).toBeVisible();
    await expect(page.getByText("/posts")).toBeVisible();
  });

  test("globals page lists schemas from registry", async ({ page }) => {
    await page.goto("globals");

    await expect(page.getByRole("link", { name: /Homepage.*\/homepage/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Site Settings.*\/site-settings/i })).toBeVisible();
  });
});
