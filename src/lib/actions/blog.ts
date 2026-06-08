"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { blogSchema } from "@/lib/validations/blog";

type State = { error?: string };

function parse(formData: FormData) {
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
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
  _prev: State,
  formData: FormData,
): Promise<State> {
  const user = await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = blogSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.blogPost.create({
      data: { ...parsed.data, authorId: user.id },
    });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/blog`);
  redirect(`/${locale}/admin/blog`);
}

export async function updateBlog(
  locale: string,
  id: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const parsed = blogSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: "invalid" };
  try {
    await prisma.blogPost.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (isUnique(e)) return { error: "slug_taken" };
    throw e;
  }
  revalidatePath(`/${locale}/admin/blog`);
  redirect(`/${locale}/admin/blog`);
}

export async function deleteBlog(locale: string, id: string): Promise<void> {
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath(`/${locale}/admin/blog`);
}
