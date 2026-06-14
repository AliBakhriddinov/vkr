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

test("an admin moderates a submitted testimonial into the carousel", async ({ page }) => {
  await login(page, USERS.client);
  await page.waitForURL("**/cabinet");
  await page.locator("textarea").fill("Команда сделала всё в срок, очень довольны результатом.");
  await page.getByPlaceholder("Например: директор, «Компания»").fill("Руководитель, ООО «Пример»");
  await page.getByRole("button", { name: "Отправить отзыв" }).click();
  await expect(page.getByText("Спасибо! Отзыв ваш отправлен.").first()).toBeVisible();

  await login(page, USERS.admin);
  await page.waitForURL("**/admin");
  await page.goto("/ru/admin/testimonials");
  await page.getByRole("button", { name: "В карусель", exact: true }).first().click();

  await expect(page.getByText("Добавлено в карусель").first()).toBeVisible();
});
