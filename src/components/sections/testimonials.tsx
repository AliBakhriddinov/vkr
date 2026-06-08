import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialSlider } from "@/components/testimonial-slider";

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 15,
    select: { id: true, quote: true, authorName: true, authorRole: true },
  });

  if (items.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative border-t border-border py-24"
    >
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {t("title")}
          </h2>
        </Reveal>

        <TestimonialSlider items={items} />
      </div>
    </section>
  );
}
