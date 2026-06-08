import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { UserRole } from "@/generated/prisma/enums";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/sign-in`);
  return user;
}

export async function requireRole(locale: string, roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/sign-in`);
  if (!roles.includes(user.role)) redirect(`/${locale}`);
  return user;
}
