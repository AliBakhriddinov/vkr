import { getTranslations, setRequestLocale } from "next-intl/server";

import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "@/lib/actions/testimonials";

export default async function NewTestimonialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.testimonials");
  const tf = await getTranslations("admin.form");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t("title")} · {tf("new")}
      </h1>
      <TestimonialForm
        action={createTestimonial.bind(null, locale)}
        listHref="/admin/testimonials"
        submitLabel={tf("create")}
        pendingLabel={tf("creating")}
      />
    </div>
  );
}
