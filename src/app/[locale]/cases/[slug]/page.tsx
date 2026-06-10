import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await prisma.portfolioItem.findUnique({
    where: { slug },
    select: { title: true, titleEn: true },
  });
  return { title: item ? localize(item, "title", locale) : undefined };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("casePage");

  const item = await prisma.portfolioItem.findUnique({ where: { slug } });
  if (!item || !item.isPublished) notFound();

  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const clientName =
    locale === "en" && item.clientNameEn ? item.clientNameEn : item.clientName;

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto my-16 max-w-3xl rounded-2xl border border-border bg-card px-6 py-12 sm:px-12">
          <a
            href={`/${locale}#cases`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </a>

          <div className="relative mt-8 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#3344e0] via-[#1b2c52] to-[#0b0e14]">
            <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
            <div className="dotgrid absolute inset-0 opacity-[0.15]" />
            <span className="relative font-display text-8xl font-bold text-white/90 drop-shadow-lg">
              {item.title.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal"
              >
                {tech}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {localize(item, "title", locale)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {localize(item, "summary", locale)}
          </p>

          <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground/90">
            {localize(item, "description", locale)}
          </div>

          <dl className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {clientName ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("client")}
                </dt>
                <dd className="mt-1 font-medium">{clientName}</dd>
              </div>
            ) : null}
            {item.completedAt ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("completed")}
                </dt>
                <dd className="mt-1 font-medium">{dateFmt.format(item.completedAt)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`/${locale}#contacts`}>
                {t("cta")}
                <ArrowRight className="size-4" />
              </a>
            </Button>
            {item.projectUrl ? (
              <Button asChild size="lg" variant="outline">
                <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                  {t("visit")}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
