import { type Page } from "@playwright/test";

export const USERS = {
  admin: { email: "admin@pixelwave.test", password: "admin123" },
  client: { email: "client@pixelwave.test", password: "client123" },
};

export async function login(
  page: Page,
  user: { email: string; password: string },
  locale = "ru",
) {
  await page.goto(`/${locale}/sign-in`);
  await page.locator('input[type="email"]').fill(user.email);
  await page.locator('input[type="password"]').fill(user.password);
  await page.getByRole("button", { name: "Войти" }).click();
}
