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
} from "recharts";

export default function ROICalculator() {
  const [students, setStudents] = useState(15);
  const [fee, setFee] = useState(80);
  const [fixedCost, setFixedCost] = useState(1000);

  const INITIAL_INVESTMENT = 10000;

  const data = useMemo(() => {
    let cumulative = -INITIAL_INVESTMENT;
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const currentStudents = Math.min(
        students,
        Math.floor(students * (0.3 + 0.7 * (month / 6)))
      );
      const rev = currentStudents * fee;
      const cost = fixedCost;
      const profit = rev - cost;
      cumulative += profit;

      return {
        month: `${month}월`,
        매출: rev,
        비용: cost,
        순이익: profit,
        누적: cumulative,
      };
    });
  }, [students, fee, fixedCost]);

  const bepMonth = data.findIndex((d) => d.누적 >= 0) + 1;
  const monthlyProfit = students * fee - fixedCost;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>조건 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>목표 회원 수: {students}명</Label>
              <Input
                type="range"
                min={5}
                max={30}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5명</span>
                <span>30명</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>1인 월 수강료: {fee}만원</Label>
              <Input
                type="range"
                min={50}
                max={120}
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50만원</span>
                <span>120만원</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                6개월 선불 {(fee * 6).toLocaleString()}만원 기준
              </p>
            </div>
            <div className="space-y-2">
              <Label>월 고정 지출: {fixedCost.toLocaleString()}만원</Label>
              <Input
                type="range"
                min={500}
                max={2000}
                step={50}
                value={fixedCost}
                onChange={(e) => setFixedCost(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>500만원</span>
                <span>2,000만원</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                임대+인건비+마케팅+기타 합계
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
              {(students * fee).toLocaleString()}만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">월 예상 순이익</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {monthlyProfit.toLocaleString()}만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">BEP 도달 예상</p>
            <p className="mt-1 text-2xl font-bold text-orange-600">
              {bepMonth > 0 ? `${bepMonth}개월` : "12개월+"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>월별 수익 시뮬레이션</CardTitle>
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
                <ReferenceLine y={0} stroke="#666" />
                <Bar dataKey="매출" fill="hsl(220, 70%, 55%)" />
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
