import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReplyForm from "./ReplyForm";

export const dynamic = "force-dynamic";

export default async function PortalTicketDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.userType !== "franchisee") {
    redirect("/portal/login");
  }
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket || ticket.franchiseeId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/portal/tickets"
        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        티켓 목록
      </Link>
      <div>
        <h1 className="text-[20px] font-bold">{ticket.subject}</h1>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          상태: <strong>{ticket.status}</strong> · 분류: {ticket.category} ·
          긴급도: {ticket.priority} · 접수{" "}
          {new Date(ticket.createdAt).toLocaleString("ko-KR")}
        </p>
      </div>

      <div className="space-y-3">
        {ticket.messages.map((m) => {
          const isMine = m.authorType === "franchisee";
          return (
            <div
              key={m.id}
              className={`rounded-xl border p-3 ${isMine ? "bg-white" : "bg-primary/5 border-primary/30"}`}
            >
              <p className="text-[11.5px] font-semibold">
                {m.authorName}
                <span className="ml-2 text-[10.5px] font-normal text-muted-foreground">
                  {isMine ? "(나)" : "(본사 담당자)"} ·{" "}
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
        <ReplyForm ticketId={ticket.id} />
      )}
    </div>
  );
}
