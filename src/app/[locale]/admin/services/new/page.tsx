import { getTranslations, setRequestLocale } from "next-intl/server";

import { ServiceForm } from "@/components/admin/service-form";
import { createService } from "@/lib/actions/services";

export default async function NewServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.services");
  const tf = await getTranslations("admin.form");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("new")}
      </h1>
      <ServiceForm
        action={createService.bind(null, locale)}
        listHref="/admin/services"
        submitLabel={tf("create")}
        pendingLabel={tf("creating")}
      />
    </div>
  );
}
