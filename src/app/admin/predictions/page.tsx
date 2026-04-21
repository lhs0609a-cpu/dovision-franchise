import { auth } from "@/lib/auth";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { computeChurnRisks } from "@/lib/admin/predictions";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("predictions", role)) {
    return <AccessDenied feature="예측 분석" role={role} />;
  }

  const risks = await computeChurnRisks();
  risks.sort((a, b) => b.riskScore - a.riskScore);

  const critical = risks.filter((r) => r.riskLevel === "CRITICAL");
  const high = risks.filter((r) => r.riskLevel === "HIGH");
  const medium = risks.filter((r) => r.riskLevel === "MEDIUM");
  const low = risks.filter((r) => r.riskLevel === "LOW");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          ANALYTICS · PREDICTIONS
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <TrendingUp className="h-5 w-5 text-primary" />
          해지 위험 예측
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          6개 운영 시그널(SV 방문·이슈·교육 이수·체크리스트·계약 동의·개업
          지연)의 가중 합산으로 가맹점별 해지 위험도 추정
        </p>
      </div>

      {/* 위험도 분포 */}
      <div className="grid gap-3 sm:grid-cols-4">
        <RiskSummary level="CRITICAL" count={critical.length} />
        <RiskSummary level="HIGH" count={high.length} />
        <RiskSummary level="MEDIUM" count={medium.length} />
        <RiskSummary level="LOW" count={low.length} />
      </div>

      {/* 긴급 대응 필요 */}
      {critical.length + high.length > 0 && (
        <Card className="border-rose-300 bg-rose-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-rose-900">
              <AlertTriangle className="h-4 w-4" />
              긴급/고위험 가맹점 ({critical.length + high.length}곳)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-[11.5px] text-rose-900/70">
              72시간 내 SV 방문·본사 개입 권장. 본사 담당자에게 티켓 자동
              할당 검토.
            </p>
            <div className="space-y-3">
              {[...critical, ...high].map((r) => (
                <RiskCard key={r.id} risk={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 나머지 */}
      {medium.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              중위험 가맹점 ({medium.length}곳)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medium.map((r) => (
                <RiskCard key={r.id} risk={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {low.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              안정 가맹점 ({low.length}곳)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {low.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/franchisees/${r.id}`}
                  className="flex items-center justify-between rounded-md border bg-white p-2.5 text-[12px] hover:bg-muted/30"
                >
                  <span>
                    <strong>{r.name}</strong>{" "}
                    <span className="text-muted-foreground">· {r.region}</span>
                  </span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700">
                    {r.riskScore}점
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {risks.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-[12.5px] text-muted-foreground">
          운영 중/준비 중 가맹점이 없어 예측할 대상이 없습니다.
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-[11.5px] text-blue-900">
        📌 본 예측은 휴리스틱 모델입니다. 실제 해지 사례가 누적되면 모델 계수를
        재학습할 예정입니다. 높은 위험도가 반드시 해지를 의미하지 않으며,
        본사가 선제적으로 개입할 신호로 활용하세요.
      </div>
    </div>
  );
}

function RiskSummary({
  level,
  count,
}: {
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  count: number;
}) {
  const meta = {
    CRITICAL: { label: "긴급", color: "bg-rose-50 border-rose-300 text-rose-700", icon: ShieldAlert },
    HIGH: { label: "고위험", color: "bg-orange-50 border-orange-300 text-orange-700", icon: ShieldAlert },
    MEDIUM: { label: "중위험", color: "bg-amber-50 border-amber-300 text-amber-700", icon: Shield },
    LOW: { label: "안정", color: "bg-emerald-50 border-emerald-300 text-emerald-700", icon: ShieldCheck },
  }[level];
  const Icon = meta.icon;
  return (
    <div className={`rounded-xl border p-4 ${meta.color}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold">
        <Icon className="h-3.5 w-3.5" />
        {meta.label}
      </div>
      <p className="mt-2 text-[22px] font-black leading-none">{count}곳</p>
    </div>
  );
}

function RiskCard({
  risk,
}: {
  risk: Awaited<ReturnType<typeof computeChurnRisks>>[number];
}) {
  const dotColor =
    risk.riskLevel === "CRITICAL"
      ? "bg-rose-500"
      : risk.riskLevel === "HIGH"
        ? "bg-orange-500"
        : risk.riskLevel === "MEDIUM"
          ? "bg-amber-500"
          : "bg-emerald-500";
  return (
    <Link
      href={`/admin/franchisees/${risk.id}`}
      className="block rounded-xl border bg-white p-3 hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            <p className="font-bold">{risk.name}</p>
            {risk.centerName && (
              <span className="text-[11px] text-muted-foreground">
                · {risk.centerName}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {risk.region} · {risk.status === "OPERATING" ? "운영 중" : "개업 준비"} · 운영{" "}
            {risk.monthsOpen}개월
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">위험도</p>
          <p className="text-[20px] font-black leading-none">
            {risk.riskScore}
            <span className="text-[11px] font-normal text-muted-foreground">
              /100
            </span>
          </p>
        </div>
      </div>

      {/* 점수 바 */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={dotColor}
          style={{ width: `${risk.riskScore}%`, height: "100%" }}
        />
      </div>

      {/* 팩터 상세 */}
      <div className="mt-3 grid gap-1.5 text-[10.5px] sm:grid-cols-2">
        {risk.factors.map((f) => (
          <div
            key={f.code}
            className={`flex items-center justify-between rounded-md px-2 py-1 ${
              f.actual > f.weight * 0.6
                ? "bg-rose-50 text-rose-700"
                : f.actual > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-muted/40 text-muted-foreground"
            }`}
          >
            <span className="truncate">{f.label}: {f.detail}</span>
            <span className="ml-2 shrink-0 font-bold">
              +{f.actual}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
}
