"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations/service";

type State = { error?: string };

function parse(formData: FormData) {
  const price = String(formData.get("priceFrom") ?? "").trim();
  const iconKey = String(formData.get("iconKey") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    fullDescription: String(formData.get("fullDescription") ?? "").trim(),
    iconKey: iconKey || undefined,
    priceFrom: price ? Number(price) : null,
    order: Number(formData.get("order") ?? 0) || 0,
    isActive: formData.get("isActive") === "on",
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
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = serviceSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.service.create({ data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/services`);
  redirect(`/${locale}/admin/services`);
}

export async function updateService(
  locale: string,
  id: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = serviceSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.service.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/services`);
  redirect(`/${locale}/admin/services`);
}

export async function deleteService(locale: string, id: string): Promise<void> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  await prisma.service.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/services`);
}
