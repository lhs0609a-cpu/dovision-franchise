import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminTicketReply from "./AdminTicketReply";
import AdminTicketStatus from "./AdminTicketStatus";

export const dynamic = "force-dynamic";

export default async function AdminTicketDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("tickets", role)) {
    return <AccessDenied feature="CS 티켓" role={role} />;
  }
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      franchisee: {
        select: {
          id: true,
          name: true,
          region: true,
          centerName: true,
          phone: true,
        },
      },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link
        href="/admin/tickets"
        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        티켓 목록
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold">{ticket.subject}</h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            <Link
              href={`/admin/franchisees/${ticket.franchisee.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {ticket.franchisee.name}
            </Link>{" "}
            · {ticket.franchisee.region}{" "}
            {ticket.franchisee.centerName &&
              `· ${ticket.franchisee.centerName}`}{" "}
            · {ticket.franchisee.phone}
          </p>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            분류: {ticket.category} · 긴급도: {ticket.priority} · 접수{" "}
            {new Date(ticket.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
        <AdminTicketStatus
          ticketId={ticket.id}
          currentStatus={ticket.status}
        />
      </div>

      <div className="space-y-3">
        {ticket.messages.map((m) => {
          const isAdmin = m.authorType === "admin";
          return (
            <div
              key={m.id}
              className={`rounded-xl border p-3 ${isAdmin ? "bg-primary/5 border-primary/30" : "bg-white"}`}
            >
              <p className="text-[11.5px] font-semibold">
                {m.authorName}
                <span className="ml-2 text-[10.5px] font-normal text-muted-foreground">
                  {isAdmin ? "(본사)" : "(가맹점주)"} ·{" "}
                  {new Date(m.createdAt).toLocaleString("ko-KR")}
                </span>
              </p>
              <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-[1.65]">
                {m.body}
              </p>
            </div>
          );
        })}
      </div>

      {ticket.status !== "CLOSED" && (
        <AdminTicketReply ticketId={ticket.id} />
      )}
    </div>
  );
}
