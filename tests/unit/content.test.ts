import { describe, it, expect } from "vitest";
import { localize } from "@/lib/content";

const row = {
  title: "Заголовок",
  titleEn: "Title",
  summary: "Описание",
  summaryEn: "",
  excerpt: "Анонс",
};

describe("localize", () => {
  it("returns the English field on en when it is present", () => {
    expect(localize(row, "title", "en")).toBe("Title");
  });

  it("falls back to the base field on en when the English value is empty", () => {
    expect(localize(row, "summary", "en")).toBe("Описание");
  });

  it("falls back to the base field on en when the English field is missing", () => {
    expect(localize(row, "excerpt", "en")).toBe("Анонс");
  });

  it("returns the base field on ru", () => {
    expect(localize(row, "title", "ru")).toBe("Заголовок");
  });

  it("returns an empty string when the base field is missing", () => {
    expect(localize({ title: undefined } as Record<string, unknown>, "title", "ru")).toBe("");
  });
});
