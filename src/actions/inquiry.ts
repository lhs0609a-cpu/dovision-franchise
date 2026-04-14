"use server";

import { prisma } from "@/lib/prisma";
import { sendInquiryNotification } from "@/lib/mail";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || undefined;
  const region = formData.get("region") as string;
  const budget = (formData.get("budget") as string) || undefined;
  const experience = (formData.get("experience") as string) || undefined;
  const message = (formData.get("message") as string) || undefined;

  if (!name || !phone || !region) {
    return { success: false, error: "필수 항목을 입력해주세요." };
  }

  try {
    await prisma.inquiry.create({
      data: { name, phone, email, region, budget, experience, message },
    });

    try {
      await sendInquiryNotification({ name, phone, email, region, budget, experience, message });
    } catch {
      // Email failure should not block inquiry submission
    }

    return { success: true };
  } catch {
    return { success: false, error: "접수 중 오류가 발생했습니다." };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.inquiry.update({
    where: { id },
    data: { status: status as never },
  });

  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function updateInquiryNote(id: string, adminNote: string) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.inquiry.update({
    where: { id },
    data: { adminNote },
  });

  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true };
}
