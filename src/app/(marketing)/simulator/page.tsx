import { Metadata } from "next";
import Link from "next/link";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import ROICalculator from "@/components/marketing/ROICalculator";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Info,
  Users,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "수익 시뮬레이터",
  description:
    "두비전 가맹점 예상 수익 시뮬레이터. 회원 수, 1인 월 수강료, 월 고정 지출을 조정해 BEP·월 순이익·12개월 누적 수익을 직접 확인하세요.",
};

const presetScenarios = [
  {
    label: "보수형",
    students: 8,
    fee: 80,
    fixedCost: 1200,
    desc: "회원 8명 · 월 수강료 80만원 · 고정비 1,200만원",
    monthlyRevenue: 8 * 80,
    monthlyProfit: 8 * 80 - 1200,
    note: "오픈 초기 안정화 단계",
  },
  {
    label: "표준형",
    students: 15,
    fee: 80,
    fixedCost: 1000,
    desc: "회원 15명 · 월 수강료 80만원 · 고정비 1,000만원",
    monthlyRevenue: 15 * 80,
    monthlyProfit: 15 * 80 - 1000,
    note: "BEP 통과 후 안정 운영",
  },
  {
    label: "공격형",
    students: 25,
    fee: 90,
    fixedCost: 1300,
    desc: "회원 25명 · 월 수강료 90만원 · 고정비 1,300만원",
    monthlyRevenue: 25 * 90,
    monthlyProfit: 25 * 90 - 1300,
    note: "마케팅 강화로 빠른 성장",
  },
];

const tips = [
  {
    icon: Users,
    title: "회원 수 (5~30명)",
    desc: "직영 센터 평균 운영 회원 수는 12~18명. BEP 진입은 보통 8~10명 구간입니다.",
  },
  {
    icon: Calculator,
    title: "1인 월 수강료 (50~120만원)",
    desc: "기본 80만원 = 6개월 선불 480만원 기준. 지역·과정에 따라 70~100만원 사이가 일반적입니다.",
  },
  {
    icon: TrendingUp,
    title: "월 고정 지출 (500~2,000만원)",
    desc: "임대료(300) + 인건비(400) + 마케팅(300~500) + 기타(200) ≈ 1,200~1,400만원이 표준 구조입니다.",
  },
];

const assumptions = [
  "초기 투자비 1억원 기준 (가입비·인테리어·집기·교육 컨설팅 포함, 임대보증금 별도)",
  "회원 수는 6개월에 걸쳐 점진적 모집 (1개월차 30% → 6개월차 100%)",
  "1인 수강료는 6개월 선불 등록 기준 월 평균값",
  "월 고정 지출은 임대·인건비·마케팅·기타 운영비 통합",
  "BEP는 누적 순이익이 0원을 초과하는 시점",
  "본 시뮬레이션은 참고용이며, 실제 결과는 입지·마케팅·운영 역량에 따라 달라질 수 있습니다",
];

export default function SimulatorPage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              ROI SIMULATOR
            </span>
            <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[68px]">
              내 가맹점, 얼마나
              <br />
              <span className="text-primary">벌 수 있을까?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
              회원 수, 수강료, 고정 지출을 조정해
              <br className="hidden sm:inline" />
              월 순이익과 BEP 도달 시점을 직접 확인하세요.
            </p>
          </SectionFadeIn>
        </div>
      </section>

      {/* 시뮬레이터 본체 */}
      <section className="py-20">
        <div className="container-responsive max-w-5xl">
          <ROICalculator />
        </div>
      </section>

      {/* 변수 가이드 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                INPUT GUIDE
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                변수별 권장 범위
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                직영 센터 운영 데이터를 바탕으로 한 현실적인 입력 범위입니다.
              </p>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {tips.map((t, i) => (
              <SectionFadeIn key={t.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border/60 bg-card p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[17px] font-bold sm:text-[18px]">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-muted-foreground sm:text-[14px]">
                    {t.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3가지 시나리오 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                SAMPLE SCENARIOS
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                3가지 시나리오 비교
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                보수형 · 표준형 · 공격형 — 본인 상황에 가장 가까운 시나리오를
                확인해 보세요.
              </p>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {presetScenarios.map((s, i) => (
              <SectionFadeIn key={s.label} delay={i * 0.1}>
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border p-7 transition-all hover:shadow-xl ${
                    i === 1
                      ? "border-primary bg-primary/5 lg:scale-[1.03]"
                      : "border-border/60 bg-card"
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                      RECOMMENDED
                    </span>
                  )}
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                    SCENARIO {i + 1}
                  </p>
                  <h3 className="mt-2 text-[24px] font-extrabold sm:text-[28px]">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-[12px] text-muted-foreground sm:text-[13px]">
                    {s.desc}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-border/60 pt-6">
                    <div className="flex items-center justify-between text-[13px] sm:text-[14px]">
                      <span className="text-muted-foreground">월 매출</span>
                      <span className="font-bold">
                        {s.monthlyRevenue.toLocaleString()}만원
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] sm:text-[14px]">
                      <span className="text-muted-foreground">월 고정비</span>
                      <span className="font-bold">
                        {s.fixedCost.toLocaleString()}만원
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[14px] sm:text-[15px]">
                      <span className="font-bold text-foreground">월 순이익</span>
                      <span
                        className={`text-[18px] font-extrabold sm:text-[22px] ${
                          s.monthlyProfit > 0 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {s.monthlyProfit > 0 ? "+" : ""}
                        {s.monthlyProfit.toLocaleString()}만원
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground sm:text-[12px]">
                    {s.note}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BEP 가이드 */}
      <section className="bg-foreground py-20 text-background">
        <div className="container-responsive">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionFadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-[12px] font-bold text-primary sm:text-[13px]">
                <CalendarDays className="h-4 w-4" />
                BEP 도달 가이드
              </div>
              <h2 className="mt-5 font-bold leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                평균 <span className="text-primary">3~6개월</span> 내 BEP 도달
              </h2>
              <p className="mt-6 text-[15px] leading-[1.8] text-background/70 sm:text-[16px]">
                두비전 직영 센터 운영 데이터 기준, 정상 마케팅 활동을 진행한
                가맹점은 평균 3~6개월 내 누적 손익분기점에 도달합니다.
                회원 9명 이상 안정 확보 시점부터는 월 순이익 300~500만원
                구간에 진입합니다.
              </p>
            </SectionFadeIn>
            <SectionFadeIn delay={0.1}>
              <div className="rounded-2xl bg-background/5 p-8 backdrop-blur sm:p-10">
                <h3 className="text-[18px] font-bold sm:text-[20px]">
                  BEP 빠르게 도달하는 핵심
                </h3>
                <ul className="mt-6 space-y-4 text-[14px] sm:text-[15px]">
                  {[
                    "오픈 초기 1~2개월 집중 마케팅 (체험 이벤트·전단)",
                    "기존 회원 학부모 네트워크 활용",
                    "본사 슈퍼바이저 주 1회 방문 컨설팅",
                    "6개월 선불 등록 유도로 현금 흐름 안정",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-background/85">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 시뮬레이션 가정 */}
      <section className="py-20">
        <div className="container-responsive max-w-3xl">
          <SectionFadeIn>
            <div className="rounded-2xl border border-border/60 bg-card p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-[18px] font-bold sm:text-[20px]">
                  시뮬레이션 가정 사항
                </h2>
              </div>
              <ul className="mt-6 space-y-3 text-[13px] leading-[1.7] text-muted-foreground sm:text-[14px]">
                {assumptions.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-responsive text-center">
          <h2 className="font-black leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            정확한 사업성 분석은
            <br />
            전담 매니저에게 받아보세요
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.7] text-white/80 sm:text-[16px]">
            지역 상권 분석 + 입지 검토 + 맞춤 사업성 시뮬레이션을 무료로
            제공합니다.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-foreground transition-transform hover:translate-y-[-2px]"
            >
              무료 사업성 분석 신청
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/franchise"
              className="rounded-full border border-white/40 bg-white/5 px-8 py-4 text-[15px] font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              가맹 안내 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
