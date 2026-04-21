"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { writeAudit } from "@/lib/admin/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
}

export async function activateContract(templateId: string) {
  await requireAdmin();
  const t = await prisma.contractTemplate.findUnique({ where: { id: templateId } });
  await prisma.$transaction([
    prisma.contractTemplate.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    }),
    prisma.contractTemplate.update({
      where: { id: templateId },
      data: { isActive: true },
    }),
  ]);
  await writeAudit({
    action: "contract.activate",
    entityType: "Contract",
    entityId: templateId,
    meta: { version: t?.version },
  });
  revalidatePath("/admin/contracts");
}

export async function deactivateContract(templateId: string) {
  await requireAdmin();
  const t = await prisma.contractTemplate.findUnique({ where: { id: templateId } });
  await prisma.contractTemplate.update({
    where: { id: templateId },
    data: { isActive: false },
  });
  await writeAudit({
    action: "contract.deactivate",
    entityType: "Contract",
    entityId: templateId,
    meta: { version: t?.version },
  });
  revalidatePath("/admin/contracts");
}

export async function deleteContract(templateId: string) {
  await requireAdmin();
  const t = await prisma.contractTemplate.findUnique({
    where: { id: templateId },
    include: { _count: { select: { signatures: true } } },
  });
  if (!t) throw new Error("계약서 없음");
  if (t._count.signatures > 0) {
    throw new Error(
      `서명 기록이 ${t._count.signatures}건 있어 삭제 불가. 비활성화만 가능.`
    );
  }
  // Blob 삭제 (실패해도 DB는 계속 진행)
  try {
    await del(t.hwpFileUrl);
  } catch {
    // blob already gone or deletion failed — not critical
  }
  await prisma.contractTemplate.delete({ where: { id: templateId } });
  await writeAudit({
    action: "contract.delete",
    entityType: "Contract",
    entityId: templateId,
    meta: { version: t.version, title: t.title },
  });
  revalidatePath("/admin/contracts");
}

export async function updateContractNote(templateId: string, note: string) {
  await requireAdmin();
  await prisma.contractTemplate.update({
    where: { id: templateId },
    data: { note: note || null },
  });
  revalidatePath(`/admin/contracts/${templateId}`);
}
