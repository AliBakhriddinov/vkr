import { test, expect } from "@playwright/test";

test("a visitor can submit a project request", async ({ page }) => {
  await page.goto("/ru");

  const form = page.locator("#contacts");
  await form.getByPlaceholder("Как к вам обращаться").fill("Тест Тестов");
  await form.getByPlaceholder("you@company.com").fill("test.e2e@example.com");
  await form
    .getByPlaceholder("Коротко опишите задачу")
    .fill("Хотим заказать новый сайт для компании.");
  await form.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByText("Заявка принята")).toBeVisible();
});
