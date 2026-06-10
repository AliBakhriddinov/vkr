"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { AccountMenu } from "@/components/auth/account-menu";

const NAV_ITEMS = [
  { key: "services", href: "#services" },
  { key: "process", href: "#process" },
  { key: "cases", href: "#cases" },
  { key: "testimonials", href: "#testimonials" },
  { key: "contacts", href: "#contacts" },
  { key: "blog", href: "/blog" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg font-bold tracking-tight text-logo"
        >
          Pixel<span className="text-primary">Wave</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.key}
                href={`/${locale}${item.href}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="ml-2 hidden sm:inline-flex"
          >
            <a href={`/${locale}#contacts`}>{t("cta")}</a>
          </Button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
