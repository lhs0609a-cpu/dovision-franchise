"use client";

import SectionFadeIn from "./SectionFadeIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, BookOpen } from "lucide-react";

const programs = [
  {
    icon: Brain,
    title: "이미지전환기억법",
    subtitle: "특허 등록 기술",
    description:
      "숫자, 단어, 이미지를 연결하여 장기기억으로 전환하는 독자적 기억법. 48주 체계적 커리큘럼으로 기억력을 최대 600% 향상시킵니다.",
    highlights: ["48주 커리큘럼", "기억량 600% 향상", "특허 등록"],
  },
  {
    icon: Zap,
    title: "뉴로피드백 트레이닝",
    subtitle: "뇌파 기반 과학 훈련",
    description:
      "뇌파 측정 장비를 활용한 실시간 바이오피드백 훈련. SMR파, 알파파, 베타파 등 목적별 맞춤 훈련으로 두뇌 잠재력을 깨웁니다.",
    highlights: ["실시간 뇌파 모니터링", "맞춤형 훈련", "과학적 검증"],
  },
  {
    icon: BookOpen,
    title: "BTS 시스템",
    subtitle: "Brain Training Skill",
    description:
      "9가지 모듈로 구성된 종합 두뇌 훈련 시스템. 집중력, 기억력, 창의력, 사고력 등을 체계적으로 발달시키는 두비전만의 핵심 프로그램.",
    highlights: ["9가지 모듈", "영재 뇌 훈련 5단계", "종합 두뇌 개발"],
  },
];

export default function ProgramCards() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              핵심 프로그램
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              과학적으로 검증된 3대 핵심 프로그램으로 차별화된 교육을 제공합니다
            </p>
          </div>
        </SectionFadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {programs.map((program, index) => (
            <SectionFadeIn key={program.title} delay={index * 0.15}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <program.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{program.title}</CardTitle>
                  <p className="text-sm text-primary">{program.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {program.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {program.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
