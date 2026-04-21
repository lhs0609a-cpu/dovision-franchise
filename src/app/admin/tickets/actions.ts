"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import { revalidatePath } from "next/cache";

async function requireTicketAccess() {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  if (!canAccess("tickets", session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session.user;
}

export async function replyToTicket(
  ticketId: string,
  formData: FormData
) {
  const user = await requireTicketAccess();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  const t = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!t) throw new Error("티켓 없음");
  await prisma.ticketMessage.create({
    data: {
      ticketId,
      authorId: user.id,
      authorType: "admin",
      authorName: user.name,
      body,
    },
  });
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: t.status === "OPEN" ? "IN_PROGRESS" : t.status,
      assigneeId: t.assigneeId ?? user.id,
    },
  });
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}

export async function setTicketStatus(
  ticketId: string,
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED"
) {
  await requireTicketAccess();
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status,
      closedAt: status === "CLOSED" ? new Date() : null,
    },
  });
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}
