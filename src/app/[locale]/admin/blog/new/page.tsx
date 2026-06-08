import { getTranslations, setRequestLocale } from "next-intl/server";

import { BlogForm } from "@/components/admin/blog-form";
import { createBlog } from "@/lib/actions/blog";

export default async function NewBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.blog");
  const tf = await getTranslations("admin.form");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("new")}
      </h1>
      <BlogForm
        action={createBlog.bind(null, locale)}
        listHref="/admin/blog"
        submitLabel={tf("create")}
        pendingLabel={tf("creating")}
      />
    </div>
  );
}
