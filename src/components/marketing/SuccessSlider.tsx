"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionFadeIn from "./SectionFadeIn";

const testimonials = [
  {
    name: "김O준",
    grade: "초등학교 5학년",
    achievement: "기억량 200% 향상",
    content:
      "두비전에서 6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요. 학교 시험도 항상 상위권을 유지하고 있습니다.",
  },
  {
    name: "이O서",
    grade: "중학교 2학년",
    achievement: "IQ 100 → 125",
    content:
      "뉴로피드백 훈련 덕분에 집중력이 크게 향상되었습니다. 수업 시간에 딴생각을 하지 않게 되었고, 성적도 크게 올랐어요.",
  },
  {
    name: "박O현",
    grade: "고등학교 1학년",
    achievement: "서울대 합격",
    content:
      "이미지전환기억법으로 영어 단어 암기가 수월해졌고, BTS 시스템으로 논리적 사고력도 키울 수 있었습니다.",
  },
  {
    name: "최O아",
    grade: "초등학교 3학년",
    achievement: "기억량 600% 향상",
    content:
      "처음에는 10개도 어려웠는데 지금은 60개 이상 쉽게 외워요. 아이의 자신감이 크게 달라졌습니다. - 학부모",
  },
];

export default function SuccessSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">성과 사례</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              두비전 프로그램으로 변화한 학생들의 실제 후기입니다
            </p>
          </div>
        </SectionFadeIn>

        <div className="mt-12">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-8">
              <Quote className="h-8 w-8 text-primary/30" />
              <p className="mt-4 text-lg leading-relaxed">
                {testimonials[current].content}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[current].grade}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {testimonials[current].achievement}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
