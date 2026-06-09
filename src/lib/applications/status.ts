export const APPLICATION_STATUSES = ["NEW", "IN_PROGRESS", "DONE", "REJECTED"] as const;

export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

export function isApplicationStatus(value: string): value is ApplicationStatusValue {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export type StatusChangeDecision =
  | { kind: "invalid_status" }
  | { kind: "not_found" }
  | { kind: "noop" }
  | { kind: "comment_only" }
  | { kind: "transition"; to: ApplicationStatusValue };

export function decideStatusChange(
  currentStatus: string | null,
  toStatus: string,
  comment: string,
): StatusChangeDecision {
  if (!isApplicationStatus(toStatus)) return { kind: "invalid_status" };
  if (currentStatus === null) return { kind: "not_found" };
  if (currentStatus !== toStatus) return { kind: "transition", to: toStatus };
  if (comment.trim().length > 0) return { kind: "comment_only" };
  return { kind: "noop" };
}
