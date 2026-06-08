import { getTranslations, setRequestLocale } from "next-intl/server";

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
  await requireRole(locale, ["MANAGER", "ADMIN"]);
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight">
            Pixel<span className="text-primary">Wave</span>
            <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
              {t("title")}
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
            <AccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-8">
        <AdminNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
