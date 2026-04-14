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
import SectionFadeIn from "@/components/marketing/SectionFadeIn";

export default function HomePage() {
  return (
    <>
      {/* ① 히어로 */}
      <Hero />

      {/* ② 문제 제기 + ③ 브랜드 소개 */}
      <BrandIntro />

      {/* ④ 프로그램 하이라이트 */}
      <ProgramCards />

      {/* ⑤ 성과 숫자 */}
      <CountingStats />

      {/* ⑥ 성과 사례 슬라이더 */}
      <SuccessSlider />

      {/* ⑦ 가맹 장점 */}
      <FranchiseBenefits />

      {/* ⑧ 비교 테이블 */}
      <ComparisonTable />

      {/* ⑨ 투자비/수익 요약 */}
      <InvestmentTable />

      {/* ⑩ 가맹 절차 */}
      <FranchiseProcess />

      {/* ⑪ FAQ 주요 항목 */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">자주 묻는 질문</h2>
            </div>
            <div className="mx-auto mt-8 max-w-3xl space-y-4">
              {[
                {
                  q: "교육업 경험이 없어도 가능한가요?",
                  a: "네, 가능합니다. 본사에서 2주간 집중 교육 연수를 제공하며, 오픈 후에도 슈퍼바이저가 정기적으로 방문하여 운영을 지원합니다.",
                },
                {
                  q: "초기 투자비는 얼마인가요?",
                  a: "스탠다드형(15평) 기준 약 3,800만원, 프리미엄형(25평+) 기준 약 6,300만원입니다. 점포 임대료는 별도입니다.",
                },
                {
                  q: "손익분기점은 언제 도달하나요?",
                  a: "지역과 운영 상황에 따라 다르지만, 평균적으로 3~6개월 내 BEP 도달이 가능합니다.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-lg border bg-card p-6"
                >
                  <h3 className="font-semibold">Q. {item.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A. {item.a}
                  </p>
                </div>
              ))}
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ⑫ CTA + 상담 신청 폼 */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <ContactForm compact />
        </div>
      </section>
    </>
  );
}
