import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircleQuestion, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewTicketForm from "./NewTicketForm";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "접수",
  IN_PROGRESS: "처리 중",
  WAITING: "회신 대기",
  RESOLVED: "해결됨",
  CLOSED: "종료",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  WAITING: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-muted text-muted-foreground",
};

export default async function PortalTicketsPage() {
  const session = await auth();
  if (!session || session.user.userType !== "franchisee") {
    redirect("/portal/login");
  }

  let tickets: Array<{
    id: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { messages: number };
  }> = [];
  try {
    tickets = await prisma.ticket.findMany({
      where: { franchiseeId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { messages: true } } },
    });
  } catch {
    // DB
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-[22px] font-bold">
          <MessageCircleQuestion className="h-5 w-5 text-primary" />
          CS 문의 (티켓)
        </h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          운영·장비·교육·마케팅 등 본사 지원이 필요한 사항을 티켓으로
          접수하세요. 담당자가 확인 후 회신드립니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" />
            새 티켓 작성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewTicketForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">내 티켓</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-[12.5px] text-muted-foreground">
              접수된 티켓이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/portal/tickets/${t.id}`}
                  className="block rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{t.subject}</p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {CATEGORY_LABELS[t.category]} ·{" "}
                        {PRIORITY_LABELS[t.priority]} · 메시지 {t._count.messages}개
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        접수: {new Date(t.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[t.status]}`}
                    >
                      {STATUS_LABELS[t.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  OPERATIONS: "운영",
  SYSTEM: "시스템·장비",
  EDUCATION: "교육",
  MARKETING: "마케팅",
  FINANCE: "수납·정산",
  OTHER: "기타",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "낮음",
  NORMAL: "보통",
  HIGH: "높음",
  URGENT: "긴급",
};
