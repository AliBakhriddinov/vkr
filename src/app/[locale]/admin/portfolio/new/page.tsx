import { getTranslations, setRequestLocale } from "next-intl/server";

import { PortfolioForm } from "@/components/admin/portfolio-form";
import { createPortfolioItem } from "@/lib/actions/portfolio";

export default async function NewPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.portfolio");
  const tf = await getTranslations("admin.form");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("new")}
      </h1>
      <PortfolioForm
        action={createPortfolioItem.bind(null, locale)}
        listHref="/admin/portfolio"
        submitLabel={tf("create")}
        pendingLabel={tf("creating")}
      />
    </div>
  );
}
