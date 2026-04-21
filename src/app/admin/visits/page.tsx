import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, CalendarDays } from "lucide-react";
import VisitForm from "./VisitForm";
import CompleteForm from "./CompleteForm";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("visits", role)) {
    return <AccessDenied feature="SV 방문 관리" role={role} />;
  }

  let franchisees: Array<{
    id: string;
    name: string;
    region: string;
    centerName: string | null;
  }> = [];
  let visits: Array<{
    id: string;
    scheduledAt: Date;
    visitedAt: Date | null;
    summary: string | null;
    issues: string | null;
    nextAction: string | null;
    supervisor: { name: string };
    franchisee: {
      id: string;
      name: string;
      region: string;
      centerName: string | null;
    };
  }> = [];

  try {
    const [f, v] = await Promise.all([
      prisma.franchisee.findMany({
        where: { status: { in: ["ONBOARDING", "OPERATING"] } },
        select: { id: true, name: true, region: true, centerName: true },
        orderBy: { name: "asc" },
      }),
      prisma.supervisorVisit.findMany({
        orderBy: { scheduledAt: "desc" },
        take: 100,
        include: {
          supervisor: { select: { name: true } },
          franchisee: {
            select: {
              id: true,
              name: true,
              region: true,
              centerName: true,
            },
          },
        },
      }),
    ]);
    franchisees = f;
    visits = v;
  } catch {
    // DB 미연결 / 마이그레이션 필요
  }

  const upcoming = visits.filter((v) => !v.visitedAt);
  const completed = visits.filter((v) => v.visitedAt);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          OPERATIONS · SV
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          SV 방문 관리
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          슈퍼바이저의 가맹점 방문 일정·리포트 관리. 방문 완료 시 요약·이슈·
          다음 액션 기록.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">새 방문 일정 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitForm franchisees={franchisees} />
        </CardContent>
      </Card>

      {/* 예정된 방문 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            예정된 방문 ({upcoming.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">
              예정된 방문이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((v) => {
                const isOverdue = new Date(v.scheduledAt) < new Date();
                return (
                  <div
                    key={v.id}
                    className="rounded-xl border p-3 hover:bg-muted/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold">
                          {v.franchisee.name}
                          {v.franchisee.centerName && (
                            <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                              · {v.franchisee.centerName}
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {v.franchisee.region} · SV {v.supervisor.name}
                        </p>
                        <p className="mt-1 text-[12px]">
                          예정:{" "}
                          <strong
                            className={
                              isOverdue ? "text-rose-600" : "text-primary"
                            }
                          >
                            {new Date(v.scheduledAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </strong>
                          {isOverdue && (
                            <span className="ml-1 rounded-md bg-rose-100 px-1.5 py-0.5 text-[9.5px] font-bold text-rose-700">
                              지연
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <CompleteForm visitId={v.id} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 완료된 방문 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            최근 완료된 방문 ({completed.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completed.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">
              완료된 방문이 아직 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {completed.map((v) => (
                <div key={v.id} className="rounded-xl border bg-muted/10 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-semibold">
                        {v.franchisee.name}
                        {v.franchisee.centerName && (
                          <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                            · {v.franchisee.centerName}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {v.franchisee.region} · SV {v.supervisor.name} ·{" "}
                        방문일{" "}
                        {v.visitedAt &&
                          new Date(v.visitedAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      ✅ 완료
                    </span>
                  </div>
                  {(v.summary || v.issues || v.nextAction) && (
                    <div className="mt-2 space-y-1 rounded-lg bg-white p-2 text-[11.5px]">
                      {v.summary && (
                        <p>
                          <strong>요약:</strong> {v.summary}
                        </p>
                      )}
                      {v.issues && (
                        <p>
                          <strong>이슈:</strong>{" "}
                          <span className="text-rose-700">{v.issues}</span>
                        </p>
                      )}
                      {v.nextAction && (
                        <p>
                          <strong>다음 액션:</strong> {v.nextAction}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
