"use client";

import { ErrorView } from "@/components/error-view";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorView code="500" variant="error" onReset={reset} />;
}
