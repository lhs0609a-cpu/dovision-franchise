"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireFranchisee() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "franchisee") {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function createTicket(formData: FormData) {
  const user = await requireFranchisee();
  const subject = String(formData.get("subject") || "").trim();
  const category = String(formData.get("category") || "OPERATIONS");
  const priority = String(formData.get("priority") || "NORMAL");
  const body = String(formData.get("body") || "").trim();
  if (!subject || !body) throw new Error("제목과 내용은 필수");

  const ticket = await prisma.ticket.create({
    data: {
      franchiseeId: user.id,
      subject,
      category: category as "OPERATIONS",
      priority: priority as "NORMAL",
      status: "OPEN",
      messages: {
        create: [
          {
            authorId: user.id,
            authorType: "franchisee",
            authorName: user.name,
            body,
          },
        ],
      },
    },
  });
  revalidatePath("/portal/tickets");
  revalidatePath(`/portal/tickets/${ticket.id}`);
  return ticket.id;
}

export async function postTicketReply(
  ticketId: string,
  formData: FormData
) {
  const user = await requireFranchisee();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  // 본인 소유 티켓인지 검증
  const t = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!t || t.franchiseeId !== user.id) throw new Error("FORBIDDEN");
  await prisma.ticketMessage.create({
    data: {
      ticketId,
      authorId: user.id,
      authorType: "franchisee",
      authorName: user.name,
      body,
    },
  });
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: t.status === "WAITING" ? "IN_PROGRESS" : t.status },
  });
  revalidatePath(`/portal/tickets/${ticketId}`);
}
