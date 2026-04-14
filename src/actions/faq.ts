"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createFAQ(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.fAQ.create({
    data: {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: (formData.get("category") as string) || "general",
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function updateFAQ(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.fAQ.update({
    where: { id },
    data: {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: (formData.get("category") as string) || "general",
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function toggleFAQPublish(id: string, isPublished: boolean) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.fAQ.update({
    where: { id },
    data: { isPublished },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function deleteFAQ(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.fAQ.delete({ where: { id } });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}
