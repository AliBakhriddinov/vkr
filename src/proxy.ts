import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import { authConfig } from "@/auth.config";

const intlMiddleware = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const localeRe = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
  const localeMatch = nextUrl.pathname.match(localeRe);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const path = (nextUrl.pathname.replace(localeRe, "") || "/").replace(
    /\/{2,}/g,
    "/",
  );

  const isCabinet = /^\/cabinet(\/|$)/.test(path);
  const isAdmin = /^\/admin(\/|$)/.test(path);
  const role = req.auth?.user?.role;

  if ((isCabinet || isAdmin) && !req.auth) {
    const url = new URL(`/${locale}/sign-in`, nextUrl);
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
