import { describe, it, expect } from "vitest";
import { serviceSchema } from "@/lib/validations/service";
import { portfolioSchema } from "@/lib/validations/portfolio";
import { blogSchema } from "@/lib/validations/blog";
import { testimonialSchema } from "@/lib/validations/testimonial";

describe("serviceSchema", () => {
  const valid = {
    slug: "web-development",
    title: "Разработка",
    shortDescription: "Кратко",
    fullDescription: "Подробно",
    titleEn: null,
    shortDescriptionEn: null,
    fullDescriptionEn: null,
    priceFrom: 500000,
    order: 1,
    isActive: true,
  };

  it("accepts a valid service", () => {
    expect(serviceSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a null priceFrom", () => {
    expect(serviceSchema.safeParse({ ...valid, priceFrom: null }).success).toBe(true);
  });

  it("rejects a slug with uppercase or spaces", () => {
    expect(serviceSchema.safeParse({ ...valid, slug: "Web Dev" }).success).toBe(false);
  });

  it("rejects a negative priceFrom", () => {
    expect(serviceSchema.safeParse({ ...valid, priceFrom: -1 }).success).toBe(false);
  });
});

describe("portfolioSchema", () => {
  const valid = {
    slug: "case-one",
    title: "Кейс",
    summary: "Кратко",
    description: "Подробно",
    titleEn: null,
    summaryEn: null,
    descriptionEn: null,
    clientNameEn: null,
    technologies: ["Next.js", "Prisma"],
    completedAt: null,
    order: 1,
    isPublished: true,
  };

  it("accepts a valid portfolio item", () => {
    expect(portfolioSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a Date for completedAt", () => {
    expect(portfolioSchema.safeParse({ ...valid, completedAt: new Date() }).success).toBe(true);
  });

  it("rejects a string completedAt (must be a Date)", () => {
    expect(portfolioSchema.safeParse({ ...valid, completedAt: "2025-01-01" }).success).toBe(false);
  });

  it("rejects an invalid slug", () => {
    expect(portfolioSchema.safeParse({ ...valid, slug: "Кейс_1" }).success).toBe(false);
  });
});

describe("blogSchema", () => {
  const valid = {
    slug: "post-one",
    title: "Заголовок",
    excerpt: "Анонс",
    content: "Текст статьи",
    titleEn: null,
    excerptEn: null,
    contentEn: null,
    tags: ["методология"],
    publishedAt: null,
  };

  it("accepts a valid blog post", () => {
    expect(blogSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(blogSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("rejects an invalid slug", () => {
    expect(blogSchema.safeParse({ ...valid, slug: "Пост 1" }).success).toBe(false);
  });
});

describe("testimonialSchema", () => {
  const valid = {
    quote: "Отличная работа команды.",
    authorName: "Елена",
    authorRole: "Директор",
    order: 1,
    isPublished: true,
  };

  it("accepts a valid testimonial", () => {
    expect(testimonialSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty quote", () => {
    expect(testimonialSchema.safeParse({ ...valid, quote: "" }).success).toBe(false);
  });

  it("rejects a quote longer than 600 chars", () => {
    expect(testimonialSchema.safeParse({ ...valid, quote: "а".repeat(601) }).success).toBe(false);
  });
});
