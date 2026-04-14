import { Metadata } from "next";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Brain, Zap, BookOpen, Monitor, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "프로그램 상세",
  description: "두비전 핵심 프로그램 상세 안내. 이미지전환기억법, 뉴로피드백 트레이닝, BTS 시스템, 영재 뇌 훈련 5단계.",
};

const btsModules = [
  "시각 집중력 훈련",
  "청각 집중력 훈련",
  "순차 기억력 훈련",
  "공간 지각력 훈련",
  "논리 사고력 훈련",
  "창의 발상력 훈련",
  "언어 처리력 훈련",
  "수리 연산력 훈련",
  "종합 두뇌 훈련",
];

const brainStages = [
  { stage: "1단계", title: "두뇌 각성", desc: "뇌파 안정화 및 기초 집중력 형성" },
  { stage: "2단계", title: "두뇌 활성", desc: "좌뇌/우뇌 균형 발달 촉진" },
  { stage: "3단계", title: "두뇌 강화", desc: "고차원 인지 기능 훈련" },
  { stage: "4단계", title: "두뇌 통합", desc: "전두엽 기능 최적화" },
  { stage: "5단계", title: "두뇌 마스터", desc: "자기주도적 두뇌 활용 능력 완성" },
];

const brainWaves = [
  { name: "델타파 (0.5~4Hz)", desc: "수면, 무의식 상태", color: "bg-purple-500" },
  { name: "세타파 (4~8Hz)", desc: "깊은 명상, 창의성", color: "bg-blue-500" },
  { name: "알파파 (8~13Hz)", desc: "이완, 집중 준비 상태", color: "bg-green-500" },
  { name: "SMR파 (12~15Hz)", desc: "안정적 집중 상태", color: "bg-yellow-500" },
  { name: "베타파 (15~30Hz)", desc: "활발한 사고, 집중", color: "bg-orange-500" },
];

export default function ProgramPage() {
  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">프로그램 상세</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              과학적으로 검증된 두비전의 3대 핵심 프로그램을 소개합니다
            </p>
          </SectionFadeIn>
        </div>
      </section>

      {/* 이미지전환기억법 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">이미지전환기억법</h2>
                <p className="text-sm text-primary">특허 등록 기술</p>
              </div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn delay={0.1}>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  이미지전환기억법은 숫자, 단어, 개념 등을 시각적 이미지로 전환하여
                  장기기억으로 저장하는 두비전만의 독자적인 기억법입니다.
                </p>
                <p>
                  기존의 반복 암기 방식이 아닌, 뇌의 이미지 처리 기능을 극대화하여
                  적은 시간에 더 많은 정보를 정확하게 기억할 수 있게 합니다.
                </p>
                <p>
                  48주 체계적 커리큘럼으로 진행되며, 평균적으로 기억량이 600% 이상 향상되는
                  실증 결과를 보유하고 있습니다.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">48주 커리큘럼 구성</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">1~12주</span>
                    <span className="text-sm">기초 이미지 전환 훈련</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">13~24주</span>
                    <span className="text-sm">연상 기억법 심화</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">25~36주</span>
                    <span className="text-sm">학습 적용 훈련 (영어, 역사, 과학)</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">37~48주</span>
                    <span className="text-sm">고급 기억법 + 자기주도 학습 전략</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 뉴로피드백 */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">뉴로피드백 트레이닝</h2>
                <p className="text-sm text-primary">뇌파 기반 과학 훈련</p>
              </div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn delay={0.1}>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  뉴로피드백은 뇌파(EEG) 측정 장비를 활용하여 실시간으로 뇌의 활동 상태를
                  모니터링하고, 바이오피드백을 통해 원하는 뇌파 상태를 훈련하는 과학적 방법입니다.
                </p>
                <p>
                  집중력, 기억력, 창의력 등 목적에 따라 맞춤형 프로토콜을 적용하며,
                  훈련 전후 뇌파 변화를 객관적으로 확인할 수 있습니다.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">뇌파 종류와 기능</h3>
                {brainWaves.map((wave) => (
                  <div key={wave.name} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <div className={`h-3 w-3 rounded-full ${wave.color}`} />
                    <div>
                      <span className="text-sm font-medium">{wave.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{wave.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* BTS 시스템 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">BTS 시스템</h2>
                <p className="text-sm text-primary">Brain Training Skill - 9가지 모듈</p>
              </div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn delay={0.1}>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {btsModules.map((module, i) => (
                <div key={module} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{module}</span>
                </div>
              ))}
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* 영재 뇌 훈련 5단계 */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">영재 뇌 훈련 5단계</h2>
            </div>
          </SectionFadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-5">
            {brainStages.map((item, i) => (
              <SectionFadeIn key={item.stage} delay={i * 0.1}>
                <div className="rounded-xl border bg-card p-5 text-center">
                  <div className="text-2xl font-extrabold text-primary/30">{item.stage}</div>
                  <h3 className="mt-2 font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 앱/온라인 시스템 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionFadeIn>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Monitor className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">앱/온라인 학습 시스템</h2>
            </div>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              센터 훈련과 연계된 온라인 학습 시스템으로 가정에서도 두뇌 훈련을 지속할 수 있습니다.
              학습 진도 관리, 성과 리포트 등을 앱으로 간편하게 확인할 수 있습니다.
            </p>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
}
