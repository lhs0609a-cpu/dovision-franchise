import Hero from "@/components/marketing/Hero";
import BrandIntro from "@/components/marketing/BrandIntro";
import ProgramCards from "@/components/marketing/ProgramCards";
import CountingStats from "@/components/marketing/CountingStats";
import SuccessSlider from "@/components/marketing/SuccessSlider";
import FranchiseBenefits from "@/components/marketing/FranchiseBenefits";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import InvestmentTable from "@/components/marketing/InvestmentTable";
import FranchiseProcess from "@/components/marketing/FranchiseProcess";
import ContactForm from "@/components/marketing/ContactForm";
import FullBleedCTA from "@/components/marketing/FullBleedCTA";
import TrainingEffects from "@/components/marketing/TrainingEffects";
import LearningProcess from "@/components/marketing/LearningProcess";
import DominicStory from "@/components/marketing/DominicStory";
import MemoryPrinciple from "@/components/marketing/MemoryPrinciple";
import PatentBadge from "@/components/marketing/PatentBadge";

const faqItems = [
  {
    q: "교육업 경험이 없어도 가능한가요?",
    a: "네, 가능합니다. 본사에서 3개월간 실장·교사 집중 교육 연수를 제공하며(교육비 1,500만원 포함), 오픈 후에도 슈퍼바이저가 정기 방문해 운영을 지원합니다.",
  },
  {
    q: "초기 투자비는 얼마인가요?",
    a: "30~35평 기준 총 1억원입니다. 가입비 1,000만원 · 인테리어 2,500~3,000만원 · 강의시설·장비 1,500만원 · 교육비(3개월) 1,500만원. 임대보증금(2,500~3,000만원)은 별도입니다.",
  },
  {
    q: "손익분기점은 언제 도달하나요?",
    a: "월 신규등록 3~4명이 BEP 지점입니다. 5명 확보 시 월 순이익 600만원, 7명 확보 시 월 1,560만원 구간에 진입합니다(월 지출 1,800만원 · 본사 공급원가 22.5% 포함, 6개월 선불 480만원).",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1. 히어로 */}
      <Hero />

      {/* 2. 브랜드 소개 */}
      <BrandIntro />

      {/* 2-1. 도미닉 오브라이언 스토리 */}
      <DominicStory />

      {/* 2-2. 이미지전환기억법 원리 */}
      <MemoryPrinciple />

      {/* 3. 프로그램 하이라이트 */}
      <ProgramCards />

      {/* 3-1. 학습 프로세스 (이미지) */}
      <LearningProcess />

      {/* 4. 성과 숫자 */}
      <CountingStats />

      {/* 4-1. 트레이닝 전/후 비교 (이미지) */}
      <TrainingEffects />

      {/* 5. 성과 사례 슬라이더 */}
      <SuccessSlider />

      {/* 6. 가맹 장점 */}
      <FranchiseBenefits />

      {/* 6-1. 특허 독점권 */}
      <PatentBadge />

      {/* 7. 비교 테이블 */}
      <ComparisonTable />

      {/* 8. 투자비/수익 요약 */}
      <InvestmentTable />

      {/* 9. 풀블리드 CTA */}
      <FullBleedCTA />

      {/* 10. 가맹 절차 */}
      <FranchiseProcess />

      {/* 11. FAQ */}
      <section className="snap-section relative bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
              자주 묻는 질문
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="text-[16px] font-bold sm:text-[17px]">Q. {item.q}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground sm:text-[15px]">
                  A. {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CTA + 상담 신청 폼 */}
      <section id="contact" className="snap-section relative bg-white py-20">
        <div className="container-responsive flex flex-col items-center justify-center">
          <ContactForm compact />
        </div>
      </section>
    </>
  );
}
