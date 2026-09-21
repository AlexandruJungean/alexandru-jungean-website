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
  await expect(page.locator("main a[href*='/projects/']").first()).toBeVisible();
});

test("footer Cookies leads to working preference controls without a Manage cookies link", async ({ page }) => {
  await page.goto("/");
  const decline = page.locator("#cookie-decline");
  if (await decline.isVisible()) await decline.click();
  await expect(page.locator("#cookie-banner")).toBeHidden();
  await expect(page.locator('footer [data-manage-cookies]')).toHaveCount(0);
  await page.locator('footer a[href="/cookie-policy"]').click();
  await expect(page.locator('#cookie-banner')).toBeHidden();
  await page.getByRole('button',{name:'Manage cookie preferences',exact:true}).click();
  await expect(page.locator("#cookie-banner")).toBeVisible();
  await page.locator('#cookie-decline').click();
  await page.locator('[data-legal-language="ro"]').click();
  await page.getByRole('button',{name:'Gestionează preferințele cookies',exact:true}).click();
  await expect(page.locator("#cookie-banner")).toBeVisible();
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
