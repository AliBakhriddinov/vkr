import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

function issueFor(
  result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } },
  field: string,
) {
  return result.error?.issues.find((i) => i.path[0] === field)?.message;
}

describe("signInSchema", () => {
  it("accepts a valid email and password", () => {
    const result = signInSchema.safeParse({ email: "user@example.com", password: "x" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email with email_invalid", () => {
    const result = signInSchema.safeParse({ email: "nope", password: "x" });
    expect(issueFor(result, "email")).toBe("email_invalid");
  });

  it("rejects an empty password with password_required", () => {
    const result = signInSchema.safeParse({ email: "user@example.com", password: "" });
    expect(issueFor(result, "password")).toBe("password_required");
  });
});

describe("signUpSchema", () => {
  const valid = { name: "Иван Петров", email: "ivan@example.com", password: "supersecret" };

  it("accepts a valid sign-up", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 chars with name_min", () => {
    expect(issueFor(signUpSchema.safeParse({ ...valid, name: "И" }), "name")).toBe("name_min");
  });

  it("rejects an invalid email with email_invalid", () => {
    expect(issueFor(signUpSchema.safeParse({ ...valid, email: "bad" }), "email")).toBe(
      "email_invalid",
    );
  });

  it("rejects a password shorter than 8 chars with password_min", () => {
    expect(issueFor(signUpSchema.safeParse({ ...valid, password: "short" }), "password")).toBe(
      "password_min",
    );
  });

  it("accepts a 72-byte ASCII password (bcrypt limit boundary)", () => {
    expect(signUpSchema.safeParse({ ...valid, password: "a".repeat(72) }).success).toBe(true);
  });

  it("rejects a 73-byte ASCII password with password_max", () => {
    expect(issueFor(signUpSchema.safeParse({ ...valid, password: "a".repeat(73) }), "password")).toBe(
      "password_max",
    );
  });

  it("accepts 36 Cyrillic chars (= 72 bytes in UTF-8)", () => {
    expect(signUpSchema.safeParse({ ...valid, password: "я".repeat(36) }).success).toBe(true);
  });

  it("rejects 37 Cyrillic chars (= 74 bytes) with password_max", () => {
    expect(issueFor(signUpSchema.safeParse({ ...valid, password: "я".repeat(37) }), "password")).toBe(
      "password_max",
    );
  });
});
