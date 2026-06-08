"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function markSeen(
  locale: string,
  kind: "applications" | "testimonials",
  id: string,
): Promise<void> {
  const user = await requireRole(locale, ["ADMIN"]);

  if (kind === "applications") {
    const u = await prisma.user.findUnique({
      where: { id: user.id },
      select: { seenApplicationIds: true },
    });
    if (u?.seenApplicationIds.includes(id)) return;
    await prisma.user.update({
      where: { id: user.id },
      data: { seenApplicationIds: { push: id } },
    });
  } else {
    const u = await prisma.user.findUnique({
      where: { id: user.id },
      select: { seenTestimonialIds: true },
    });
    if (u?.seenTestimonialIds.includes(id)) return;
    await prisma.user.update({
      where: { id: user.id },
      data: { seenTestimonialIds: { push: id } },
    });
  }
}
