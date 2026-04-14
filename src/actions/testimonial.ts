"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTestimonial(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.testimonial.create({
    data: {
      studentName: formData.get("studentName") as string,
      grade: formData.get("grade") as string,
      duration: formData.get("duration") as string,
      content: formData.get("content") as string,
      achievement: formData.get("achievement") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/success");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.testimonial.update({
    where: { id },
    data: {
      studentName: formData.get("studentName") as string,
      grade: formData.get("grade") as string,
      duration: formData.get("duration") as string,
      content: formData.get("content") as string,
      achievement: formData.get("achievement") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/success");
  return { success: true };
}

export async function toggleTestimonialPublish(id: string, isPublished: boolean) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.testimonial.update({
    where: { id },
    data: { isPublished },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/success");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "인증이 필요합니다." };

  await prisma.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
  revalidatePath("/success");
  return { success: true };
}
