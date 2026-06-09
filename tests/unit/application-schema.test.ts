import { describe, it, expect } from "vitest";
import { applicationSchema } from "@/lib/validations/application";

const valid = {
  name: "Иван Петров",
  email: "ivan@example.com",
  phone: "+79991234567",
  company: "ООО Ромашка",
  serviceId: "svc_1",
  budgetRange: "FROM_100K_TO_500K",
  message: "Нужен новый сайт для компании.",
};

function issueFor(result: ReturnType<typeof applicationSchema.safeParse>, field: string) {
  return result.success
    ? undefined
    : result.error.issues.find((i) => i.path[0] === field)?.message;
}

describe("applicationSchema", () => {
  it("accepts a fully valid application", () => {
    const result = applicationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a minimal application without optional fields", () => {
    const result = applicationSchema.safeParse({
      name: "Анна",
      email: "anna@example.com",
      message: "Хочу обсудить проект сайта.",
    });
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace from name", () => {
    const result = applicationSchema.safeParse({ ...valid, name: "  Иван  " });
    expect(result.success && result.data.name).toBe("Иван");
  });

  it("rejects a name shorter than 2 chars with name_min", () => {
    const result = applicationSchema.safeParse({ ...valid, name: "И" });
    expect(issueFor(result, "name")).toBe("name_min");
  });

  it("rejects a name longer than 100 chars with name_max", () => {
    const result = applicationSchema.safeParse({ ...valid, name: "и".repeat(101) });
    expect(issueFor(result, "name")).toBe("name_max");
  });

  it("rejects an invalid email with email_invalid", () => {
    const result = applicationSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(issueFor(result, "email")).toBe("email_invalid");
  });

  it("rejects an invalid phone number with phone_invalid", () => {
    const result = applicationSchema.safeParse({ ...valid, phone: "12345" });
    expect(issueFor(result, "phone")).toBe("phone_invalid");
  });

  it("treats an empty phone string as valid (field is optional)", () => {
    const result = applicationSchema.safeParse({ ...valid, phone: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a company longer than 120 chars with company_max", () => {
    const result = applicationSchema.safeParse({ ...valid, company: "a".repeat(121) });
    expect(issueFor(result, "company")).toBe("company_max");
  });

  it("rejects a message shorter than 10 chars with message_min", () => {
    const result = applicationSchema.safeParse({ ...valid, message: "коротко" });
    expect(issueFor(result, "message")).toBe("message_min");
  });

  it("rejects a message longer than 2000 chars with message_max", () => {
    const result = applicationSchema.safeParse({ ...valid, message: "a".repeat(2001) });
    expect(issueFor(result, "message")).toBe("message_max");
  });

  it("rejects an unknown budget range", () => {
    const result = applicationSchema.safeParse({ ...valid, budgetRange: "HUGE" });
    expect(result.success).toBe(false);
  });
});
