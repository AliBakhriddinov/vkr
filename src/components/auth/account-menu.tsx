"use client";

import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, Shield, User } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return (
      <Button asChild variant="default" size="sm">
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  const { user } = session;
  const isStaff = user.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" aria-label={t("menu")}>
          <User className="size-4" />
          <span className="hidden max-w-[12ch] truncate sm:inline">
            {user.name ?? user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isStaff ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="mr-2 size-4" />
              {t("admin")}
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/cabinet">
              <LayoutDashboard className="mr-2 size-4" />
              {t("cabinet")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: `/${locale}` })}>
          <LogOut className="mr-2 size-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
