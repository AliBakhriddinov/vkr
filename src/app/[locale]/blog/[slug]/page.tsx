import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Markdown } from "@/components/markdown";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, titleEn: true, excerpt: true, excerptEn: true },
  });
  if (!post) return {};
  return {
    title: localize(post, "title", locale),
    description: localize(post, "excerpt", locale),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || !post.publishedAt) notFound();

  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {localize(post, "title", locale)}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {dateFmt.format(post.publishedAt)}
            {post.author?.name ? ` · ${post.author.name}` : ""}
          </p>

          <div className="mt-8">
            <Markdown>{localize(post, "content", locale)}</Markdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
