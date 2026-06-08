import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { updateBlog } from "@/lib/actions/blog";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.blog");
  const tf = await getTranslations("admin.form");

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("editTitle")}
      </h1>
      <BlogForm
        action={updateBlog.bind(null, locale, id)}
        submitLabel={tf("save")}
        pendingLabel={tf("saving")}
        initial={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          publishedAt: post.publishedAt,
        }}
      />
    </div>
  );
}
