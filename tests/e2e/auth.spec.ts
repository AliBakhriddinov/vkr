import { test, expect } from "@playwright/test";
import { login, USERS } from "./helpers";

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
