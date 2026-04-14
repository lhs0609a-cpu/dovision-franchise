"use client";

import SectionFadeIn from "./SectionFadeIn";
import {
  TrendingUp,
  Wallet,
  GraduationCap,
  Headphones,
  Target,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "소자본 창업",
    desc: "3,800만원부터 시작 가능. 일반 학원 대비 낮은 초기 투자비",
  },
  {
    icon: TrendingUp,
    title: "높은 수익률",
    desc: "월 평균 객단가 30~50만원. BEP 3~6개월 달성",
  },
  {
    icon: ShieldCheck,
    title: "특허 기술 독점",
    desc: "이미지전환기억법 특허로 경쟁사 진입 차단",
  },
  {
    icon: GraduationCap,
    title: "체계적 교육",
    desc: "2주 집중 연수 + 지속적인 역량 강화 교육",
  },
  {
    icon: Headphones,
    title: "본사 지원",
    desc: "슈퍼바이저 정기 방문, 마케팅/운영 전반 지원",
  },
  {
    icon: Target,
    title: "블루오션 시장",
    desc: "뇌교육 분야 경쟁이 적은 차별화된 시장",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              가맹 <span className="text-primary">6대 장점</span>
            </h2>
          </div>
        </SectionFadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => (
            <SectionFadeIn key={item.title} delay={index * 0.1}>
              <div className="flex gap-4 rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
