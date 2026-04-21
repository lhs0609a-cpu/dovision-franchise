import { getDashboardData } from "@/lib/admin/dashboard-data";
import DashboardCharts from "./DashboardCharts";
import {
  Building2,
  MessageSquare,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wallet,
  TrendingUp,
  PauseCircle,
  FileCheck,
  Activity,
  Percent,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const k = data.kpis;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
            DOVISION HQ · OVERVIEW
          </p>
          <h1 className="mt-0.5 text-[22px] font-bold">대시보드</h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            가맹본부 운영 현황 · 실시간 지표 ·{" "}
            {new Date().toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>

      {/* KPI 12개 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={Building2}
          label="전체 가맹점"
          value={k.totalFranchisees}
          sub={`운영 ${k.activeFranchisees}곳`}
        />
        <Kpi
          icon={TrendingUp}
          label="이번 달 신규 가맹"
          value={k.newThisMonth}
          sub="계약 체결 기준"
          tone={k.newThisMonth > 0 ? "success" : undefined}
        />
        <Kpi
          icon={PauseCircle}
          label="해지 가맹점"
          value={k.terminatedFranchisees}
          sub="누적 해지"
          tone={k.terminatedFranchisees > 0 ? "danger" : undefined}
        />
        <Kpi
          icon={Wallet}
          label="월 로열티 수입 (추정)"
          value={`${k.monthlyRoyalty.toLocaleString()}만원`}
          sub="활성 가맹점 × 평균매출 × 10%"
          tone="success"
          compact
        />

        <Kpi
          icon={MessageSquare}
          label="이번 달 신규 문의"
          value={k.newInquiriesThisMonth}
          sub={`누적 ${k.totalInquiries}건`}
        />
        <Kpi
          icon={UserPlus}
          label="미대응 문의 (신규)"
          value={k.pendingInquiries}
          sub="상담 연결 필요"
          tone={k.pendingInquiries > 5 ? "warning" : undefined}
        />
        <Kpi
          icon={AlertTriangle}
          label="SLA 24h 초과"
          value={k.slaOverdue}
          sub="24시간 미대응"
          tone={k.slaOverdue > 0 ? "danger" : "success"}
        />
        <Kpi
          icon={Percent}
          label="문의→계약 전환율"
          value={`${k.conversionRate}%`}
          sub="누적 기준"
          tone={k.conversionRate >= 10 ? "success" : undefined}
        />

        <Kpi
          icon={Clock}
          label="정보공개서 숙고중"
          value={k.contractsPending}
          sub="14일 법정 대기"
          tone={k.contractsPending > 0 ? "warning" : undefined}
        />
        <Kpi
          icon={FileCheck}
          label="계약 동의율"
          value={`${k.contractAgreedRate}%`}
          sub="활성 계약서 기준"
          tone={k.contractAgreedRate >= 80 ? "success" : "warning"}
        />
        <Kpi
          icon={Activity}
          label="파이프라인 합계"
          value={data.pipelineCounts
            .filter(
              (p) => p.status !== "CONTRACTED" && p.status !== "REJECTED"
            )
            .reduce((s, p) => s + p.count, 0)}
          sub="진행 중인 가맹 건수"
        />
        <Kpi
          icon={CheckCircle}
          label="운영 가맹점 비율"
          value={`${
            k.totalFranchisees > 0
              ? Math.round((k.activeFranchisees / k.totalFranchisees) * 100)
              : 0
          }%`}
          sub="전체 중 운영 중"
          tone="success"
        />
      </div>

      {/* 차트 영역 */}
      <DashboardCharts
        pipelineCounts={data.pipelineCounts}
        monthlyInquiryTrend={data.monthlyInquiryTrend}
        monthlyRoyaltyTrend={data.monthlyRoyaltyTrend}
      />
    </div>
  );
}

// ----------------------------------------------------------
// KPI 카드
// ----------------------------------------------------------

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
  tone?: "success" | "warning" | "danger";
  compact?: boolean;
}) {
  const toneColor =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : tone === "danger"
          ? "text-rose-600"
          : "text-foreground";
  const dotColor =
    tone === "success"
      ? "bg-emerald-500"
      : tone === "warning"
        ? "bg-amber-500"
        : tone === "danger"
          ? "bg-rose-500"
          : "bg-slate-300";
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
          aria-hidden
        />
      </div>
      <p
        className={`mt-2 ${compact ? "text-[18px]" : "text-[24px]"} font-black leading-none ${toneColor}`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && (
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}
