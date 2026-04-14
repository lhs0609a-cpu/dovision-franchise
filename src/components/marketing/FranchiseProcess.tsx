"use client";

import SectionFadeIn from "./SectionFadeIn";

const steps = [
  { step: "01", title: "온라인 문의", desc: "홈페이지 상담 신청 또는 전화 문의" },
  { step: "02", title: "1차 상담", desc: "사업 설명 및 투자 안내" },
  { step: "03", title: "센터 방문", desc: "직영 센터 방문 및 프로그램 체험" },
  { step: "04", title: "사업 설명회", desc: "상세 수익 모델 및 운영 방법 안내" },
  { step: "05", title: "가맹 계약", desc: "계약 체결 및 상권 분석" },
  { step: "06", title: "교육 연수", desc: "본사 집중 교육 (2주)" },
  { step: "07", title: "인테리어", desc: "센터 인테리어 및 장비 세팅" },
  { step: "08", title: "그랜드 오픈", desc: "오픈 마케팅 및 본격 운영 시작" },
];

export default function FranchiseProcess() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">가맹 절차</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              문의부터 오픈까지, 본사가 모든 과정을 함께합니다
            </p>
          </div>
        </SectionFadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <SectionFadeIn key={item.step} delay={index * 0.08}>
              <div className="relative rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md">
                <div className="text-3xl font-extrabold text-primary/20">
                  {item.step}
                </div>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden text-muted-foreground/30 lg:block">
                    →
                  </div>
                )}
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
