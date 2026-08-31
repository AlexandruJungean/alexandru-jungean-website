import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./axe.js";

test("contact page has clickable phone and email", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator('a[href="tel:+40757673677"]').first()).toBeVisible();
  await expect(page.locator('a[href="mailto:alex.jungean@gmail.com"]').first()).toBeVisible();
});

test("404 page offers a way back home", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test("projects index lists case studies", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("a[href*='/projects/']").first()).toBeVisible();
});

test("footer manage cookies reopens the banner", async ({ page }) => {
  await page.goto("/");
  const decline = page.locator("#cookie-decline");
  if (await decline.isVisible()) await decline.click();
  await expect(page.locator("#cookie-banner")).toBeHidden();
  await page.getByRole("link", { name: /manage cookies/i }).first().click();
  await expect(page.locator("#cookie-banner")).toBeVisible();
});

test("nav shows unseen project and tool counts", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("seen_catalog_v1"));
  await page.reload();
  await expect(page.locator('a.nav-link[href="/projects"] .nav-unseen-count')).toHaveText("13");
  await expect(page.locator('a.nav-link[href="/tools"] .nav-unseen-count')).toHaveText("5");
});

test("wizard starts and lists intake services", async ({ page }) => {
  await page.goto("/start");
  await expect(page.locator("h1").first()).toBeVisible();
  const decline = page.locator("#cookie-decline");
  if (await decline.isVisible()) await decline.click();
  await page.getByRole("button", { name: /let's start/i }).click();
  await expect(page.getByRole("heading", { name: "About You" })).toBeVisible();
  await page.locator("#f-name").fill("Test User");
  await page.locator("#f-email").fill("test@example.com");
  await page.getByRole("button", { name: /^next/i }).click();
  await expect(page.locator("#service-cards .scard-title", { hasText: "Website" })).toBeVisible();
});

test("@accessibility contact page has no WCAG AA violations", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});

test("@accessibility 404 page has no WCAG AA violations", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});

test("@accessibility projects page has no WCAG AA violations", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});
