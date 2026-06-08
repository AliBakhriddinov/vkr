"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Home, RotateCcw } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const numeralClass =
  "block font-display text-[clamp(5rem,22vw,13rem)] font-bold leading-none tracking-tight";

const extrudeColor = "color-mix(in srgb, var(--primary) 45%, #05070f)";
const extrude =
  Array.from({ length: 14 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${extrudeColor}`).join(
    ", ",
  ) + ", 22px 26px 45px rgba(0,0,0,0.45)";

export function ErrorView({
  code,
  variant,
  onReset,
}: {
  code: string;
  variant: "notFound" | "error";
  onReset?: () => void;
}) {
  const t = useTranslations("errorPage");
  const reduce = useReducedMotion();
  const title = variant === "notFound" ? t("notFoundTitle") : t("errorTitle");
  const text = variant === "notFound" ? t("notFoundText") : t("errorText");

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 65%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />

      <header className="relative flex h-16 items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Pixel<span className="text-primary">Wave</span>
        </Link>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="[perspective:900px]">
          <motion.div
            className="relative inline-block select-none"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateX: 14, rotateY: -12 }}
            animate={
              reduce
                ? { rotateX: 10, rotateY: -8 }
                : { rotateX: 14, rotateY: [-12, 12, -12], y: [0, -10, 0] }
            }
            transition={
              reduce
                ? undefined
                : { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span
              aria-hidden
              className={numeralClass}
              style={{ color: "var(--primary)", textShadow: extrude }}
            >
              {code}
            </span>
            <span
              className={`${numeralClass} absolute inset-0 bg-gradient-to-br from-primary via-[#6e8cff] to-teal bg-clip-text text-transparent`}
              style={{ transform: "translateZ(1px)" }}
            >
              {code}
            </span>
          </motion.div>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">{text}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onReset ? (
            <Button onClick={onReset}>
              <RotateCcw className="size-4" />
              {t("retry")}
            </Button>
          ) : null}
          <Button asChild variant={onReset ? "outline" : "default"}>
            <Link href="/">
              <Home className="size-4" />
              {t("home")}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/blog">{t("blog")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
