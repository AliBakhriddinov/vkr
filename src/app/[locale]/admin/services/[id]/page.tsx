import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";
import { updateService } from "@/lib/actions/services";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.services");
  const tf = await getTranslations("admin.form");

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("editTitle")}
      </h1>
      <ServiceForm
        action={updateService.bind(null, locale, id)}
        listHref="/admin/services"
        submitLabel={tf("save")}
        pendingLabel={tf("saving")}
        initial={{
          slug: service.slug,
          title: service.title,
          titleEn: service.titleEn,
          shortDescription: service.shortDescription,
          shortDescriptionEn: service.shortDescriptionEn,
          fullDescription: service.fullDescription,
          fullDescriptionEn: service.fullDescriptionEn,
          iconKey: service.iconKey,
          priceFrom: service.priceFrom,
          order: service.order,
          isActive: service.isActive,
        }}
      />
    </div>
  );
}
