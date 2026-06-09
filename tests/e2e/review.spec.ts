import { test, expect } from "@playwright/test";
import { login, USERS } from "./helpers";

test("a client can submit a testimonial", async ({ page }) => {
  await login(page, USERS.client);
  await page.waitForURL("**/cabinet");

  await page.locator("textarea").fill("Отличная работа, рекомендую команду PixelWave!");
  await page.getByPlaceholder("Например: директор, «Компания»").fill("Директор, ООО «Тест»");
  await page.getByRole("button", { name: "Отправить отзыв" }).click();

  await expect(page.getByText("Спасибо! Отзыв ваш отправлен.").first()).toBeVisible();
});
