"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Item = { id: string; quote: string; authorName: string; authorRole: string };

export function TestimonialSlider({ items }: { items: Item[] }) {
  const t = useTranslations("testimonials");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  // Автопрокрутку останавливаем, пока пользователь наводит/держит фокус (WCAG 2.2.2).
  // index в зависимостях перезапускает таймер после ручного переключения.
  useEffect(() => {
    if (reduce || count <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(id);
  }, [reduce, count, paused, index]);

  if (count === 0) return null;
  const item = items[index];

  return (
    <div
      className="mt-14"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("title")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12"
        aria-live={paused ? "polite" : "off"}
        aria-atomic
      >
        <Quote className="size-10 text-primary/30" />
        <AnimatePresence mode="wait">
          <motion.figure
            key={item.id}
            aria-roledescription="slide"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="mt-6 text-xl leading-relaxed sm:text-2xl">
              {item.quote}
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-semibold">{item.authorName}</p>
              <p className="text-sm text-muted-foreground">{item.authorRole}</p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("goTo", { n: i + 1 })}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  i === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-muted-foreground/40",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(-1)}
              aria-label={t("prev")}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(1)}
              aria-label={t("next")}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
