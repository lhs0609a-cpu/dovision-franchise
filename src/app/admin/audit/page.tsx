import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { AUDIT_ACTION_LABELS } from "@/lib/admin/audit";
import { History, User, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParamsShape = Promise<{
  action?: string;
  actorType?: string;
  q?: string;
}>;

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: SearchParamsShape;
}) {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("audit", role)) {
    return <AccessDenied feature="감사 로그" role={role} />;
  }
  const sp = await searchParams;

  let logs: Array<{
    id: string;
    actorId: string;
    actorType: string;
    actorName: string;
    action: string;
    entityType: string | null;
    entityId: string | null;
    meta: unknown;
    ip: string | null;
    createdAt: Date;
  }> = [];
  try {
    logs = await prisma.auditLog.findMany({
      where: {
        action: sp.action || undefined,
        actorType: sp.actorType || undefined,
        ...(sp.q
          ? {
              OR: [
                { actorName: { contains: sp.q, mode: "insensitive" } },
                { entityId: { contains: sp.q } },
                { ip: { contains: sp.q } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch {
    // DB 미연결 / 마이그레이션 미적용
  }

  const actions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          SYSTEM · AUDIT
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <History className="h-5 w-5 text-primary" />
          감사 로그
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          중요 액션 (계약서 활성화·가맹점 상태 변경·권한 변경 등)의 실행자·
          시각·IP 기록. 슈퍼관리자만 열람 가능.
        </p>
      </div>

      {/* 필터 */}
      <form className="flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3">
        <input
          type="text"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="이름·엔티티ID·IP 검색"
          className="flex-1 min-w-[180px] rounded-md border bg-background px-2 py-1 text-[12px]"
        />
        <select
          name="action"
          defaultValue={sp.action ?? ""}
          className="rounded-md border bg-background px-2 py-1 text-[12px]"
        >
          <option value="">모든 액션</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {AUDIT_ACTION_LABELS[a] ?? a}
            </option>
          ))}
        </select>
        <select
          name="actorType"
          defaultValue={sp.actorType ?? ""}
          className="rounded-md border bg-background px-2 py-1 text-[12px]"
        >
          <option value="">모든 사용자</option>
          <option value="admin">관리자</option>
          <option value="franchisee">가맹점주</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1 text-[12px] font-semibold text-white hover:bg-primary/90"
        >
          필터
        </button>
      </form>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-[12px]">
          <thead className="bg-muted/40 text-left text-[10.5px] font-semibold text-muted-foreground">
            <tr>
              <th className="px-3 py-2">시각</th>
              <th className="px-3 py-2">실행자</th>
              <th className="px-3 py-2">액션</th>
              <th className="px-3 py-2">대상</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">상세</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-muted-foreground"
                >
                  로그가 없습니다.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="border-t hover:bg-muted/20">
                  <td className="whitespace-nowrap px-3 py-2 text-[10.5px] text-muted-foreground">
                    {new Date(l.createdAt).toLocaleString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      {l.actorType === "admin" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Building2 className="h-3 w-3" />
                      )}
                      {l.actorName}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
                      {AUDIT_ACTION_LABELS[l.action] ?? l.action}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {l.entityType ? (
                      <>
                        {l.entityType}
                        {l.entityId && (
                          <span className="ml-1 text-[10px]">
                            #{l.entityId.slice(0, 6)}
                          </span>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-[10.5px] text-muted-foreground">
                    {l.ip ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-[10.5px] text-muted-foreground">
                    {l.meta ? (
                      <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                        {JSON.stringify(l.meta).slice(0, 60)}
                      </code>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[10.5px] text-muted-foreground">
        최근 200건 표시. Postgres ON-DISK 영구 보존. 법적 감사 대응 시 전체
        dump는 SUPER_ADMIN 권한으로 DB 직접 조회 필요.
      </p>
    </div>
  );
}
