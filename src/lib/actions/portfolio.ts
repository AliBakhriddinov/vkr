"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { portfolioSchema } from "@/lib/validations/portfolio";

type State = { error?: string };

function parse(formData: FormData) {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const projectUrl = String(formData.get("projectUrl") ?? "").trim();
  const technologies = String(formData.get("technologies") ?? "");
  const completedAt = String(formData.get("completedAt") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    clientName: clientName || undefined,
    projectUrl: projectUrl || undefined,
    technologies: technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    completedAt: completedAt ? new Date(completedAt) : null,
    order: Number(formData.get("order") ?? 0) || 0,
    isPublished: formData.get("isPublished") === "on",
  };
}

function isUnique(e: unknown) {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: string }).code === "P2002"
  );
}

export async function createPortfolioItem(
  locale: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = portfolioSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.portfolioItem.create({ data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/portfolio`);
  redirect(`/${locale}/admin/portfolio`);
}

export async function updatePortfolioItem(
  locale: string,
  id: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = portfolioSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.portfolioItem.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/portfolio`);
  redirect(`/${locale}/admin/portfolio`);
}

export async function deletePortfolioItem(
  locale: string,
  id: string,
): Promise<void> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  await prisma.portfolioItem.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/portfolio`);
}
