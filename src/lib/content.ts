export function localize<T extends Record<string, unknown>>(
  row: T,
  field: keyof T & string,
  locale: string,
): string {
  if (locale === "en") {
    const value = row[`${field}En` as keyof T];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return String(row[field] ?? "");
}
