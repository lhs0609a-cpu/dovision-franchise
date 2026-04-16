"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

// 기본계획서 기준 상수
const PREPAY_6M = 480; // 6개월 선불 등록비 (만원) = 80만원 × 6개월
const INITIAL_INVESTMENT = 10000; // 초기 투자비 1억원 (만원 단위)

export default function ROICalculator() {
  // 월 신규등록 회원 수 (기본계획서 표 범위 3~15명)
  const [newSignups, setNewSignups] = useState(5);
  // 월 고정 지출 (기본계획서 1,300~1,800 범위, 기본값 1,800)
  const [fixedCost, setFixedCost] = useState(1800);

  const monthlyRevenue = newSignups * PREPAY_6M;
  const monthlyProfit = monthlyRevenue - fixedCost;

  // 12개월 누적 수익 시뮬레이션 (매월 동일 신규등록 가정)
  const data = useMemo(() => {
    let cumulative = -INITIAL_INVESTMENT;
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const rev = newSignups * PREPAY_6M;
      const cost = fixedCost;
      const profit = rev - cost;
      cumulative += profit;
      return {
        month: `${month}월`,
        매출: rev,
        순이익: profit,
        누적: cumulative,
      };
    });
  }, [newSignups, fixedCost]);

  const bepIndex = data.findIndex((d) => d.누적 >= 0);
  const bepMonth = bepIndex >= 0 ? bepIndex + 1 : -1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>조건 설정</CardTitle>
          <p className="mt-1 text-[12px] text-muted-foreground sm:text-[13px]">
            기본계획서 기준 · 6개월 선불 등록비 480만원(월 80만원 × 6개월)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>월 신규등록 회원: {newSignups}명</Label>
              <Input
                type="range"
                min={3}
                max={15}
                value={newSignups}
                onChange={(e) => setNewSignups(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3명 (BEP 근접)</span>
                <span>15명</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                월 매출 = {newSignups}명 × 480만원 ={" "}
                <span className="font-bold text-foreground">
                  {monthlyRevenue.toLocaleString()}만원
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Label>월 고정 지출: {fixedCost.toLocaleString()}만원</Label>
              <Input
                type="range"
                min={1300}
                max={2000}
                step={50}
                value={fixedCost}
                onChange={(e) => setFixedCost(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1,300만원</span>
                <span>2,000만원</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                임대·인건비(850) + 로얄티(250) + 세금/홍보 + 기타
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">월 예상 매출</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {monthlyRevenue.toLocaleString()}만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">월 예상 순이익</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                monthlyProfit >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {monthlyProfit >= 0 ? "+" : ""}
              {monthlyProfit.toLocaleString()}만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              초기투자 회수 (1억원)
            </p>
            <p className="mt-1 text-2xl font-bold text-orange-600">
              {bepMonth > 0 ? `${bepMonth}개월` : "12개월+"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>월별 수익 시뮬레이션</CardTitle>
          <p className="mt-1 text-[12px] text-muted-foreground sm:text-[13px]">
            매월 동일한 신규등록 인원 유지 가정 · 6개월 선불 현금유입 기준
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${Number(value).toLocaleString()}만원`}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Bar dataKey="매출" fill="hsl(260, 60%, 55%)" />
                <Bar dataKey="순이익" fill="hsl(140, 60%, 45%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            * 본 시뮬레이션은 예상 수치이며, 실제 결과는 운영 환경에 따라 달라질 수 있습니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
