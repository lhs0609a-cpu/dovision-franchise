"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import { writeAudit } from "@/lib/admin/audit";
import { revalidatePath } from "next/cache";

async function requireVisitsAccess() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  if (!canAccess("visits", session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session.user;
}

export async function createVisit(formData: FormData) {
  const user = await requireVisitsAccess();
  const franchiseeId = String(formData.get("franchiseeId") || "");
  const scheduledAt = String(formData.get("scheduledAt") || "");
  if (!franchiseeId || !scheduledAt) throw new Error("필수 값 누락");

  const v = await prisma.supervisorVisit.create({
    data: {
      supervisorId: user.id,
      franchiseeId,
      scheduledAt: new Date(scheduledAt),
    },
  });
  await writeAudit({
    action: "visit.create",
    entityType: "SupervisorVisit",
    entityId: v.id,
    meta: { franchiseeId, scheduledAt },
  });
  revalidatePath("/admin/visits");
}

export async function completeVisit(formData: FormData) {
  await requireVisitsAccess();
  const id = String(formData.get("id") || "");
  const summary = String(formData.get("summary") || "").trim() || null;
  const issues = String(formData.get("issues") || "").trim() || null;
  const nextAction = String(formData.get("nextAction") || "").trim() || null;

  await prisma.supervisorVisit.update({
    where: { id },
    data: {
      visitedAt: new Date(),
      summary,
      issues,
      nextAction,
    },
  });
  await writeAudit({
    action: "visit.complete",
    entityType: "SupervisorVisit",
    entityId: id,
  });
  revalidatePath("/admin/visits");
}

export async function deleteVisit(id: string) {
  await requireVisitsAccess();
  await prisma.supervisorVisit.delete({ where: { id } });
  revalidatePath("/admin/visits");
}
