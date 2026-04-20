import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PHASE_META } from "@/lib/checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Circle, Shield } from "lucide-react";
import VerifyButton from "./VerifyButton";
import StatusForm from "./StatusForm";

export const dynamic = "force-dynamic";

export default async function FranchiseeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const franchisee = await prisma.franchisee.findUnique({
    where: { id },
    include: {
      progress: true,
      documents: true,
      inquiry: true,
    },
  });
  if (!franchisee) notFound();

  const templates = await prisma.checklistTemplate.findMany({
    orderBy: [{ phase: "asc" }, { order: "asc" }],
  });
  const progressByTemplate = new Map(
    franchisee.progress.map((p) => [p.templateId, p])
  );
  const byPhase = new Map<number, typeof templates>();
  for (const t of templates) {
    if (!byPhase.has(t.phase)) byPhase.set(t.phase, []);
    byPhase.get(t.phase)!.push(t);
  }

  const total = templates.length;
  const done = franchisee.progress.filter((p) => p.isChecked).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/franchisees"
        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        가맹점 목록
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{franchisee.name}</h1>
          <p className="text-[12.5px] text-muted-foreground">
            {franchisee.region} · {franchisee.centerName ?? "센터명 미정"} ·{" "}
            {franchisee.email}
          </p>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            가입일:{" "}
            {new Date(franchisee.createdAt).toLocaleDateString("ko-KR")}
            {franchisee.targetOpenDate && (
              <>
                {" "}
                · 개업 목표:{" "}
                {new Date(franchisee.targetOpenDate).toLocaleDateString(
                  "ko-KR"
                )}
              </>
            )}
            {franchisee.infoDisclosureReceivedAt && (
              <>
                {" "}
                · 정보공개서 수령:{" "}
                {new Date(
                  franchisee.infoDisclosureReceivedAt
                ).toLocaleDateString("ko-KR")}
              </>
            )}
          </p>
        </div>
        <StatusForm
          franchiseeId={franchisee.id}
          currentStatus={franchisee.status}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">전체 진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[22px] font-bold">
            {done}
            <span className="text-muted-foreground"> / {total}</span>
            <span className="ml-2 text-[14px] text-primary">({pct}%)</span>
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Phase별 상세 */}
      <div className="space-y-3">
        {Array.from(byPhase.keys())
          .sort((a, b) => a - b)
          .map((phase) => {
            const list = byPhase.get(phase)!;
            const phaseDone = list.filter(
              (t) => progressByTemplate.get(t.id)?.isChecked
            ).length;
            const meta = PHASE_META[phase];
            return (
              <Card key={phase}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Phase {phase}. {meta?.name}
                    <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                      {meta?.window} · {phaseDone}/{list.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {list.map((t) => {
                      const p = progressByTemplate.get(t.id);
                      return (
                        <div
                          key={t.id}
                          className="flex items-start justify-between gap-3 rounded-md border p-2.5"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            {p?.isChecked ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-medium">
                                {t.title}
                                {t.isLegalRequired && (
                                  <span className="ml-1.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                                    법정
                                  </span>
                                )}
                              </p>
                              {p?.note && (
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  메모: {p.note}
                                </p>
                              )}
                              {p?.checkedAt && (
                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                  체크일:{" "}
                                  {new Date(p.checkedAt).toLocaleDateString(
                                    "ko-KR"
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <VerifyButton
                            franchiseeId={franchisee.id}
                            templateId={t.id}
                            verified={!!p?.adminVerifiedAt}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* 제출 서류 */}
      {franchisee.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">제출 서류</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-[12.5px]">
              {franchisee.documents.map((d) => (
                <li key={d.id}>
                  <Shield className="mr-1 inline h-3.5 w-3.5" />
                  [{d.category}] {d.fileName} ·{" "}
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    다운로드
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
