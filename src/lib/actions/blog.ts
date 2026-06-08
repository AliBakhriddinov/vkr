"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { blogSchema } from "@/lib/validations/blog";

type Result = { ok: true } | { ok: false; error: string };

function parse(v: Record<string, unknown>) {
  const publishedAt = String(v.publishedAt ?? "").trim();
  return {
    slug: String(v.slug ?? "").trim(),
    title: String(v.title ?? "").trim(),
    titleEn: String(v.titleEn ?? "").trim() || null,
    excerpt: String(v.excerpt ?? "").trim(),
    excerptEn: String(v.excerptEn ?? "").trim() || null,
    content: String(v.content ?? "").trim(),
    contentEn: String(v.contentEn ?? "").trim() || null,
    tags: String(v.tags ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    publishedAt: publishedAt ? new Date(publishedAt) : null,
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

export async function createBlog(
  locale: string,
  values: Record<string, unknown>,
): Promise<Result> {
  const user = await requireRole(locale, ["ADMIN"]);
  const parsed = blogSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.blogPost.create({ data: { ...parsed.data, authorId: user.id } });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/blog`);
  return { ok: true };
}

export async function updateBlog(
  locale: string,
  id: string,
  values: Record<string, unknown>,
): Promise<Result> {
  await requireRole(locale, ["ADMIN"]);
  const parsed = blogSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    await prisma.blogPost.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { ok: false, error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/blog`);
  return { ok: true };
}

export async function deleteBlog(locale: string, id: string): Promise<void> {
  await requireRole(locale, ["ADMIN"]);
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/blog`);
}
