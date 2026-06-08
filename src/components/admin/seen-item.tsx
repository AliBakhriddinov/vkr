"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { markSeen } from "@/lib/actions/notifications";

export function SeenItem({
  kind,
  id,
}: {
  kind: "applications" | "testimonials";
  id: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    markSeen(locale, kind, id).then(() => router.refresh());
  }, [kind, id, locale, router]);

  return null;
}
