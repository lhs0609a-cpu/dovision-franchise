import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Wallet, TrendingUp, Trophy, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoyaltyChart from "./RoyaltyChart";

export const dynamic = "force-dynamic";

// 실제 가맹점 매출 리포트 연동 전까지 사용할 간단 추정치.
// 본사 수입 = 가맹점 매출 × (로열티 10% + 앱교재비 12.5%) = 22.5%
const AVG_ACTIVE_MEMBERS = 30;
const FEE_PER_MEMBER = 80; // 만원/월
const ROYALTY_PCT = 0.1;
const BOOKFEE_PCT = 0.125;

export default async function RevenueDashboard() {
  let franchisees: Array<{
    id: string;
    name: string;
    centerName: string | null;
    region: string;
    status: string;
    createdAt: Date;
  }> = [];
  try {
    franchisees = await prisma.franchisee.findMany({
      where: { status: "OPERATING" },
      select: {
        id: true,
        name: true,
        centerName: true,
        region: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    // DB 미연결
  }

  // 간단 추정: 각 가맹점은 AVG_ACTIVE_MEMBERS 활성 회원 유지 (실매출 데이터 들어오기 전까지)
  const estimates = franchisees.map((f, idx) => {
    // 개업 시점에 따라 활성 회원 램프 반영 — 오래 운영한 곳일수록 회원 많다고 가정
    const monthsOpen = Math.max(
      1,
      Math.floor(
        (Date.now() - f.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
    );
    const rampFactor = Math.min(1, monthsOpen / 12);
    const estimatedMembers = Math.round(AVG_ACTIVE_MEMBERS * rampFactor);
    const monthlyRevenue = estimatedMembers * FEE_PER_MEMBER;
    const royalty = monthlyRevenue * ROYALTY_PCT;
    const bookFee = monthlyRevenue * BOOKFEE_PCT;
    return {
      rank: idx + 1, // placeholder, will resort below
      id: f.id,
      name: f.name,
      centerName: f.centerName,
      region: f.region,
      monthsOpen,
      estimatedMembers,
      monthlyRevenue,
      royalty: Math.round(royalty),
      bookFee: Math.round(bookFee),
      totalToHq: Math.round(royalty + bookFee),
    };
  });

  // 본사 기여도 순 재정렬
  estimates.sort((a, b) => b.totalToHq - a.totalToHq);
  estimates.forEach((e, idx) => {
    e.rank = idx + 1;
  });

  const totalRoyalty = estimates.reduce((s, e) => s + e.royalty, 0);
  const totalBookFee = estimates.reduce((s, e) => s + e.bookFee, 0);
  const totalHq = totalRoyalty + totalBookFee;
  const totalStoreRevenue = estimates.reduce(
    (s, e) => s + e.monthlyRevenue,
    0
  );

  // 차트용 월별 시리즈 — 최근 12개월 (시점에 따라 활성 가맹 수 증가 반영)
  const now = new Date();
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const activeCount = franchisees.filter(
      (f) => f.createdAt <= monthDate
    ).length;
    const estMonthlyStoreRevenue =
      activeCount * AVG_ACTIVE_MEMBERS * FEE_PER_MEMBER;
    return {
      month: `${monthDate.getMonth() + 1}월`,
      로열티: Math.round(estMonthlyStoreRevenue * ROYALTY_PCT),
      앱교재비: Math.round(estMonthlyStoreRevenue * BOOKFEE_PCT),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          REVENUE
        </p>
        <h1 className="mt-0.5 text-[22px] font-bold">본사 수익 대시보드</h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          가맹점 매출 기반 로열티 + 앱교재비 본사 수입 추적 · 가맹점별 월간
          실매출 리포트 도입 전까지는 추정값 사용
        </p>
      </div>

      {/* 상단 집계 */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatBig
          label="이번 달 본사 수입 (추정)"
          value={`${totalHq.toLocaleString()}만원`}
          sub={`가맹점 총매출 ${totalStoreRevenue.toLocaleString()}만원 × 22.5%`}
          tone="primary"
        />
        <StatBig
          label="로열티 (10%)"
          value={`${totalRoyalty.toLocaleString()}만원`}
          sub="매출 연동 · 하한 월 250만원"
        />
        <StatBig
          label="앱교재비 (12.5%)"
          value={`${totalBookFee.toLocaleString()}만원`}
          sub="회원 1인 6개월 60만원"
        />
        <StatBig
          label="운영 중 가맹점"
          value={`${estimates.length}곳`}
          sub="현재 수익 발생 중"
        />
      </div>

      {/* 월별 추세 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            월별 본사 수입 추세 (최근 12개월)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoyaltyChart data={chartData} />
          <p className="mt-2 text-[10.5px] text-muted-foreground">
            ※ 가맹점별 월간 실매출 리포트 도입 전까지 운영 가맹점 수 × 평균
            매출로 근사 추정
          </p>
        </CardContent>
      </Card>

      {/* 가맹점 기여도 Top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-amber-500" />
            가맹점별 본사 기여도 (월 추정)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estimates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              운영 중인 가맹점이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b text-left text-[10.5px] font-semibold text-muted-foreground">
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">가맹점</th>
                    <th className="px-2 py-2">지역</th>
                    <th className="px-2 py-2 text-right">운영 개월</th>
                    <th className="px-2 py-2 text-right">추정 회원</th>
                    <th className="px-2 py-2 text-right">매출 (월)</th>
                    <th className="px-2 py-2 text-right">로열티</th>
                    <th className="px-2 py-2 text-right">앱교재비</th>
                    <th className="px-2 py-2 text-right">본사 기여</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/50 hover:bg-muted/20"
                    >
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            e.rank <= 3
                              ? "bg-amber-100 text-amber-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {e.rank}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <Link
                          href={`/admin/franchisees/${e.id}`}
                          className="flex items-center gap-1 font-semibold hover:text-primary hover:underline"
                        >
                          <Building2 className="h-3 w-3" />
                          {e.name}
                          {e.centerName && (
                            <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                              · {e.centerName}
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-muted-foreground">
                        {e.region}
                      </td>
                      <td className="px-2 py-2 text-right">{e.monthsOpen}M</td>
                      <td className="px-2 py-2 text-right">
                        {e.estimatedMembers}명
                      </td>
                      <td className="px-2 py-2 text-right">
                        {e.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {e.royalty.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {e.bookFee.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-right font-bold text-primary">
                        {e.totalToHq.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBig({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "primary";
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${tone === "primary" ? "border-primary/30 bg-gradient-to-br from-purple-50 to-white" : ""}`}
    >
      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
        {tone === "primary" ? (
          <Wallet className="h-3.5 w-3.5 text-primary" />
        ) : (
          <TrendingUp className="h-3.5 w-3.5" />
        )}
        {label}
      </div>
      <p
        className={`mt-2 text-[22px] font-black leading-none ${tone === "primary" ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}
