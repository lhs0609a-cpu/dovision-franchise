"use client";

import SectionFadeIn from "./SectionFadeIn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 초기투자비 1억원 (기본계획서 기준, 30~35평)
const initialItems = [
  { category: "가맹비", detail: "가맹 계약 · 상표 사용권", amount: "1,000만원" },
  {
    category: "인테리어",
    detail: "강의실·상담실 시공 (30~35평)",
    amount: "2,500~3,000만원",
  },
  {
    category: "강의시설 · 장비",
    detail: "책상·의자·컴퓨터(1,000만원) + 검사 장비·훈련 기기(500만원)",
    amount: "1,500만원",
  },
  {
    category: "교육비",
    detail: "실장 1명 · 교사 2명 (3개월 트레이닝)",
    amount: "1,500만원",
  },
];

// 임대보증금 (별도)
const deposit = {
  category: "임대보증금",
  detail: "30~35평 기준 (초기투자비와 별도)",
  amount: "2,500~3,000만원",
};

// 월 운영비 (기본계획서 + 본사 공급원가 22.5% 구조)
// 매출연동(로얄티 10% + 앱교재비 12.5%)은 5명/월 신규등록 기준 예시 금액
type MonthlyItem = {
  category: string;
  amount: string;
  detail?: string;
  highlight?: boolean;
};
const monthlyItems: MonthlyItem[] = [
  { category: "건물 임대료 · 관리비", amount: "250만원" },
  {
    category: "인건비",
    detail: "정교사 1명(300~350) + 보조교사 2명(200~250)",
    amount: "850만원",
  },
  {
    category: "로얄티",
    detail: "매출액의 10% · 신규프로그램·SV 방문 포함",
    amount: "매출 × 10%",
    highlight: true,
  },
  {
    category: "앱 교재비",
    detail: "매출액의 12.5% · 본사 공급 (회원 1인 6개월 60만원)",
    amount: "매출 × 12.5%",
    highlight: true,
  },
  { category: "세금 · 홍보운영비", amount: "250~350만원" },
  {
    category: "뇌기능검사 분석비 · 훈련",
    detail: "외부 전문기관 연계",
    amount: "50만원",
  },
  { category: "전기료 · 소모품비", amount: "50만원" },
];

export default function InvestmentTable() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container-responsive">
        <SectionFadeIn>
          <div className="text-center">
            <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
              INVESTMENT
            </p>
            <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
              투자비 · 운영비 안내
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
              본사 기본계획서 기준 · 30~35평 표준 지점 운영 모델입니다.
            </p>
          </div>
        </SectionFadeIn>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* 초기 투자비 */}
          <SectionFadeIn>
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-end justify-between">
                <h3 className="text-[20px] font-bold sm:text-[22px]">
                  초기 투자비
                </h3>
                <span className="text-[22px] font-extrabold text-primary sm:text-[28px]">
                  1억원
                </span>
              </div>
              <Table className="mt-5">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">항목</TableHead>
                    <TableHead>내역</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialItems.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-semibold">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-[12px] text-muted-foreground sm:text-[13px]">
                        {item.detail}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold">
                      {deposit.category}
                    </p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {deposit.detail}
                    </p>
                  </div>
                  <p className="shrink-0 text-[14px] font-bold text-primary">
                    {deposit.amount}
                  </p>
                </div>
              </div>
            </div>
          </SectionFadeIn>

          {/* 월 운영비 */}
          <SectionFadeIn delay={0.1}>
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-end justify-between">
                <h3 className="text-[20px] font-bold sm:text-[22px]">
                  월 운영비
                </h3>
                <span className="text-[22px] font-extrabold text-primary sm:text-[28px]">
                  1,300~1,800만원
                </span>
              </div>
              <Table className="mt-5">
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead className="text-right">월 금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyItems.map((item) => (
                    <TableRow
                      key={item.category}
                      className={item.highlight ? "bg-primary/5" : ""}
                    >
                      <TableCell>
                        <p className="font-semibold">{item.category}</p>
                        {item.detail && (
                          <p className="mt-0.5 text-[12px] text-muted-foreground sm:text-[13px]">
                            {item.detail}
                          </p>
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          item.highlight ? "text-primary" : ""
                        }`}
                      >
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 space-y-2">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-[12px] leading-[1.65] sm:text-[13px]">
                  <p className="font-bold text-primary">
                    본사 공급원가 = 매출액의 22.5%
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    로얄티 10% + 앱 교재비 12.5% (음식점의 &ldquo;재료비&rdquo;
                    개념). 매출의 77.5%가 가맹점주에게 남습니다. 5명/월 등록 기준
                    약 540만원.
                  </p>
                </div>
                <p className="rounded-lg bg-muted/40 p-3 text-[12px] leading-[1.6] text-muted-foreground sm:text-[13px]">
                  ※ 상기 금액은 정상 운영(정교사 1 · 보조교사 2) 기준이며 본사
                  공급원가 포함입니다. 초기 오픈 단계에서는 인건비·홍보비가
                  조정되어 월 1,300만원 수준에서 시작할 수 있습니다.
                </p>
              </div>
            </div>
          </SectionFadeIn>
        </div>

        <SectionFadeIn delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-muted-foreground sm:text-[14px]">
            * 지역·입지·점포 크기에 따라 변동될 수 있으며, 정확한 사업성 분석은
            가맹 전담 매니저에게 문의하세요.
          </p>
        </SectionFadeIn>
      </div>
    </section>
  );
}
