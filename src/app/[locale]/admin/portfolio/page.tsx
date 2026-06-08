import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pencil, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DeleteWithUndo } from "@/components/admin/delete-with-undo";
import { deletePortfolioItem } from "@/lib/actions/portfolio";

export default async function AdminPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("admin.portfolio");
  const tf = await getTranslations("admin.form");

  const items = await prisma.portfolioItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Button asChild size="sm">
          <Link href="/admin/portfolio/new">
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
              <th className="px-4 py-3 font-medium">{t("clientName")}</th>
              <th className="px-4 py-3 font-medium">{t("order")}</th>
              <th className="px-4 py-3 font-medium">{t("isPublished")}</th>
              <th className="px-4 py-3 text-right font-medium">{tf("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs text-muted-foreground">{i.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {i.clientName ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{i.order}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {i.isPublished ? "✓" : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/portfolio/${i.id}`} aria-label="edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteWithUndo
                      action={deletePortfolioItem.bind(null, locale, i.id)}
                      name={i.title}
                    />
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
