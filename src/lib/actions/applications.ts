"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STATUSES = ["NEW", "IN_PROGRESS", "DONE", "REJECTED"] as const;

type State = { error?: string };

export async function changeApplicationStatus(
  locale: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  const user = await requireRole(locale, ["MANAGER", "ADMIN"]);

  const applicationId = String(formData.get("applicationId") ?? "");
  const toStatus = String(formData.get("toStatus") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (!applicationId || !STATUSES.includes(toStatus as ApplicationStatus)) {
    return { error: "invalid" };
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { status: true },
  });
  if (!application) return { error: "invalid" };

  const next = toStatus as ApplicationStatus;

  if (application.status !== next) {
    // Читаем статус внутри транзакции, чтобы fromStatus в истории отражал
    // реальное значение на момент записи (защита от гонки двух менеджеров).
    await prisma.$transaction(async (tx) => {
      const current = await tx.application.findUnique({
        where: { id: applicationId },
        select: { status: true },
      });
      if (!current || current.status === next) return;
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: next,
          assignedManagerId: user.id,
          managerComment: comment || undefined,
        },
      });
      await tx.applicationStatusChange.create({
        data: {
          applicationId,
          fromStatus: current.status,
          toStatus: next,
          changedById: user.id,
          comment: comment || null,
        },
      });
    });
  } else if (comment) {
    await prisma.application.update({
      where: { id: applicationId },
      data: { managerComment: comment },
    });
  }

  revalidatePath(`/${locale}/admin/applications/${applicationId}`);
  revalidatePath(`/${locale}/admin/applications`);
  revalidatePath(`/${locale}/cabinet`);
  return {};
}
