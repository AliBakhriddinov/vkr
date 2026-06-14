import { test, expect } from "@playwright/test";
import { login, USERS } from "./helpers";

test("a new visitor can register and lands on the cabinet", async ({ page }) => {
  const email = `e2e-signup-${Date.now()}@pixelwave.test`;
  await page.goto("/ru/sign-up");
  await page.locator('input[autocomplete="name"]').fill("Новый Клиент");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();

  await page.waitForURL("**/cabinet");
  await expect(page.getByRole("heading", { name: "Личный кабинет" })).toBeVisible();
});

test("admin signs in and lands on the dashboard", async ({ page }) => {
  await login(page, USERS.admin);
  await page.waitForURL("**/admin");
  await expect(page.getByRole("heading", { name: "Сводка" })).toBeVisible();
});

test("client signs in and lands on the cabinet", async ({ page }) => {
  await login(page, USERS.client);
  await page.waitForURL("**/cabinet");
  await expect(page.getByRole("heading", { name: "Личный кабинет" })).toBeVisible();
});

test("a wrong password is rejected", async ({ page }) => {
  await login(page, { email: USERS.admin.email, password: "definitely-wrong" });
  await expect(page.getByText("Неверный email или пароль")).toBeVisible();
  await expect(page).toHaveURL(/\/sign-in/);
});
