import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, TrendingUp, ArrowRight, GraduationCap, PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "성과 사례",
  description:
    "두비전 프로그램을 통해 변화한 학생들의 실제 성과 사례 — 학년별 기억량 향상, IQ 증가, 명문대 합격 등 검증된 결과를 확인하세요.",
};

export const revalidate = 3600;

const gradeStats = [
  { grade: "초등 1학년", before: 8, after: 50, unit: "개", rate: 625 },
  { grade: "초등 5·6학년", before: 12, after: 50, unit: "개", rate: 416 },
  { grade: "초등 3·4학년", before: 8, after: 30, unit: "개", rate: 375 },
  { grade: "중학교 1학년", before: 11, after: 30, unit: "개", rate: 273 },
  { grade: "고등·대학생", before: 15, after: 30, unit: "개", rate: 200 },
];

const fallbackData = [
  {
    id: "1",
    studentName: "김O준",
    grade: "초5",
    duration: "6개월",
    content:
      "두비전에서 6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요. 학교 시험도 항상 상위권을 유지하고 있습니다.",
    achievement: "기억량 200% 향상",
  },
  {
    id: "2",
    studentName: "이O서",
    grade: "중2",
    duration: "1년",
    content:
      "뉴로피드백 훈련 덕분에 집중력이 크게 향상되었습니다. 수업 시간에 딴생각을 하지 않게 되었고, 성적도 크게 올랐어요.",
    achievement: "IQ 100 → 125",
  },
  {
    id: "3",
    studentName: "박O현",
    grade: "고1",
    duration: "2년",
    content:
      "이미지전환기억법으로 영어 단어 암기가 수월해졌고, BTS 시스템으로 논리적 사고력도 키울 수 있었습니다.",
    achievement: "서울대 합격",
  },
  {
    id: "4",
    studentName: "최O아",
    grade: "초3",
    duration: "8개월",
    content:
      "처음에는 10개도 어려웠는데 지금은 60개 이상 쉽게 외워요. 아이의 자신감이 크게 달라졌습니다.",
    achievement: "기억량 600% 향상",
  },
  {
    id: "5",
    studentName: "정O민",
    grade: "중3",
    duration: "1년 6개월",
    content:
      "뉴로피드백으로 집중력을 키우고, 기억법으로 암기 효율을 높여 전교 1등을 달성했습니다.",
    achievement: "전교 1등",
  },
  {
    id: "6",
    studentName: "한O윤",
    grade: "초6",
    duration: "10개월",
    content:
      "수학 문제 풀이 속도가 빨라지고, 독서 후 내용 정리 능력이 크게 좋아졌어요.",
    achievement: "수학 경시대회 입상",
  },
];

const measuredCases = [
  {
    title: "토익 단어 50개 즉시 암기",
    subject: "초등 6학년 · 12개월 훈련",
    desc: "영어 기초 수준의 초등학생이 토익 빈출 단어 50개를 한 번 보고 순서대로 재현.",
  },
  {
    title: "한국사 능력시험 키워드 정리",
    subject: "초등 6학년 · 12개월 훈련",
    desc: "한국사 능력시험 빈출 키워드를 이미지 전환으로 전환·재구성해 시험 대비.",
  },
  {
    title: "무작위 단어 100개 순서 기억",
    subject: "초등 5학년 · 12개월 훈련",
    desc: "연관성 없는 단어 100개를 스토리 기반 이미지로 전환해 순서대로 재현.",
  },
  {
    title: "명문 대학 합격",
    subject: "12개월 이상 훈련",
    desc: "SKY 대학 및 외국어고등학교 진학 사례 다수 보유.",
  },
];

const admissions = [
  "서울대학교",
  "고려대학교",
  "연세대학교",
  "외국어고등학교",
  "과학고등학교",
  "자사고",
];

export default async function SuccessPage() {
  let testimonials: {
    id: string;
    studentName: string;
    grade: string;
    duration: string;
    content: string;
    achievement: string;
  }[] = [];

  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // DB not connected yet - show fallback data
  }

  const displayData = testimonials.length > 0 ? testimonials : fallbackData;

  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              SUCCESS STORIES
            </span>
            <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[68px]">
              수치로 증명된
              <br />
              <span className="text-primary">학생들의 변화</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
              두비전 프로그램으로 실제 변화한 학생들의 기록입니다.
              <br className="hidden sm:inline" />
              학년별 기억량 2~6배 증가, IQ 25점 상승, 명문대 합격까지.
            </p>

            {/* 헤드라인 3대 지표 */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 backdrop-blur">
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                  기억 용량
                </p>
                <p className="mt-2 text-[24px] font-extrabold sm:text-[28px]">
                  <span className="text-muted-foreground/60 line-through">7개</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-primary">30~50개</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  일반인 대비 4~7배
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 backdrop-blur">
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                  학습 시간
                </p>
                <p className="mt-2 text-[24px] font-extrabold sm:text-[28px]">
                  <span className="text-muted-foreground/60 line-through">10시간</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-primary">1시간</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  동일 분량 학습 시
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 backdrop-blur">
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                  기본 습득 기간
                </p>
                <p className="mt-2 text-[24px] font-extrabold sm:text-[28px]">
                  <span className="text-primary">6개월</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  주 1회 수업 기준
                </p>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 학년별 기억량 증가 수치 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                MEMORY IMPROVEMENT
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                학년별 기억량 전/후 비교
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                무작위 단어 50개 기억 테스트 기준 평균 측정치
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <div className="space-y-3">
              {gradeStats.map((g, i) => (
                <SectionFadeIn key={g.grade} delay={i * 0.08}>
                  <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-bold sm:text-[16px]">{g.grade}</p>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[12px] font-bold text-primary">
                        +{g.rate}%
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-[13px] sm:text-[14px]">
                      <span className="text-muted-foreground">BEFORE</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-muted-foreground/40"
                          style={{ width: `${(g.before / g.after) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-semibold">
                        {g.before}
                        {g.unit}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[13px] sm:text-[14px]">
                      <span className="text-primary">AFTER</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-full rounded-full bg-primary" />
                      </div>
                      <span className="w-12 text-right font-bold text-primary">
                        {g.after}
                        {g.unit}
                      </span>
                    </div>
                  </div>
                </SectionFadeIn>
              ))}
            </div>

            <SectionFadeIn delay={0.1}>
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-[20px] border border-border/50 bg-[oklch(0.97_0.005_290)] shadow-xl">
                <Image
                  src="/images/dovision/image_04_02.png"
                  alt="전/후 기억량 비교 차트"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain"
                />
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 실측 케이스 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                MEASURED CASES
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                실측 데이터 기반 사례
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {measuredCases.map((c, i) => (
              <SectionFadeIn key={c.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-border/60 bg-card p-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[17px] font-bold sm:text-[19px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-semibold text-primary sm:text-[13px]">
                    {c.subject}
                  </p>
                  <p className="mt-3 text-[13px] leading-[1.65] text-muted-foreground sm:text-[14px]">
                    {c.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 두비전 공식 영상 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                OFFICIAL VIDEO
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                두비전 학습법 공식 영상
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                이미지전환기억법을 실제 과목(세계사)에 적용하는 과정을 직접
                확인하세요
              </p>
            </div>
          </SectionFadeIn>

          <SectionFadeIn delay={0.1}>
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-[20px] border border-border/50 bg-black shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/PHOVnP8s7mk?rel=0"
                  title="두비전 | 세계사 공부 방법론"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-muted-foreground sm:text-[13px]">
                <PlayCircle className="h-4 w-4 text-primary" />
                <span>
                  두비전 공식 · 세계사 공부 방법론 (이미지전환기억법 적용 예시)
                </span>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 학생 후기 카드 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                STUDENT VOICES
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                학생·학부모 후기
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item, i) => (
              <SectionFadeIn key={item.id} delay={i * 0.08}>
                <Card className="h-full border-border/60 transition-all hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="p-7">
                    <Quote className="h-7 w-7 text-primary/30" />
                    <span className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-bold text-primary">
                      {item.achievement}
                    </span>
                    <p className="mt-5 text-[14px] leading-[1.75] text-muted-foreground sm:text-[15px]">
                      &ldquo;{item.content}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                      <div>
                        <p className="text-[14px] font-bold">{item.studentName}</p>
                        <p className="text-[12px] text-muted-foreground">{item.grade}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        수강 {item.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 합격 대학 */}
      <section className="bg-foreground py-20 text-background">
        <div className="container-responsive text-center">
          <SectionFadeIn>
            <GraduationCap className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
              ADMISSIONS
            </p>
            <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
              두비전 출신 합격 학교
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[14px] text-background/60 sm:text-[16px]">
              12개월 이상 훈련 학생 기준 대표 합격 사례
            </p>
          </SectionFadeIn>
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
            {admissions.map((a, i) => (
              <SectionFadeIn key={a} delay={i * 0.05}>
                <span className="rounded-full border border-background/20 bg-background/5 px-5 py-2.5 text-[13px] font-semibold backdrop-blur sm:text-[14px]">
                  {a}
                </span>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-responsive text-center">
          <h2 className="font-bold leading-[1.15] tracking-[-0.02em] text-[28px] sm:text-[40px] lg:text-[48px]">
            <span className="text-primary">우리 아이도</span> 변화할 수 있을까요?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.7] text-muted-foreground sm:text-[16px]">
            무료 상담·체험 후 학년에 맞는 맞춤 커리큘럼을 안내드립니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-[14px] font-bold text-background transition-transform hover:translate-y-[-2px] sm:text-[15px]"
            >
              무료 상담·체험 신청
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/program"
              className="rounded-full border border-border px-7 py-3.5 text-[14px] font-bold transition-colors hover:border-foreground sm:text-[15px]"
            >
              프로그램 상세 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
