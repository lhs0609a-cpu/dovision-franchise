import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import FranchiseBenefits from "@/components/marketing/FranchiseBenefits";
import InvestmentTable from "@/components/marketing/InvestmentTable";
import FranchiseProcess from "@/components/marketing/FranchiseProcess";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "가맹 안내",
  description: "두비전 가맹점 창업 안내. 투자비, 수익 모델, 본사 지원, 가맹 절차 등 상세 정보.",
};

const supports = {
  before: [
    "상권 분석 및 입지 선정 컨설팅",
    "인테리어 설계 및 시공 관리",
    "장비(뉴로피드백 등) 세팅",
    "2주 집중 교육 연수",
    "교재 및 학습 콘텐츠 제공",
    "오픈 마케팅 지원",
  ],
  after: [
    "슈퍼바이저 정기 방문 (월 1~2회)",
    "신규 프로그램 업데이트",
    "온라인 마케팅 지원",
    "정기 교육 연수",
    "운영 매뉴얼 및 가이드",
    "학부모 상담 가이드",
  ],
};

export default function FranchisePage() {
  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">가맹 안내</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              검증된 뇌교육 프랜차이즈, 두비전과 함께 교육 사업을 시작하세요
            </p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button size="lg">
                가맹 상담 신청 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </SectionFadeIn>
        </div>
      </section>

      <FranchiseBenefits />
      <InvestmentTable />

      {/* 로열티 구조 */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h2 className="text-center text-3xl font-bold">로열티 구조</h2>
            <div className="mt-8 rounded-xl border bg-card p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">월 정액 로열티</p>
                  <p className="mt-1 text-3xl font-bold text-primary">50만원</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    매출 무관 고정 금액
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">광고 분담금</p>
                  <p className="mt-1 text-3xl font-bold text-primary">10만원/월</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    온/오프라인 공동 마케팅
                  </p>
                </div>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 본사 지원 */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h2 className="text-center text-3xl font-bold">본사 지원 내용</h2>
          </SectionFadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <SectionFadeIn delay={0.1}>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-bold text-primary">오픈 전 지원</h3>
                <ul className="mt-4 space-y-3">
                  {supports.before.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
            <SectionFadeIn delay={0.2}>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-bold text-primary">오픈 후 지원</h3>
                <ul className="mt-4 space-y-3">
                  {supports.after.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      <ComparisonTable />
      <FranchiseProcess />

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">지금 바로 상담 신청하세요</h2>
          <p className="mt-4 text-primary-foreground/80">
            두비전의 검증된 교육 시스템으로 성공적인 교육 사업을 시작하세요.<br />
            전문 상담사가 친절하게 안내해 드립니다.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                상담 신청하기 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:02-558-2733">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                전화 상담: 02-558-2733
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
