"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import { writeAudit } from "@/lib/admin/audit";
import { revalidatePath } from "next/cache";

async function requireTrainingAccess() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  if (!canAccess("training", session.user.role)) {
    throw new Error("FORBIDDEN");
  }
}

/** 이수 토글 — 없으면 today로 생성, 있으면 제거 */
export async function toggleCompletion(
  franchiseeId: string,
  curriculumId: string
) {
  await requireTrainingAccess();
  const existing = await prisma.trainingCompletion.findUnique({
    where: {
      franchiseeId_curriculumId: { franchiseeId, curriculumId },
    },
  });
  if (existing) {
    await prisma.trainingCompletion.delete({ where: { id: existing.id } });
  } else {
    await prisma.trainingCompletion.create({
      data: {
        franchiseeId,
        curriculumId,
        completedAt: new Date(),
      },
    });
    await writeAudit({
      action: "training.complete",
      entityType: "TrainingCompletion",
      entityId: `${franchiseeId}:${curriculumId}`,
    });
  }
  revalidatePath("/admin/training");
}

/** 본사 검증 토글 */
export async function toggleVerify(
  franchiseeId: string,
  curriculumId: string
) {
  await requireTrainingAccess();
  const existing = await prisma.trainingCompletion.findUnique({
    where: {
      franchiseeId_curriculumId: { franchiseeId, curriculumId },
    },
  });
  if (!existing) return;
  await prisma.trainingCompletion.update({
    where: { id: existing.id },
    data: {
      verifiedAt: existing.verifiedAt ? null : new Date(),
    },
  });
  await writeAudit({
    action: "training.verify",
    entityType: "TrainingCompletion",
    entityId: existing.id,
  });
  revalidatePath("/admin/training");
}
