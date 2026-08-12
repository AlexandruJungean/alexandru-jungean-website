import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./axe.js";

test("homepage renders the primary heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
});

test("@accessibility homepage has no WCAG AA violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});

test("@accessibility services page has no WCAG AA violations", async ({ page }) => {
  await page.goto("/services.html");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});
