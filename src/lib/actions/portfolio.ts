"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { portfolioSchema } from "@/lib/validations/portfolio";

type Result = { ok: true } | { ok: false; error: string };

function parse(v: Record<string, unknown>) {
  const clientName = String(v.clientName ?? "").trim();
  const projectUrl = String(v.projectUrl ?? "").trim();
  const technologies = String(v.technologies ?? "");
  const completedAt = String(v.completedAt ?? "").trim();
  return {
    slug: String(v.slug ?? "").trim(),
    title: String(v.title ?? "").trim(),
    titleEn: String(v.titleEn ?? "").trim() || null,
    summary: String(v.summary ?? "").trim(),
    summaryEn: String(v.summaryEn ?? "").trim() || null,
    description: String(v.description ?? "").trim(),
    descriptionEn: String(v.descriptionEn ?? "").trim() || null,
    clientName: clientName || undefined,
    clientNameEn: String(v.clientNameEn ?? "").trim() || null,
    projectUrl: projectUrl || undefined,
    technologies: technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    completedAt: completedAt ? new Date(completedAt) : null,
    order: Number(v.order ?? 0) || 0,
    isPublished: v.isPublished === true || v.isPublished === "on",
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
  values: Record<string, unknown>,
): Promise<Result> {
  await requireRole(locale, ["ADMIN"]);
  const parsed = portfolioSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.portfolioItem.create({ data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/portfolio`);
  return { ok: true };
}

export async function updatePortfolioItem(
  locale: string,
  id: string,
  values: Record<string, unknown>,
): Promise<Result> {
  await requireRole(locale, ["ADMIN"]);
  const parsed = portfolioSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.portfolioItem.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/portfolio`);
  return { ok: true };
}

export async function deletePortfolioItem(
  locale: string,
  id: string,
): Promise<void> {
  await requireRole(locale, ["ADMIN"]);
  await prisma.portfolioItem.delete({ where: { id } });
  const rest = await prisma.portfolioItem.findMany({
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await prisma.$transaction(
    rest.map((row, i) =>
      prisma.portfolioItem.update({
        where: { id: row.id },
        data: { order: i + 1 },
      }),
    ),
  );
  revalidatePath(`/${locale}/admin/portfolio`);
}
