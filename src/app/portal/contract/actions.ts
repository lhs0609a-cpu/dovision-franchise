"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function requireFranchisee() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "franchisee") {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}

async function ensureSignatureRow(franchiseeId: string, templateId: string) {
  return prisma.contractSignature.upsert({
    where: {
      franchiseeId_templateId: { franchiseeId, templateId },
    },
    update: {},
    create: { franchiseeId, templateId },
  });
}

export async function markViewed(templateId: string) {
  const franchiseeId = await requireFranchisee();
  const row = await ensureSignatureRow(franchiseeId, templateId);
  if (!row.viewedAt) {
    await prisma.contractSignature.update({
      where: { id: row.id },
      data: { viewedAt: new Date() },
    });
  }
  revalidatePath("/portal/contract");
}

export async function markDownloaded(templateId: string) {
  const franchiseeId = await requireFranchisee();
  const row = await ensureSignatureRow(franchiseeId, templateId);
  await prisma.contractSignature.update({
    where: { id: row.id },
    data: { downloadedAt: new Date() },
  });
  revalidatePath("/portal/contract");
}

export async function agreeToContract(templateId: string) {
  const franchiseeId = await requireFranchisee();
  const row = await ensureSignatureRow(franchiseeId, templateId);
  if (row.agreedAt) return; // 재동의 방지
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    null;
  await prisma.contractSignature.update({
    where: { id: row.id },
    data: { agreedAt: new Date(), agreementIp: ip, viewedAt: row.viewedAt ?? new Date() },
  });
  revalidatePath("/portal/contract");
  revalidatePath("/portal");
}
