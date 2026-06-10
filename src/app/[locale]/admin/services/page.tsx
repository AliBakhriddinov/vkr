import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pencil, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DeleteWithUndo } from "@/components/admin/delete-with-undo";
import { deleteService } from "@/lib/actions/services";

export default async function AdminServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("admin.services");
  const tf = await getTranslations("admin.form");

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const priceFmt = new Intl.NumberFormat(locale);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Button asChild size="sm">
          <Link href="/admin/services/new">
            <Plus className="size-4" />
            {tf("new")}
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("name")}</th>
              <th className="px-4 py-3 font-medium">{t("priceFrom")}</th>
              <th className="px-4 py-3 font-medium">{t("order")}</th>
              <th className="px-4 py-3 font-medium">{t("isActive")}</th>
              <th className="px-4 py-3 text-right font-medium">{tf("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.priceFrom ? `${priceFmt.format(s.priceFrom)} ₽` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.order}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.isActive ? "✓" : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/services/${s.id}`} aria-label="edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteWithUndo
                      action={deleteService.bind(null, locale, s.id)}
                      name={s.title}
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
