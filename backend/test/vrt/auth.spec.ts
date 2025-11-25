import { test, expect } from "@playwright/test";

test("auth register VRT", async ({ page }) => {
  await page.goto("/api/auth/register"); // Assume JSON rendered for screenshot
  await expect(page).toHaveScreenshot("register-form.png", { fullPage: true });
});
