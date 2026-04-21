"use client";

// ============================================================
// 수익 프로젝션 — Path to Profit (램프 + 코호트 + 누적 현금흐름)
// ============================================================
// 기존 steady-state 월 순이익(-334만원 영원) 대신 시간축을 넣어:
//   - BEP 도달 월 (보수/표준/공격 3시나리오)
//   - 24개월 누적 현금흐름 곡선
//   - 초기투자 1억 회수 기간
//   - 마케팅 예산 슬라이더 (표준 시나리오 조정)
//   - 가정·공식 전부 Accordion으로 공개
// 가맹사업법 §9 과장광고 금지 — 최악 시나리오 동시 표시.
// ============================================================

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Target,
  Wallet,
  AlertTriangle,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  simulateAllPaths,
  RAMP_MODEL_CONSTANTS,
  type PathToProfit,
} from "@/lib/territory/ramp-model";
import type { DemandEstimate } from "@/lib/territory/types";

type Props = {
  demand: DemandEstimate;
};

const CHART_COLORS = {
  conservative: "#94a3b8",
  standard: "#7c3aed",
  aggressive: "#10b981",
};

export default function PathToProfitSection({ demand }: Props) {
  const [standardBudget, setStandardBudget] = useState<number>(
    RAMP_MODEL_CONSTANTS.MARKETING_BY_SCENARIO.standard
  );
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  const paths = useMemo(
    () =>
      simulateAllPaths(
        {
          conservative: demand.conservativeSignupsPerMonth,
          standard: demand.standardSignupsPerMonth,
          aggressive: demand.aggressiveSignupsPerMonth,
        },
        24,
        { standardBudget }
      ),
    [demand, standardBudget]
  );

  // 누적 순이익 차트 데이터 (3시나리오 나란히)
  const cumulativeSeries = useMemo(() => {
    const n = paths.standard.monthly.length;
    return Array.from({ length: n }).map((_, i) => ({
      month: i + 1,
      보수: paths.conservative.monthly[i].cumulativeProfit,
      표준: paths.standard.monthly[i].cumulativeProfit,
      공격: paths.aggressive.monthly[i].cumulativeProfit,
    }));
  }, [paths]);

  // 활성 회원 성장 차트 (표준 시나리오)
  const membersSeries = useMemo(
    () =>
      paths.standard.monthly.map((m) => ({
        month: m.month,
        활성회원: Math.round(m.activeMembers),
        신규: Math.round(m.newSignups),
      })),
    [paths]
  );

  const std = paths.standard;

  return (
    <section className="mb-10">
      {/* 섹션 헤더 */}
      <div className="mb-5 flex items-end justify-between gap-3 border-b border-primary/20 pb-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            PATH TO PROFIT
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-[20px] font-bold sm:text-[24px]">
            <TrendingUp className="h-5 w-5 text-primary" />
            수익 실현 경로 — 24개월 프로젝션
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            직영 3개 센터(강남·반포·위례) 실적 기반 · 6개월 선불 480만원
            일시불 기준 현금흐름 모델
          </p>
        </div>
      </div>

      {/* 메인 KPI 4개 (표준 시나리오) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Target className="h-4 w-4" />}
          label="BEP 도달 시점"
          primary={std.bepMonth ? `${std.bepMonth}개월차` : "24개월 내 미도달"}
          sub={
            std.bepMonth
              ? `월 순이익이 처음 흑자로 전환`
              : `마케팅·수업료 전략 재검토 필요`
          }
          tone={std.bepMonth && std.bepMonth <= 12 ? "success" : "warning"}
        />
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label="24개월 누적 순이익"
          primary={`${std.cumulative24M >= 0 ? "+" : ""}${formatManwon(std.cumulative24M)}`}
          sub={`2년간 누적 현금흐름 (월 마케팅 ${std.marketingBudget}만원)`}
          tone={std.cumulative24M > 0 ? "success" : "danger"}
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="초기투자 회수"
          primary={
            std.paybackMonth
              ? `${std.paybackMonth}개월`
              : `24개월 내 미회수`
          }
          sub={`1억원 초기투자 기준 (가맹·인테리어·장비·교육)`}
          tone={
            std.paybackMonth && std.paybackMonth <= 24 ? "success" : "warning"
          }
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="안정기 월 순이익 (24M)"
          primary={`${std.monthly[23]?.monthlyProfit >= 0 ? "+" : ""}${(std.monthly[23]?.monthlyProfit ?? 0).toLocaleString()}만원`}
          sub={`24개월차 월 활성회원 ${std.peakActiveMembers}명 기준`}
          tone={
            (std.monthly[23]?.monthlyProfit ?? 0) > 0 ? "success" : "warning"
          }
        />
      </div>

      {/* 초기 램프업 설명 배너 (마이너스 시점을 자연스럽게 맥락화) */}
      {std.cumulative12M < 0 && std.bepMonth && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-[11.5px] leading-[1.65] text-blue-900">
          <strong>📊 개업 초기 램프업 구간이 있습니다</strong> — BEP 도달까지의{" "}
          {std.bepMonth}개월은 회원 확보·인지도 구축 기간으로 투자 단계입니다.
          이 구간 누적 손실은{" "}
          <strong>
            {formatManwon(Math.abs(std.cumulative12M))}
          </strong>{" "}
          수준이며, {std.bepMonth}개월차 흑자 전환 후 빠르게 회복해{" "}
          {std.paybackMonth
            ? `${std.paybackMonth}개월차에 초기 투자 1억을 완전 회수`
            : "24개월 내 회수"}
          합니다.
        </div>
      )}

      {/* 누적 현금흐름 차트 */}
      <div className="mt-5 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-bold">24개월 누적 현금흐름</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              등록 시점 480만원 일시불 수납 · 보수/표준/공격 3시나리오 · 1억
              회수선 강조
            </p>
          </div>
          <LegendPill />
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={cumulativeSeries}
              margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.92 0.02 290)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}M`}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) =>
                  v >= 10000 ? `${(v / 10000).toFixed(1)}억` : `${v / 1000}천`
                }
              />
              <Tooltip content={<CumulativeTooltip />} />
              <ReferenceLine
                y={0}
                stroke="#64748b"
                strokeDasharray="2 2"
                label={{
                  value: "BEP",
                  fontSize: 10,
                  fill: "#64748b",
                  position: "insideLeft",
                }}
              />
              <ReferenceLine
                y={RAMP_MODEL_CONSTANTS.INITIAL_INVESTMENT}
                stroke="#7c3aed"
                strokeDasharray="4 2"
                label={{
                  value: "투자 회수 1억",
                  fontSize: 10,
                  fill: "#7c3aed",
                  position: "insideTopLeft",
                }}
              />
              <Line
                type="monotone"
                dataKey="보수"
                stroke={CHART_COLORS.conservative}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="표준"
                stroke={CHART_COLORS.standard}
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="공격"
                stroke={CHART_COLORS.aggressive}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 마케팅 예산 슬라이더 (표준 시나리오) */}
        <div className="mt-4 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="marketing-slider"
              className="text-[12.5px] font-semibold"
            >
              📢 표준 시나리오 월 마케팅 예산
            </label>
            <span className="rounded-md bg-primary px-2 py-0.5 text-[12px] font-bold text-white">
              {standardBudget.toLocaleString()}만원
            </span>
          </div>
          <input
            id="marketing-slider"
            type="range"
            min={100}
            max={500}
            step={25}
            value={standardBudget}
            onChange={(e) => setStandardBudget(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10.5px] text-muted-foreground">
            <span>100</span>
            <span>250 (기본)</span>
            <span>500</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            슬라이더 조정 시 보수(-100)·공격(+150) 예산도 비례 이동하며 차트가
            실시간 재계산됩니다.
          </p>
        </div>
      </div>

      {/* 활성 회원 성장 곡선 (표준) */}
      <div className="mt-5 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold">활성 회원 성장 곡선</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              표준 시나리오 기준 · 24개월차 피크{" "}
              <strong className="text-primary">
                {std.peakActiveMembers}명
              </strong>
            </p>
          </div>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={membersSeries}
              margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
            >
              <defs>
                <linearGradient id="membersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.92 0.02 290)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}M`}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                labelFormatter={(v) => `개업 ${v}개월차`}
                formatter={(v) => [`${v}명`, "활성 회원"]}
              />
              <Area
                type="monotone"
                dataKey="활성회원"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#membersGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 시나리오 비교 표 */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="border-b border-border/60 bg-muted/30 p-4">
          <h3 className="text-[14px] font-bold">시나리오 비교</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            동일 입지에서 마케팅 강도에 따른 24개월 결과 비교
          </p>
        </div>
        <div className="grid grid-cols-4 text-[12px]">
          <div className="border-r border-border/60 bg-muted/10 p-3 text-[11px] font-semibold text-muted-foreground">
            <p>&nbsp;</p>
            <p className="mt-2">월 마케팅 예산</p>
            <p className="mt-2">BEP 도달</p>
            <p className="mt-2">12개월 누적</p>
            <p className="mt-2">24개월 누적</p>
            <p className="mt-2">24개월차 회원</p>
            <p className="mt-2">투자 회수</p>
          </div>
          <ScenarioColumn label="보수" data={paths.conservative} accent="#94a3b8" />
          <ScenarioColumn
            label="표준"
            data={paths.standard}
            accent="#7c3aed"
            highlight
          />
          <ScenarioColumn label="공격" data={paths.aggressive} accent="#10b981" />
        </div>
      </div>

      {/* 가정·공식 Accordion */}
      <div className="mt-5 rounded-2xl border border-border/60 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setAssumptionsOpen((v) => !v)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="flex items-center gap-2 text-[13px] font-bold">
            <Info className="h-4 w-4 text-primary" />
            모델 가정·공식 상세 (투명성)
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${assumptionsOpen ? "rotate-180" : ""}`}
          />
        </button>
        {assumptionsOpen && (
          <div className="space-y-3 border-t border-border/60 p-5 text-[11.5px] leading-[1.65]">
            <AssumptionRow
              title="현금 기반(Cash-basis) 수입 모델"
              body="두비전은 6개월 선불 480만원 일시불 수납. 따라서 매출을 월 80만원 분할 인식(accrual)하지 않고, 등록 발생 월에 480만원을 전액 현금 수입으로 처리. 가맹점주 실제 통장 잔액과 일치."
            />
            <AssumptionRow
              title="램프업 S-curve (신규 등록)"
              body="개업 첫 달은 홍보·인지도 구축 기간. 신규 등록은 월 차가 지날수록 steady state에 수렴 (1 - e^(-k·m)). 마케팅 예산이 클수록 k(램프 속도)와 상한이 증가."
            />
            <AssumptionRow
              title="세대별 재등록률 (장기 연장 고객 반영)"
              body="재등록은 한번 할수록 잔류 확률이 상승 (성과 체감 + 몰입도 누적). 신규→1차 재등록 65% · 1차→2차 75% · 2차→3차 80% · 3차 이상 85%. 장기 수강생(2~3년)이 일정 비율 존재함을 반영. 직영 3개점 평균."
            />
            <AssumptionRow
              title="월 수입 공식"
              body="월 매출(현금) = 해당 월 등록 결제 건수 × 480만원 = (신규 등록 + 재등록) × 480 | 본사 공급원가 = 매출 × 22.5% (로열티 10% + 앱교재비 12.5%) | 월 고정비 = 1,300만원(임대 400 + 인건비 700 + 기타 200) + 마케팅 예산 | 순이익 = 매출 − 공급원가 − 고정비 − 마케팅"
            />
            <AssumptionRow
              title="활성 회원 정의"
              body="월말 기준 '선불 유효기간(등록 후 6개월) 내'에 있는 회원 수. 등록 7개월째에 재등록하지 않으면 비활성으로 분류. 마케팅·운영 전략 수립 시 이 회원 수를 기준으로 수업 편성."
            />
            <AssumptionRow
              title="초기 투자금"
              body="1억원 기준 — 가맹비 1,000만원 + 교육비 1,500만원 + 인테리어 2,500~3,000만원 + 장비 1,500만원 + 임대보증금 2,500~3,000만원 = 약 9,500~1억1,000만원"
            />
            <AssumptionRow
              title="법적 고지 (가맹사업법 §9)"
              body="본 수치는 직영 3개점 실적 기반 추정치이며 개별 가맹점 결과는 입지·운영자 역량·시장 상황에 따라 상이할 수 있습니다. 재등록률·유지율은 변동 가능 — 보수 시나리오도 함께 확인하시기 바랍니다."
              warning
            />
          </div>
        )}
      </div>

      {/* 보수(최악) 시나리오 주의 배너 */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11.5px] leading-[1.6] text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>보수(최악) 시나리오 동시 안내</strong> — 경쟁 심화·마케팅
          효율 저조 시 BEP{" "}
          {paths.conservative.bepMonth ?? "미도달"}
          {paths.conservative.bepMonth ? "개월" : ""} · 24개월 누적{" "}
          <strong>
            {paths.conservative.cumulative24M >= 0 ? "+" : ""}
            {paths.conservative.cumulative24M.toLocaleString()}만원
          </strong>
          . 투자 결정 시 반드시 보수 시나리오를 기준으로 검토하세요.
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------
// KPI 카드
// ----------------------------------------------------------

function KpiCard({
  icon,
  label,
  primary,
  sub,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  sub: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50"
          : "border-border/60 bg-white";
  const primaryColor =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warning"
        ? "text-amber-700"
        : tone === "danger"
          ? "text-rose-700"
          : "text-foreground";
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${toneClass}`}>
      <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={`mt-3 text-[26px] font-black leading-none ${primaryColor}`}>
        {primary}
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

// ----------------------------------------------------------
// 시나리오 비교 컬럼
// ----------------------------------------------------------

function ScenarioColumn({
  label,
  data,
  accent,
  highlight = false,
}: {
  label: string;
  data: PathToProfit;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 text-center ${highlight ? "bg-primary/5" : ""} border-r border-border/60 last:border-r-0`}
    >
      <p
        className="text-[12.5px] font-bold"
        style={{ color: accent }}
      >
        {label}
        {highlight && <span className="ml-1 text-[9px]">(기본)</span>}
      </p>
      <p className="mt-2 text-[13px] font-semibold">
        {data.marketingBudget.toLocaleString()}만원
      </p>
      <p className="mt-2 text-[13px] font-semibold">
        {data.bepMonth ? `${data.bepMonth}개월` : "미도달"}
      </p>
      <p
        className={`mt-2 text-[13px] font-semibold ${data.cumulative12M >= 0 ? "text-emerald-700" : "text-rose-600"}`}
      >
        {data.cumulative12M >= 0 ? "+" : ""}
        {data.cumulative12M.toLocaleString()}
      </p>
      <p
        className={`mt-2 text-[13px] font-semibold ${data.cumulative24M >= 0 ? "text-emerald-700" : "text-rose-600"}`}
      >
        {data.cumulative24M >= 0 ? "+" : ""}
        {data.cumulative24M.toLocaleString()}
      </p>
      <p className="mt-2 text-[13px] font-semibold">
        {data.peakActiveMembers}명
      </p>
      <p className="mt-2 text-[13px] font-semibold">
        {data.paybackMonth ? `${data.paybackMonth}개월` : "미회수"}
      </p>
    </div>
  );
}

// ----------------------------------------------------------
// 범례 Pill
// ----------------------------------------------------------

function LegendPill() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10.5px]">
      {(
        [
          ["보수", CHART_COLORS.conservative],
          ["표준", CHART_COLORS.standard],
          ["공격", CHART_COLORS.aggressive],
        ] as const
      ).map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="h-1 w-5 rounded-full"
            style={{ background: color }}
          />
          <span className="font-medium">{label}</span>
        </span>
      ))}
    </div>
  );
}

// ----------------------------------------------------------
// 커스텀 툴팁 (누적 차트)
// ----------------------------------------------------------

type TooltipPayload = {
  name: string;
  value: number;
  color: string;
};

function CumulativeTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number | string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white p-2.5 text-[11px] shadow-md">
      <p className="font-bold">개업 {label}개월차</p>
      <div className="mt-1.5 space-y-0.5">
        {payload.map((p) => (
          <p
            key={p.name}
            className="flex items-center gap-1.5"
            style={{ color: p.color }}
          >
            <span
              className="h-1 w-3 rounded-full"
              style={{ background: p.color }}
            />
            {p.name} : {p.value >= 0 ? "+" : ""}
            {p.value.toLocaleString()}만원
          </p>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// 가정 로우
// ----------------------------------------------------------

function AssumptionRow({
  title,
  body,
  warning = false,
}: {
  title: string;
  body: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 ${warning ? "border border-amber-300 bg-amber-50 text-amber-900" : "bg-muted/30"}`}
    >
      <p className="text-[12px] font-bold">{title}</p>
      <p className="mt-1 text-[11px] leading-[1.65]">{body}</p>
    </div>
  );
}

// 억/만원 단위로 예쁘게 포맷: 12345 → "1.2억원", 4321 → "4,321만원"
function formatManwon(manwon: number): string {
  const abs = Math.abs(manwon);
  if (abs >= 10000) {
    const 억 = manwon / 10000;
    return `${억.toFixed(1)}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}

// Unused import avoid
void Legend;
