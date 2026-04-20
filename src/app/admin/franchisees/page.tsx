import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PHASE_META } from "@/lib/checklist";

export const dynamic = "force-dynamic";

export default async function FranchiseesListPage() {
  let franchisees: Array<{
    id: string;
    name: string;
    centerName: string | null;
    region: string;
    status: string;
    targetOpenDate: Date | null;
    currentPhase: number;
    totalItems: number;
    doneItems: number;
  }> = [];
  let phaseBottleneck: Array<{ phase: number; count: number }> = [];

  try {
    const [list, templates] = await Promise.all([
      prisma.franchisee.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          progress: { where: { isChecked: true }, select: { templateId: true } },
        },
      }),
      prisma.checklistTemplate.findMany(),
    ]);
    const totalByPhase = new Map<number, number>();
    const doneByTemplate = new Map<string, number>();
    for (const t of templates) {
      totalByPhase.set(t.phase, (totalByPhase.get(t.phase) ?? 0) + 1);
      doneByTemplate.set(t.id, 0);
    }

    franchisees = list.map((f) => {
      const doneIds = new Set(f.progress.map((p) => p.templateId));
      // 현재 Phase = 미완료 항목이 남아있는 가장 낮은 phase
      const templatesByPhase = new Map<number, string[]>();
      for (const t of templates) {
        if (!templatesByPhase.has(t.phase)) templatesByPhase.set(t.phase, []);
        templatesByPhase.get(t.phase)!.push(t.id);
      }
      let currentPhase = 0;
      for (const [phase, ids] of Array.from(templatesByPhase.entries()).sort(
        (a, b) => a[0] - b[0]
      )) {
        if (ids.some((id) => !doneIds.has(id))) {
          currentPhase = phase;
          break;
        }
      }
      return {
        id: f.id,
        name: f.name,
        centerName: f.centerName,
        region: f.region,
        status: f.status,
        targetOpenDate: f.targetOpenDate,
        currentPhase,
        totalItems: templates.length,
        doneItems: doneIds.size,
      };
    });

    // Phase별 현재 머물러 있는 가맹점 수
    const bottleneckMap = new Map<number, number>();
    for (const f of franchisees) {
      if (f.status === "ONBOARDING") {
        bottleneckMap.set(
          f.currentPhase,
          (bottleneckMap.get(f.currentPhase) ?? 0) + 1
        );
      }
    }
    phaseBottleneck = Array.from(bottleneckMap.entries())
      .map(([phase, count]) => ({ phase, count }))
      .sort((a, b) => b.count - a.count);
  } catch {
    // DB 미연결
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">가맹점 관리</h1>
      </div>

      {/* 요약 통계 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatBox
          label="전체 가맹점"
          value={franchisees.length}
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <StatBox
          label="개업 준비 중"
          value={franchisees.filter((f) => f.status === "ONBOARDING").length}
        />
        <StatBox
          label="운영 중"
          value={franchisees.filter((f) => f.status === "OPERATING").length}
        />
        <StatBox
          label="휴업/해지"
          value={
            franchisees.filter(
              (f) => f.status === "SUSPENDED" || f.status === "TERMINATED"
            ).length
          }
        />
      </div>

      {/* 병목 Phase */}
      {phaseBottleneck.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <span className="inline-flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Phase별 정체 현황 (개업 준비 중)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {phaseBottleneck.map(({ phase, count }) => {
                const meta = PHASE_META[phase];
                const pct = Math.min(
                  100,
                  Math.round(
                    (count /
                      Math.max(
                        1,
                        franchisees.filter((f) => f.status === "ONBOARDING")
                          .length
                      )) *
                      100
                  )
                );
                return (
                  <div key={phase}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-medium">
                        Phase {phase}. {meta?.name}
                      </span>
                      <span className="text-muted-foreground">{count}곳</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>가맹점 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {franchisees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 등록된 가맹점이 없습니다. 문의 관리에서 계약 완료된 건을
              가맹점 계정으로 전환하세요.
            </p>
          ) : (
            <div className="space-y-2">
              {franchisees.map((f) => {
                const pct = Math.round((f.doneItems / f.totalItems) * 100);
                return (
                  <Link
                    key={f.id}
                    href={`/admin/franchisees/${f.id}`}
                    className="block rounded-lg border p-3 hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{f.name}</p>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                            {statusLabel(f.status)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          {f.region} · {f.centerName ?? "센터명 미정"}
                          {f.targetOpenDate && (
                            <>
                              {" "}
                              · 개업 목표:{" "}
                              {new Date(f.targetOpenDate).toLocaleDateString(
                                "ko-KR"
                              )}
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          현재: Phase {f.currentPhase}.{" "}
                          {PHASE_META[f.currentPhase]?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-muted-foreground">
                          진행률
                        </p>
                        <p className="text-[16px] font-bold text-primary">
                          {pct}%
                        </p>
                        <p className="text-[10.5px] text-muted-foreground">
                          {f.doneItems}/{f.totalItems}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11.5px] text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function statusLabel(s: string) {
  switch (s) {
    case "ONBOARDING":
      return "개업 준비";
    case "OPERATING":
      return "운영 중";
    case "SUSPENDED":
      return "휴업";
    case "TERMINATED":
      return "해지";
    default:
      return s;
  }
}
