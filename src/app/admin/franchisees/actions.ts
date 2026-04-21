"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeAudit } from "@/lib/admin/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
}

/** 문의 → 가맹점주 계정 생성 (계약 체결 후) */
export async function createFranchiseeFromInquiry(formData: FormData) {
  await requireAdmin();
  const inquiryId = String(formData.get("inquiryId") || "");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const centerName = String(formData.get("centerName") || "").trim() || null;
  const targetOpenDateStr = String(formData.get("targetOpenDate") || "");

  if (!inquiryId || !email || !password || password.length < 8) {
    throw new Error("필수 값 누락 또는 비밀번호 8자 이상 필요");
  }

  const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
  if (!inquiry) throw new Error("문의를 찾을 수 없습니다");

  const existing = await prisma.franchisee.findUnique({ where: { email } });
  if (existing) throw new Error("이미 사용 중인 이메일입니다");

  const hashed = await bcrypt.hash(password, 12);
  const franchisee = await prisma.franchisee.create({
    data: {
      email,
      password: hashed,
      name: inquiry.name,
      phone: inquiry.phone,
      region: inquiry.region,
      centerName,
      inquiryId: inquiry.id,
      targetOpenDate: targetOpenDateStr ? new Date(targetOpenDateStr) : null,
      status: "ONBOARDING",
    },
  });
  // 문의 상태도 계약으로
  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { status: "CONTRACTED" },
  });
  await writeAudit({
    action: "franchisee.create",
    entityType: "Franchisee",
    entityId: franchisee.id,
    meta: { name: franchisee.name, region: franchisee.region, fromInquiryId: inquiryId },
  });
  revalidatePath("/admin/franchisees");
  redirect(`/admin/franchisees/${franchisee.id}`);
}

/** 본사 검증 토글 */
export async function toggleAdminVerified(
  franchiseeId: string,
  templateId: string
) {
  await requireAdmin();
  const existing = await prisma.checklistProgress.findUnique({
    where: { franchiseeId_templateId: { franchiseeId, templateId } },
  });
  if (existing) {
    await prisma.checklistProgress.update({
      where: { id: existing.id },
      data: {
        adminVerifiedAt: existing.adminVerifiedAt ? null : new Date(),
      },
    });
  } else {
    await prisma.checklistProgress.create({
      data: {
        franchiseeId,
        templateId,
        adminVerifiedAt: new Date(),
      },
    });
  }
  revalidatePath(`/admin/franchisees/${franchiseeId}`);
}

/** 가맹점 상태 변경 */
export async function setFranchiseeStatus(
  franchiseeId: string,
  status: "ONBOARDING" | "OPERATING" | "SUSPENDED" | "TERMINATED"
) {
  await requireAdmin();
  const before = await prisma.franchisee.findUnique({
    where: { id: franchiseeId },
    select: { status: true, name: true },
  });
  await prisma.franchisee.update({
    where: { id: franchiseeId },
    data: {
      status,
      openedAt: status === "OPERATING" ? new Date() : undefined,
    },
  });
  await writeAudit({
    action: "franchisee.status.change",
    entityType: "Franchisee",
    entityId: franchiseeId,
    meta: { from: before?.status, to: status, name: before?.name },
  });
  revalidatePath(`/admin/franchisees/${franchiseeId}`);
  revalidatePath("/admin/franchisees");
}
