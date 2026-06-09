import { describe, it, expect } from "vitest";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
  decideStatusChange,
} from "@/lib/applications/status";

describe("isApplicationStatus", () => {
  it("accepts the four known statuses", () => {
    for (const s of APPLICATION_STATUSES) expect(isApplicationStatus(s)).toBe(true);
  });

  it("rejects unknown or wrongly-cased values", () => {
    expect(isApplicationStatus("BOGUS")).toBe(false);
    expect(isApplicationStatus("new")).toBe(false);
    expect(isApplicationStatus("")).toBe(false);
  });
});

describe("decideStatusChange", () => {
  it("flags an unknown target status as invalid", () => {
    expect(decideStatusChange("NEW", "BOGUS", "")).toEqual({ kind: "invalid_status" });
  });

  it("flags a missing application as not_found", () => {
    expect(decideStatusChange(null, "NEW", "")).toEqual({ kind: "not_found" });
  });

  it("returns a transition when the status differs", () => {
    expect(decideStatusChange("NEW", "IN_PROGRESS", "")).toEqual({
      kind: "transition",
      to: "IN_PROGRESS",
    });
  });

  it("returns comment_only when the status is unchanged but a comment is given", () => {
    expect(decideStatusChange("IN_PROGRESS", "IN_PROGRESS", "звонил клиенту")).toEqual({
      kind: "comment_only",
    });
  });

  it("returns noop when the status is unchanged and there is no comment", () => {
    expect(decideStatusChange("DONE", "DONE", "")).toEqual({ kind: "noop" });
  });

  it("treats a whitespace-only comment as no comment", () => {
    expect(decideStatusChange("DONE", "DONE", "   ")).toEqual({ kind: "noop" });
  });
});
