import { getTranslations, setRequestLocale } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { AccountMenu } from "@/components/auth/account-menu";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireRole(locale, ["ADMIN"]);
  const seen = await prisma.user.findUnique({
    where: { id: user.id },
    select: { seenApplicationIds: true, seenTestimonialIds: true },
  });
  const [newApplications, pendingTestimonials] = await Promise.all([
    prisma.application.count({
      where: { id: { notIn: seen?.seenApplicationIds ?? [] } },
    }),
    prisma.testimonial.count({
      where: {
        isPublished: false,
        id: { notIn: seen?.seenTestimonialIds ?? [] },
      },
    }),
  ]);
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-baseline gap-2">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight"
            >
              Pixel<span className="text-primary">Wave</span>
            </Link>
            <Link
              href="/admin"
              className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("title")}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
            <AccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-8">
        <AdminNav
          badges={{
            applications: newApplications,
            testimonials: pendingTestimonials,
          }}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
