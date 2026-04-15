import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import {
  Brain,
  Zap,
  BookOpen,
  Monitor,
  Layers,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "프로그램 상세",
  description:
    "두비전 핵심 프로그램 상세 안내. 특허 이미지전환기억법 48주 커리큘럼, 뉴로피드백 트레이닝, BTS 9모듈, 영재 뇌 훈련 5단계.",
};

const btsModules = [
  { num: 1, name: "시각 집중력 훈련", desc: "패턴·이미지 집중 능력 강화" },
  { num: 2, name: "청각 집중력 훈련", desc: "소리·언어 정보 처리력 향상" },
  { num: 3, name: "순차 기억력 훈련", desc: "순서·연속 기억 정확도 증가" },
  { num: 4, name: "공간 지각력 훈련", desc: "3D 공간·도형 이해력 발달" },
  { num: 5, name: "논리 사고력 훈련", desc: "추론·문제 해결력 강화" },
  { num: 6, name: "창의 발상력 훈련", desc: "아이디어 전환·확장 능력" },
  { num: 7, name: "언어 처리력 훈련", desc: "어휘·독해·표현 통합 훈련" },
  { num: 8, name: "수리 연산력 훈련", desc: "암산·수리 추론 가속" },
  { num: 9, name: "종합 두뇌 훈련", desc: "전 영역 통합·실전 적용" },
];

const brainStages = [
  { stage: "1단계", title: "두뇌 각성", desc: "뇌파 안정화 및 기초 집중력 형성" },
  { stage: "2단계", title: "두뇌 활성", desc: "좌뇌·우뇌 균형 발달 촉진" },
  { stage: "3단계", title: "두뇌 강화", desc: "고차원 인지 기능 훈련" },
  { stage: "4단계", title: "두뇌 통합", desc: "전두엽 기능 최적화" },
  { stage: "5단계", title: "두뇌 마스터", desc: "자기주도 학습 능력 완성" },
];

const brainWaves = [
  {
    name: "델타파 (0.5~4Hz)",
    desc: "수면 · 무의식 회복 상태",
    color: "bg-purple-600",
  },
  {
    name: "세타파 (4~8Hz)",
    desc: "깊은 명상 · 창의성 발현",
    color: "bg-blue-600",
  },
  {
    name: "알파파 (8~13Hz)",
    desc: "이완 · 집중 준비 상태",
    color: "bg-green-600",
  },
  {
    name: "SMR파 (12~15Hz)",
    desc: "안정적 집중 · 학습 최적",
    color: "bg-yellow-500",
  },
  {
    name: "베타파 (15~30Hz)",
    desc: "활발한 사고 · 능동적 집중",
    color: "bg-orange-500",
  },
];

const curriculum48 = [
  {
    weeks: "1~12주",
    title: "기초 이미지 전환 훈련",
    points: ["기본 100개 기억틀 학습", "단어·숫자 시각화 연습", "주 1회 90분 정규 수업"],
  },
  {
    weeks: "13~24주",
    title: "연상 기억법 심화",
    points: ["스토리·연결 기억 적용", "복합 정보 동시 기억", "월 1회 진도 평가"],
  },
  {
    weeks: "25~36주",
    title: "학습 적용 훈련",
    points: ["영어 단어·역사 키워드", "과학·국어 개념 적용", "학습 적용 사례 발표"],
  },
  {
    weeks: "37~48주",
    title: "고급 기억법 + 자기주도 학습 전략",
    points: ["1,000개 정보 동시 기억", "시험 대비 실전 훈련", "자기주도 학습 플랜 수립"],
  },
];

const neuroEffects = [
  "뇌 기능 안정화 및 좌·우뇌 균형",
  "정서 조절 능력 향상",
  "주의 집중력·지속력 강화",
  "정보 처리 속도 개선",
  "수면 질 및 회복력 향상",
  "학습 성과 및 자기효능감 증가",
];

export default function ProgramPage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              CORE PROGRAMS
            </span>
            <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[68px]">
              두비전의
              <br />
              <span className="text-primary">3대 핵심 프로그램</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
              특허 이미지전환기억법 · 뉴로피드백 트레이닝 · BTS 시스템.
              <br className="hidden sm:inline" />
              과학적으로 검증된 3가지 핵심 프로그램이 두비전을 만듭니다.
            </p>
          </SectionFadeIn>

          {/* 추천 대상 / 수업 정보 */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <Calendar className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-[12px] font-semibold text-muted-foreground">권장 시작 연령</p>
              <p className="mt-1 text-[16px] font-bold">초등 3학년 이상</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <Clock className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-[12px] font-semibold text-muted-foreground">수업 주기</p>
              <p className="mt-1 text-[16px] font-bold">주 1회 · 회당 90분</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <ShieldCheck className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-[12px] font-semibold text-muted-foreground">기본 마스터</p>
              <p className="mt-1 text-[16px] font-bold">6개월 · 실전 12개월</p>
            </div>
          </div>
        </div>
      </section>

      {/* ① 이미지전환기억법 */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <SectionFadeIn>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-border/50 shadow-xl">
                <Image
                  src="/images/dovision/image_01.png"
                  alt="이미지전환기억법"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </SectionFadeIn>
            <SectionFadeIn delay={0.1}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                    PROGRAM 01 · 특허 등록 기술
                  </p>
                  <h2 className="mt-1 text-[28px] font-bold sm:text-[34px]">
                    이미지전환기억법
                  </h2>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-muted-foreground sm:text-[16px]">
                <p>
                  숫자·단어·개념 등 추상적 정보를 시각적 이미지로 전환해 장기
                  기억으로 저장하는 두비전만의 독자 기억법입니다. 반복 암기가
                  아닌 뇌의 이미지 처리 기능을 극대화해, 같은 시간에 훨씬 많은
                  정보를 정확하게 기억할 수 있습니다.
                </p>
                <p>
                  체계적으로 개발된 100개 이상의 기억틀로 1,000개 단위 정보를
                  동시에 기억할 수 있으며, 평균 기억량 600% 이상 향상되는
                  실증 결과를 보유하고 있습니다.
                </p>
              </div>

              {/* 48주 커리큘럼 */}
              <div className="mt-8">
                <h3 className="text-[16px] font-bold sm:text-[18px]">
                  48주 단계별 커리큘럼
                </h3>
                <div className="mt-4 space-y-3">
                  {curriculum48.map((c) => (
                    <div
                      key={c.weeks}
                      className="rounded-xl border border-border/60 bg-card p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                          {c.weeks}
                        </span>
                        <p className="text-[15px] font-bold sm:text-[16px]">
                          {c.title}
                        </p>
                      </div>
                      <ul className="mt-3 grid gap-1 text-[13px] text-muted-foreground sm:grid-cols-3 sm:text-[14px]">
                        {c.points.map((p) => (
                          <li key={p} className="flex gap-1.5">
                            <span className="text-primary">·</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* ② 뉴로피드백 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                  PROGRAM 02 · 뇌파 기반 과학 훈련
                </p>
                <h2 className="mt-1 text-[28px] font-bold sm:text-[34px]">
                  뉴로피드백 트레이닝
                </h2>
              </div>
            </div>
          </SectionFadeIn>
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <SectionFadeIn delay={0.1}>
              <div className="space-y-4 text-[15px] leading-[1.8] text-muted-foreground sm:text-[16px]">
                <p>
                  뉴로피드백은 EEG(뇌파 측정) 장비로 실시간 뇌 상태를 모니터링하고,
                  바이오피드백을 통해 원하는 뇌파 상태를 학습시키는 과학적 훈련
                  방법입니다. 집중력·기억력·정서 조절 등 목적에 따라 맞춤형
                  프로토콜을 적용합니다.
                </p>
                <p>
                  센터 내 측정·훈련과 함께 가정용 디바이스 연계 훈련도 가능하며,
                  3개월마다 정기적으로 뇌파 변화를 측정해 객관적으로 진척도를
                  확인합니다.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="text-[15px] font-bold sm:text-[16px]">
                  훈련 구조
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground">주 횟수</p>
                    <p className="mt-1 text-[18px] font-bold text-primary">1~2회</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground">회당 시간</p>
                    <p className="mt-1 text-[18px] font-bold text-primary">30분</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground">측정 주기</p>
                    <p className="mt-1 text-[18px] font-bold text-primary">3개월</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-[12px] leading-[1.6] text-amber-900 sm:text-[13px]">
                <strong>측정 전 주의:</strong> 정확한 뇌파 측정을 위해 검사 24시간
                전 카페인·알코올 섭취를 피하고, 복용 중인 약물이 있다면 사전에
                알려주세요.
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.2}>
              <div className="space-y-3">
                <h3 className="text-[15px] font-bold sm:text-[16px]">
                  뇌파 종류와 특성
                </h3>
                {brainWaves.map((wave) => (
                  <div
                    key={wave.name}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className={`h-3 w-3 rounded-full ${wave.color}`} />
                    <div className="flex-1">
                      <p className="text-[14px] font-bold sm:text-[15px]">
                        {wave.name}
                      </p>
                      <p className="text-[12px] text-muted-foreground sm:text-[13px]">
                        {wave.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="text-[15px] font-bold sm:text-[16px]">
                  기대 효과
                </h3>
                <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground sm:text-[14px]">
                  {neuroEffects.map((e) => (
                    <li key={e} className="flex gap-2">
                      <span className="text-primary">✓</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* ③ BTS 시스템 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                  PROGRAM 03 · BRAIN TRAINING SKILL
                </p>
                <h2 className="mt-1 text-[28px] font-bold sm:text-[34px]">
                  BTS 시스템 — 9가지 모듈
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-muted-foreground sm:text-[16px]">
              집중력·기억력·창의력·논리력 등 두뇌 핵심 능력을 9개 영역으로
              나누어 체계적으로 발달시키는 두비전 고유의 통합 두뇌 훈련
              시스템입니다.
            </p>
          </SectionFadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {btsModules.map((m, i) => (
              <SectionFadeIn key={m.name} delay={i * 0.05}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[14px] font-extrabold text-primary group-hover:bg-primary group-hover:text-white">
                      {m.num}
                    </span>
                    <p className="text-[16px] font-bold">{m.name}</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.6] text-muted-foreground sm:text-[14px]">
                    {m.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 영재 뇌 훈련 5단계 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                  ADVANCED TRACK
                </p>
                <h2 className="mt-1 text-[28px] font-bold sm:text-[34px]">
                  영재 뇌 훈련 5단계
                </h2>
              </div>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brainStages.map((item, i) => (
              <SectionFadeIn key={item.stage} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border/60 bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="text-[22px] font-extrabold text-primary/40">
                    {item.stage}
                  </div>
                  <h3 className="mt-2 text-[17px] font-bold">{item.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground sm:text-[13px]">
                    {item.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 앱/온라인 */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionFadeIn>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Monitor className="h-6 w-6" />
                </div>
                <h2 className="text-[28px] font-bold sm:text-[34px]">
                  앱·온라인 학습 시스템
                </h2>
              </div>
              <p className="mt-6 text-[15px] leading-[1.8] text-muted-foreground sm:text-[16px]">
                센터 훈련과 연계된 두비전 전용 앱·온라인 시스템으로 가정에서도
                두뇌 훈련을 지속할 수 있습니다. 학습 진도, 주차별 미션, 성과
                리포트를 한 번에 확인할 수 있어 학부모도 함께 진척을 모니터링할
                수 있습니다.
              </p>
              <ul className="mt-6 space-y-2 text-[14px] text-muted-foreground sm:text-[15px]">
                <li>· 주차별 학습 미션 자동 배정</li>
                <li>· 기억량 측정 / 진척도 그래프</li>
                <li>· 학부모 대시보드 (출결·성과 알림)</li>
                <li>· 가정용 뉴로피드백 디바이스 연동</li>
              </ul>
            </SectionFadeIn>

            <SectionFadeIn delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-border/50 bg-[oklch(0.97_0.005_290)] shadow-xl">
                <Image
                  src="/images/dovision/image_06_02.png"
                  alt="4단계 학습 프로세스"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-contain"
                />
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-responsive text-center">
          <h2 className="font-black leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            가맹점에서 동일 프로그램으로
            <br />
            교육 사업을 시작하세요
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] text-white/80 sm:text-[16px]">
            본사 직영 센터와 동일한 커리큘럼·교재·장비 패키지를 가맹점에 그대로
            제공합니다.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/franchise"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-bold text-foreground transition-transform hover:translate-y-[-2px] sm:text-[15px]"
            >
              가맹 안내 보기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-7 py-3.5 text-[14px] font-bold text-white backdrop-blur transition-colors hover:bg-white/15 sm:text-[15px]"
            >
              상담 신청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
