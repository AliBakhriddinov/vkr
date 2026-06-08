"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations/service";

type Result = { ok: true } | { ok: false; error: string };

function parse(v: Record<string, unknown>) {
  const price = String(v.priceFrom ?? "").trim();
  const iconKey = String(v.iconKey ?? "").trim();
  return {
    slug: String(v.slug ?? "").trim(),
    title: String(v.title ?? "").trim(),
    titleEn: String(v.titleEn ?? "").trim() || null,
    shortDescription: String(v.shortDescription ?? "").trim(),
    shortDescriptionEn: String(v.shortDescriptionEn ?? "").trim() || null,
    fullDescription: String(v.fullDescription ?? "").trim(),
    fullDescriptionEn: String(v.fullDescriptionEn ?? "").trim() || null,
    iconKey: iconKey || undefined,
    priceFrom: price ? Number(price) : null,
    order: Number(v.order ?? 0) || 0,
    isActive: v.isActive === true || v.isActive === "on",
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

export async function createService(
  locale: string,
  values: Record<string, unknown>,
): Promise<Result> {
  await requireRole(locale, ["ADMIN"]);
  const parsed = serviceSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.service.create({ data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/services`);
  return { ok: true };
}

export async function updateService(
  locale: string,
  id: string,
  values: Record<string, unknown>,
): Promise<Result> {
  await requireRole(locale, ["ADMIN"]);
  const parsed = serviceSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.service.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/services`);
  return { ok: true };
}

export async function deleteService(locale: string, id: string): Promise<void> {
  await requireRole(locale, ["ADMIN"]);
  await prisma.service.delete({ where: { id } });
  const rest = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await prisma.$transaction(
    rest.map((row, i) =>
      prisma.service.update({ where: { id: row.id }, data: { order: i + 1 } }),
    ),
  );
  revalidatePath(`/${locale}/admin/services`);
}
