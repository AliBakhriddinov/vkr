import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("lead")}</p>

          {posts.length === 0 ? (
            <p className="mt-12 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-12 space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-ring sm:p-8"
                >
                  {post.publishedAt ? (
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {dateFmt.format(post.publishedAt)}
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {localize(post, "title", locale)}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {localize(post, "excerpt", locale)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {t("readMore")}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
