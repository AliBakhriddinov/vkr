import { test, expect } from "@playwright/test";

test("switching the language updates the URL and the navigation", async ({ page }) => {
  await page.goto("/ru");
  await expect(page.locator("header").getByRole("link", { name: "Услуги" })).toBeVisible();

  await page.getByRole("button", { name: "Сменить язык" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();

  await page.waitForURL("**/en");
  await expect(page.locator("header").getByRole("link", { name: "Services" })).toBeVisible();
});
