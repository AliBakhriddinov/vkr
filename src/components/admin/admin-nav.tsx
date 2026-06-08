"use client";

import { useTranslations } from "next-intl";
import {
  FolderKanban,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Newspaper,
  Wrench,
} from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; key: string; icon: LucideIcon; exact?: boolean }[] = [
  { href: "/admin", key: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", key: "applications", icon: Inbox },
  { href: "/admin/services", key: "services", icon: Wrench },
  { href: "/admin/portfolio", key: "portfolio", icon: FolderKanban },
  { href: "/admin/blog", key: "blog", icon: Newspaper },
];

export function AdminNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <nav className="hidden w-52 shrink-0 md:block">
      <ul className="space-y-1">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
