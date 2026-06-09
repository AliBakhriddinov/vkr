import { test, expect } from "@playwright/test";
import { login, USERS } from "./helpers";

test("admin changes an application status and it is recorded in history", async ({ page }) => {
  await login(page, USERS.admin);
  await page.waitForURL("**/admin");

  await page.goto("/ru/admin/applications");
  await page.getByRole("link", { name: "Открыть" }).first().click();
  await page.waitForURL(/\/admin\/applications\/[^/]+$/);

  const statusSelect = page.getByRole("combobox");
  const current = (await statusSelect.textContent())?.trim() ?? "";
  const target = current === "В работе" ? "Выполнена" : "В работе";

  await statusSelect.click();
  await page.getByRole("option", { name: target, exact: true }).click();

  const comment = `e2e проверка статуса ${Date.now()}`;
  await page.getByPlaceholder("Комментарий для клиента (необязательно)").fill(comment);
  await page.getByRole("button", { name: "Сохранить" }).click();

  const history = page.locator("section", { hasText: "История статусов" });
  await expect(history.getByText(comment)).toBeVisible();
  await expect(history.getByText(target).first()).toBeVisible();
});
