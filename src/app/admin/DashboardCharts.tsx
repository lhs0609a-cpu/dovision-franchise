"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type Props = {
  pipelineCounts: { status: string; label: string; count: number }[];
  monthlyInquiryTrend: { month: string; inquiries: number; contracted: number }[];
  monthlyRoyaltyTrend: { month: string; royalty: number }[];
};

const PIPELINE_COLORS: Record<string, string> = {
  NEW: "#64748b",
  CONTACTED: "#3b82f6",
  CONSULTING: "#8b5cf6",
  VISITED: "#f59e0b",
  CONTRACTED: "#10b981",
  REJECTED: "#ef4444",
};

export default function DashboardCharts({
  pipelineCounts,
  monthlyInquiryTrend,
  monthlyRoyaltyTrend,
}: Props) {
  const pipelineData = pipelineCounts.map((p) => ({
    ...p,
    color: PIPELINE_COLORS[p.status] ?? "#94a3b8",
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* 월별 문의·계약 추세 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
        <div className="mb-3">
          <h3 className="text-[14px] font-bold">
            월별 가맹 문의 · 계약 추세 (최근 12개월)
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            문의 유입량 대비 계약 체결량 — 전환 성과 추적
          </p>
        </div>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyInquiryTrend}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                labelFormatter={(v) => `${v}`}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="inquiries"
                name="문의"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="contracted"
                name="계약 체결"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 파이프라인 분포 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h3 className="text-[14px] font-bold">단계별 파이프라인 분포</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            현재 각 단계에 머무르고 있는 건수
          </p>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pipelineData}
              margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="count" name="건수" radius={[4, 4, 0, 0]}>
                {pipelineData.map((entry) => (
                  <Bar
                    key={entry.status}
                    dataKey="count"
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 월별 로열티 추세 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h3 className="text-[14px] font-bold">
            월별 본사 로열티 수입 (추정)
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            활성 가맹점 × 평균 매출 × 10% (실측 도입 전 근사값)
          </p>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRoyaltyTrend}
              margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
            >
              <defs>
                <linearGradient id="royaltyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) =>
                  v >= 10000
                    ? `${(v / 10000).toFixed(1)}억`
                    : `${v / 1000}천`
                }
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v) => [`${Number(v).toLocaleString()}만원`, "로열티"]}
              />
              <Bar
                dataKey="royalty"
                fill="url(#royaltyGrad)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
