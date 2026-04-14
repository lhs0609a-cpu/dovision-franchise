"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createNotice(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.notice.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      isPinned: formData.get("isPinned") === "true",
    },
  });

  revalidatePath("/admin/notices");
  revalidatePath("/notice");
  return { success: true };
}

export async function updateNotice(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.notice.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      isPinned: formData.get("isPinned") === "true",
    },
  });

  revalidatePath("/admin/notices");
  revalidatePath("/notice");
  return { success: true };
}

export async function toggleNoticePin(id: string, isPinned: boolean) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.notice.update({
    where: { id },
    data: { isPinned },
  });

  revalidatePath("/admin/notices");
  revalidatePath("/notice");
  return { success: true };
}

export async function deleteNotice(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.notice.delete({ where: { id } });

  revalidatePath("/admin/notices");
  revalidatePath("/notice");
  return { success: true };
}
