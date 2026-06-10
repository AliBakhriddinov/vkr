import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/content";
import { serviceIcon } from "@/lib/service-icons";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    select: { title: true, titleEn: true },
  });
  return { title: service ? localize(service, "title", locale) : undefined };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicePage");

  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.isActive) notFound();

  const Icon = serviceIcon(service.iconKey);
  const priceFmt = new Intl.NumberFormat(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto my-16 max-w-3xl rounded-2xl border border-border bg-card px-6 py-12 sm:px-12">
          <a
            href={`/${locale}#services`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </a>

          <div className="mt-8 flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-7" />
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {localize(service, "title", locale)}
            </h1>
          </div>

          <p className="mt-6 text-lg text-muted-foreground">
            {localize(service, "shortDescription", locale)}
          </p>

          <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground/90">
            {localize(service, "fullDescription", locale)}
          </div>

          {service.priceFrom ? (
            <p className="mt-8 text-sm text-muted-foreground">
              {t("priceFrom")}:{" "}
              <span className="font-semibold text-foreground">
                {priceFmt.format(service.priceFrom)} ₽
              </span>
            </p>
          ) : null}

          <div className="mt-10">
            <Button asChild size="lg">
              <a href={`/${locale}#contacts`}>
                {t("cta")}
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
