import { test, expect } from "@playwright/test";

test("POS page VRT for cashier", async ({ page }) => {
  await page.goto("/pos");
  await expect(page.locator('[data-testid="pos-header"]')).toBeVisible();
  await expect(page).toHaveScreenshot("pos-cashier-view.png");
});
