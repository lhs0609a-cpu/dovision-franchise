"use client";

import SectionFadeIn from "./SectionFadeIn";
import { Shield, Award, Brain, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "25년 뇌교육 노하우",
    description: "2001년부터 축적된 뇌교육 연구와 교육 경험을 바탕으로 체계적인 프로그램 운영",
  },
  {
    icon: Shield,
    title: "특허 보유 기술",
    description: "이미지전환기억법 특허 등록. 독점적 교육 커리큘럼과 교재 시스템",
  },
  {
    icon: Award,
    title: "검증된 성과",
    description: "서울대 등 명문대 합격생 배출, 평균 기억량 600% 향상 실증 결과",
  },
  {
    icon: Lightbulb,
    title: "뉴로피드백 트레이닝",
    description: "뇌파 측정 기반 과학적 훈련. 집중력, 창의력, 기억력 동시 향상",
  },
];

export default function BrandIntro() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              왜 <span className="text-primary">두비전</span>인가?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              교육 시장이 변하고 있습니다. 단순 주입식 교육이 아닌, 과학적으로
              검증된 뇌교육이 미래 교육의 핵심입니다.
            </p>
          </div>
        </SectionFadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <SectionFadeIn key={feature.title} delay={index * 0.1}>
              <div className="group rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
