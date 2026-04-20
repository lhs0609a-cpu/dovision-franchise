"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================================
// 가맹점주 포털 서버 액션
// ============================================================

async function requireFranchisee() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "franchisee") {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}

/** 체크리스트 항목 토글 (없으면 생성하며 체크) */
export async function toggleChecklistItem(templateId: string) {
  const franchiseeId = await requireFranchisee();
  const existing = await prisma.checklistProgress.findUnique({
    where: {
      franchiseeId_templateId: { franchiseeId, templateId },
    },
  });

  if (existing) {
    await prisma.checklistProgress.update({
      where: { id: existing.id },
      data: {
        isChecked: !existing.isChecked,
        checkedAt: !existing.isChecked ? new Date() : null,
      },
    });
  } else {
    await prisma.checklistProgress.create({
      data: {
        franchiseeId,
        templateId,
        isChecked: true,
        checkedAt: new Date(),
      },
    });
  }
  revalidatePath("/portal");
}

/** 메모 저장 */
export async function saveChecklistNote(templateId: string, note: string) {
  const franchiseeId = await requireFranchisee();
  await prisma.checklistProgress.upsert({
    where: { franchiseeId_templateId: { franchiseeId, templateId } },
    update: { note },
    create: { franchiseeId, templateId, note },
  });
  revalidatePath("/portal");
}

/** 정보공개서 수령일 기록 (법정 14일 숙고기간 기산) */
export async function setInfoDisclosureDate(iso: string) {
  const franchiseeId = await requireFranchisee();
  await prisma.franchisee.update({
    where: { id: franchiseeId },
    data: { infoDisclosureReceivedAt: new Date(iso) },
  });
  revalidatePath("/portal");
}

/** 개업 희망일 기록 */
export async function setTargetOpenDate(iso: string) {
  const franchiseeId = await requireFranchisee();
  await prisma.franchisee.update({
    where: { id: franchiseeId },
    data: { targetOpenDate: new Date(iso) },
  });
  revalidatePath("/portal");
}
