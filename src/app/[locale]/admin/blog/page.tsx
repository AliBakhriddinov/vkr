import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/lib/actions/blog";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.blog");
  const tf = await getTranslations("admin.form");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">
            <Plus className="size-4" />
            {tf("new")}
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("name")}</th>
              <th className="px-4 py-3 font-medium">{t("publishedAt")}</th>
              <th className="px-4 py-3 text-right font-medium">{tf("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.publishedAt ? dateFmt.format(p.publishedAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/blog/${p.id}`} aria-label="edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteBlog.bind(null, locale, p.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        aria-label="delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
