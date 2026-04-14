"use client";

import SectionFadeIn from "./SectionFadeIn";
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "특허 보유 프로그램", dovision: true, general: false },
  { feature: "뉴로피드백 장비 훈련", dovision: true, general: false },
  { feature: "과학적 성과 측정", dovision: true, general: false },
  { feature: "본사 교육 연수 지원", dovision: true, general: false },
  { feature: "높은 객단가 (월 30~50만원)", dovision: true, general: false },
  { feature: "차별화된 커리큘럼", dovision: true, general: false },
  { feature: "낮은 경쟁률 (블루오션)", dovision: true, general: false },
  { feature: "슈퍼바이저 정기 방문", dovision: true, general: false },
];

export default function ComparisonTable() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              일반 학원 vs <span className="text-primary">두비전</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              레드오션 학원 시장과 차별화된 두비전만의 경쟁력
            </p>
          </div>
        </SectionFadeIn>

        <SectionFadeIn delay={0.2}>
          <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl border bg-card">
            <div className="grid grid-cols-3 border-b bg-muted/50 p-4 text-center font-semibold">
              <div className="text-left">비교 항목</div>
              <div className="text-primary">두비전</div>
              <div className="text-muted-foreground">일반 학원</div>
            </div>
            {comparisons.map((item) => (
              <div
                key={item.feature}
                className="grid grid-cols-3 border-b p-4 text-center last:border-0"
              >
                <div className="text-left text-sm">{item.feature}</div>
                <div>
                  {item.dovision ? (
                    <Check className="mx-auto h-5 w-5 text-green-600" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-red-400" />
                  )}
                </div>
                <div>
                  {item.general ? (
                    <Check className="mx-auto h-5 w-5 text-green-600" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionFadeIn>
      </div>
    </section>
  );
}
