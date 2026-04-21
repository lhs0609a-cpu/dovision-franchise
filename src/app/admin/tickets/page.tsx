import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import Link from "next/link";
import { MessageCircleQuestion, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; color: string; order: number }> = {
  OPEN: { label: "접수", color: "bg-slate-100 text-slate-700", order: 0 },
  IN_PROGRESS: { label: "처리 중", color: "bg-blue-100 text-blue-700", order: 1 },
  WAITING: { label: "회신 대기", color: "bg-amber-100 text-amber-700", order: 2 },
  RESOLVED: { label: "해결됨", color: "bg-emerald-100 text-emerald-700", order: 3 },
  CLOSED: { label: "종료", color: "bg-muted text-muted-foreground", order: 4 },
};

const PRIORITY_META: Record<string, { label: string; color: string; order: number }> = {
  URGENT: { label: "긴급", color: "bg-rose-100 text-rose-700", order: 0 },
  HIGH: { label: "높음", color: "bg-orange-100 text-orange-700", order: 1 },
  NORMAL: { label: "보통", color: "bg-muted text-muted-foreground", order: 2 },
  LOW: { label: "낮음", color: "bg-slate-100 text-slate-600", order: 3 },
};

export default async function AdminTicketsPage() {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("tickets", role)) {
    return <AccessDenied feature="CS 티켓" role={role} />;
  }

  let tickets: Array<{
    id: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    updatedAt: Date;
    franchisee: { name: string; region: string; centerName: string | null };
    _count: { messages: number };
  }> = [];
  try {
    tickets = await prisma.ticket.findMany({
      include: {
        franchisee: {
          select: { name: true, region: true, centerName: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });
  } catch {
    // DB
  }

  // 상태 × 우선순위로 정렬
  tickets.sort((a, b) => {
    const sa = STATUS_META[a.status]?.order ?? 9;
    const sb = STATUS_META[b.status]?.order ?? 9;
    if (sa !== sb) return sa - sb;
    return (PRIORITY_META[a.priority]?.order ?? 9) - (PRIORITY_META[b.priority]?.order ?? 9);
  });

  const urgent = tickets.filter(
    (t) => t.priority === "URGENT" && t.status !== "CLOSED"
  );
  const open = tickets.filter(
    (t) =>
      t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING"
  );
  const closed = tickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          CS
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <MessageCircleQuestion className="h-5 w-5 text-primary" />
          CS 티켓
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          가맹점주가 제기한 이슈·건의 사항. 긴급 티켓 최상단 · 상태별 정렬.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatBox label="긴급" value={urgent.length} tone="danger" />
        <StatBox label="미해결" value={open.length} tone="warning" />
        <StatBox label="해결/종료" value={closed.length} tone="success" />
        <StatBox label="전체" value={tickets.length} />
      </div>

      {urgent.length > 0 && (
        <Card className="border-rose-300 bg-rose-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-rose-900">
              <AlertTriangle className="h-4 w-4" />
              긴급 티켓 ({urgent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TicketList tickets={urgent} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">미해결 ({open.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList tickets={open} />
        </CardContent>
      </Card>

      {closed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              해결/종료 ({closed.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TicketList tickets={closed} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TicketList({
  tickets,
}: {
  tickets: Array<{
    id: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    updatedAt: Date;
    franchisee: { name: string; region: string; centerName: string | null };
    _count: { messages: number };
  }>;
}) {
  if (tickets.length === 0) {
    return (
      <p className="text-[12.5px] text-muted-foreground">티켓 없음</p>
    );
  }
  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <Link
          key={t.id}
          href={`/admin/tickets/${t.id}`}
          className="block rounded-lg border p-3 hover:bg-accent"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate font-semibold">{t.subject}</p>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${PRIORITY_META[t.priority]?.color}`}
                >
                  {PRIORITY_META[t.priority]?.label}
                </span>
              </div>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {t.franchisee.name}
                {t.franchisee.centerName && ` · ${t.franchisee.centerName}`} ·{" "}
                {t.franchisee.region}
              </p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {t.category} · 메시지 {t._count.messages}개 · 최근 업데이트{" "}
                {new Date(t.updatedAt).toLocaleString("ko-KR")}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_META[t.status]?.color}`}
            >
              {STATUS_META[t.status]?.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "danger" | "warning" | "success";
}) {
  const color =
    tone === "danger"
      ? "border-rose-300 bg-rose-50 text-rose-700"
      : tone === "warning"
        ? "border-amber-300 bg-amber-50 text-amber-700"
        : tone === "success"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "bg-white";
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-[11px] font-semibold">{label}</p>
      <p className="mt-1 text-[22px] font-black">{value}</p>
    </div>
  );
}
