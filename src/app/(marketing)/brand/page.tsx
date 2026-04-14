import { Metadata } from "next";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Award, Users, Target, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "브랜드 소개",
  description: "두비전(DOVISION) 창의융합 뇌교육 프로그램 브랜드 소개. 25년 노하우, 특허 보유 기술, ㈜키네스 운영.",
};

const values = [
  { icon: Target, title: "미션", desc: "모든 아이의 두뇌 잠재력을 과학적으로 개발하여 창의적 인재로 성장시킵니다" },
  { icon: Heart, title: "비전", desc: "대한민국 No.1 뇌교육 전문 프랜차이즈로서 교육의 패러다임을 혁신합니다" },
  { icon: Users, title: "핵심 가치", desc: "과학적 교육, 검증된 성과, 학생 중심, 지속적 혁신" },
  { icon: Award, title: "차별화", desc: "특허 보유 이미지전환기억법 + 뉴로피드백 + BTS 시스템의 삼위일체 교육" },
];

const history = [
  { year: "2001", event: "두비전 뇌교육 프로그램 개발 시작" },
  { year: "2005", event: "이미지전환기억법 특허 등록" },
  { year: "2010", event: "뉴로피드백 트레이닝 프로그램 도입" },
  { year: "2015", event: "BTS(Brain Training Skill) 시스템 완성" },
  { year: "2018", event: "강남 직영 센터 오픈" },
  { year: "2020", event: "반포, 위례 센터 오픈" },
  { year: "2024", event: "가맹 사업 본격 확장" },
];

export default function BrandPage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              ABOUT DOVISION
            </span>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              두비전 브랜드 소개
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              25년간 뇌교육 연구와 교육 현장 경험을 바탕으로<br />
              과학적으로 검증된 창의융합 뇌교육 프로그램을 운영합니다.
            </p>
          </SectionFadeIn>
        </div>
      </section>

      {/* 법인 소개 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">㈜키네스</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                ㈜키네스는 두비전(DOVISION) 창의융합 뇌교육 프로그램의 운영 법인입니다.
                대표 김양수가 이끄는 전문 교육 기업으로, 이미지전환기억법 특허를 보유하고 있으며,
                서울 강남, 반포, 위례에 직영 센터 3곳을 운영하고 있습니다.
              </p>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 미션/비전/가치 */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
              <SectionFadeIn key={item.title} delay={i * 0.1}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h2 className="text-center text-3xl font-bold">연혁</h2>
          </SectionFadeIn>
          <div className="mt-12 space-y-0">
            {history.map((item, i) => (
              <SectionFadeIn key={item.year} delay={i * 0.08}>
                <div className="flex gap-6 border-l-2 border-primary/20 py-4 pl-6">
                  <span className="shrink-0 text-lg font-bold text-primary">
                    {item.year}
                  </span>
                  <span className="text-muted-foreground">{item.event}</span>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
