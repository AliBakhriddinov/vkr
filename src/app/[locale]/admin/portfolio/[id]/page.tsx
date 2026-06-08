import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { updatePortfolioItem } from "@/lib/actions/portfolio";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.portfolio");
  const tf = await getTranslations("admin.form");

  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("editTitle")}
      </h1>
      <PortfolioForm
        action={updatePortfolioItem.bind(null, locale, id)}
        listHref="/admin/portfolio"
        submitLabel={tf("save")}
        pendingLabel={tf("saving")}
        initial={{
          slug: item.slug,
          title: item.title,
          titleEn: item.titleEn,
          summary: item.summary,
          summaryEn: item.summaryEn,
          description: item.description,
          descriptionEn: item.descriptionEn,
          clientName: item.clientName,
          clientNameEn: item.clientNameEn,
          projectUrl: item.projectUrl,
          technologies: item.technologies,
          completedAt: item.completedAt,
          order: item.order,
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
