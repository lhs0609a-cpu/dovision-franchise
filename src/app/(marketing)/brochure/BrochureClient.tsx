"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Tv,
  Building2,
  Brain,
  Activity,
  BookOpen,
  Users,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Download,
  ArrowLeft,
  CheckCircle2,
  Calculator,
  Sparkles,
  Target,
  Zap,
  LineChart,
  GraduationCap,
  Quote,
  Globe,
  Calendar,
} from "lucide-react";

// ============================================================
// 두비전 공식 회사소개서 (A4 인쇄 최적화 · 12페이지 풀 비주얼)
// ============================================================

const TOTAL_PAGES = 12;

export default function BrochureClient() {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="brochure-root bg-[#f5f5f7] py-8">
      {/* 상단 액션 바 (인쇄 시 숨김) */}
      <div className="brochure-actionbar mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground shadow-md transition-transform hover:translate-y-[-1px] sm:text-[14px]"
        >
          <Download className="h-4 w-4" />
          PDF로 저장 / 인쇄
        </button>
      </div>

      {/* ==================================================== */}
      {/* PAGE 1 — COVER                                        */}
      {/* ==================================================== */}
      <Page>
        <div className="relative flex h-full flex-col overflow-hidden bg-[oklch(0.32_0.18_290)] text-white">
          <Image
            src="/images/dovision/image_08.png"
            alt=""
            aria-hidden
            fill
            sizes="210mm"
            className="absolute inset-0 object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.28_0.20_290)] via-transparent to-[oklch(0.18_0.18_290)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.2),transparent_55%)]" />

          {/* Decorative brain image */}
          <div className="pointer-events-none absolute right-[-30mm] top-[40mm] h-[160mm] w-[160mm] opacity-25">
            <Image
              src="/images/dovision/image_01.png"
              alt=""
              fill
              sizes="160mm"
              className="object-contain mix-blend-screen"
            />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-[18mm]">
            <div>
              <p className="text-[11px] font-bold tracking-[0.4em] text-white/80">
                COMPANY BROCHURE · 2026
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] backdrop-blur">
                <Building2 className="h-3.5 w-3.5" />
                ㈜키네스 그룹 · 27년
              </div>
            </div>

            <div>
              <p className="text-[14px] font-semibold tracking-[0.25em] text-white/70">
                BRAIN EDUCATION · MEMORY · NEUROFEEDBACK
              </p>
              <h1 className="mt-4 font-black leading-[0.92] tracking-[-0.04em] text-[88px]">
                DOVISION
              </h1>
              <p className="mt-4 text-[20px] font-medium leading-[1.4] text-white/95">
                천재의 기억법 · 두비전
              </p>
              <p className="mt-3 max-w-[150mm] text-[13px] leading-[1.7] text-white/75">
                25년 뇌교육 연구와 특허 기술로, 학생의 잠재력을 과학적으로
                끌어올리는 창의융합 뇌교육 프랜차이즈입니다.
              </p>

              {/* Cover badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "MEMORY METHOD",
                  "NEUROFEEDBACK",
                  "BTS 검사",
                  "특허 등록",
                  "27년 그룹",
                ].map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] backdrop-blur"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-white/20 pt-5 text-[10px] text-white/70">
              <div>
                <p className="font-bold text-white">㈜키네스 두비전 사업부</p>
                <p className="mt-1">서울 강남구 역삼2동 775-2 초원빌딩 3층</p>
              </div>
              <div className="text-right">
                <p className="font-mono">www.dovision.kr</p>
                <p className="mt-0.5 font-mono">0507-1434-3226</p>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 2 — CONTENTS                                     */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={2} title="CONTENTS · 목차" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[1fr_60mm]">
          <div className="px-[18mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              TABLE OF CONTENTS
            </p>
            <h2 className="mt-3 text-[32px] font-black leading-[1.05] tracking-[-0.02em]">
              두비전의 모든 것,
              <br />
              <span className="text-primary">8가지 챕터</span>로
            </h2>

            <div className="mt-8 space-y-2.5">
              {[
                ["01", "WHY DOVISION", "두비전이 다른 이유", "03"],
                ["02", "BRAND STORY", "도미닉 오브라이언과 두비전의 탄생", "04"],
                ["03", "KINESS GROUP", "27년 ㈜키네스 그룹 시너지", "05"],
                ["04", "MEMORY METHOD", "이미지전환기억법 (특허)", "06"],
                ["05", "NEUROFEEDBACK", "뉴로피드백 집중력 훈련", "07"],
                ["06", "BTS · CURRICULUM", "BTS 뇌기능검사 + 학습 프로세스", "08"],
                ["07", "CREDENTIALS", "특허·수상·미디어 실적", "09"],
                ["08", "SUCCESS CASES", "학생 변화 실제 사례", "10"],
                ["09", "INVESTMENT", "가맹 투자·운영 구조", "11"],
                ["10", "SUPPORT & CONTACT", "본사 지원 + 다음 단계", "12"],
              ].map(([no, en, ko, p]) => (
                <div
                  key={no}
                  className="flex items-baseline gap-3 border-b border-border/40 pb-2"
                >
                  <span className="w-[18px] text-[13px] font-black text-primary">
                    {no}
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.1em]">
                    {en}
                  </span>
                  <span className="flex-1 text-[10.5px] text-muted-foreground">
                    — {ko}
                  </span>
                  <span className="text-[10.5px] font-mono text-muted-foreground">
                    p.{p}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[10.5px] leading-[1.7] text-muted-foreground">
              본 자료는 두비전 가맹 검토를 위한 공식 회사소개서입니다. 추가 자료
              요청은 가맹 전담 매니저(0507-1434-3226)에게 문의 주십시오.
            </p>
          </div>

          {/* Right strip: feature image */}
          <div className="relative bg-primary/10">
            <Image
              src="/images/dovision/image_05.png"
              alt="두비전 뇌교육 시각화"
              fill
              sizes="60mm"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-primary/20" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-[10px] font-bold tracking-[0.25em] text-white/80">
                SINCE 2001
              </p>
              <p className="mt-2 text-[20px] font-black leading-[1.1]">
                25년의
                <br />
                뇌교육 연구
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 3 — WHY DOVISION                                 */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={3} title="WHY DOVISION · 두비전이 다른 이유" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[1fr_70mm]">
          <div className="px-[18mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              CHAPTER 01
            </p>
            <h2 className="mt-3 text-[32px] font-black leading-[1.1] tracking-[-0.02em]">
              기억은 재능이 아니라
              <br />
              <span className="text-primary">학습 가능한 기술</span>입니다.
            </h2>
            <p className="mt-5 text-[12px] leading-[1.85] text-muted-foreground">
              두비전(DOVISION)은 2001년부터 축적된 뇌교육 연구와
              이미지전환기억법(특허 제10-1994856호)을 결합한 창의융합 뇌교육
              브랜드입니다. 단순 암기 학원이 아닌, 뇌의 작동 원리를 이해하고
              훈련해 학습 효율을 극대화하는 과학적 교육 시스템을 제공합니다.
            </p>

            {/* 3 USPs */}
            <div className="mt-7 space-y-3">
              {[
                {
                  no: "01",
                  icon: ShieldCheck,
                  t: "특허 기반 독점 커리큘럼",
                  d: "이미지전환기억법(특허 제10-1994856호)을 비롯한 검증된 뇌교육 시스템. 동종 프로그램의 시장 진입을 법적으로 차단합니다.",
                },
                {
                  no: "02",
                  icon: Calendar,
                  t: "25년 연구·교육 노하우",
                  d: "2001년부터 누적된 학생 데이터, 27차례 교재 개정, 직영 3개 센터의 운영 매뉴얼이 가맹점주에게 그대로 이전됩니다.",
                },
                {
                  no: "03",
                  icon: Activity,
                  t: "검사·훈련·코칭 통합 솔루션",
                  d: "이미지전환기억법 + 뉴로피드백 + BTS 뇌기능검사. 단일 프로그램이 아닌 통합 솔루션으로 정량적 성과를 제공합니다.",
                },
              ].map((u) => (
                <div
                  key={u.no}
                  className="rounded-xl border border-border/60 bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <u.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-black text-primary">
                          {u.no}
                        </span>
                        <p className="text-[13px] font-bold leading-[1.3]">
                          {u.t}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[10.5px] leading-[1.65] text-muted-foreground">
                        {u.d}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Brand promise */}
            <div className="mt-6 rounded-xl border-l-4 border-primary bg-primary/5 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                    BRAND PROMISE
                  </p>
                  <p className="mt-1.5 text-[12.5px] font-bold leading-[1.55]">
                    학생이 변화하는 모습을 학부모가 눈으로 확인할 수 있는 교육.
                    검사·훈련·코칭 3-in-1 시스템으로 정량적 성과를 보장합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: brain image + stats */}
          <div className="flex flex-col bg-gradient-to-b from-primary/8 to-primary/15">
            <div className="relative h-[120mm]">
              <Image
                src="/images/dovision/image_01.png"
                alt="두비전 뇌교육 시각화"
                fill
                sizes="70mm"
                className="object-contain p-4"
              />
            </div>
            <div className="flex-1 space-y-2 p-5">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                BY THE NUMBERS
              </p>
              {[
                { num: "25+", label: "년 연구·교육" },
                { num: "10,000+", label: "누적 수강생" },
                { num: "27", label: "교재 개정" },
                { num: "1", label: "특허 등록" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between border-b border-border/40 pb-1.5"
                >
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-[18px] font-black text-primary">
                    {s.num}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 4 — BRAND STORY (DOMINIC O'BRIEN)                */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={4} title="BRAND STORY · 두비전의 탄생" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[80mm_1fr]">
          {/* Left: Dominic image */}
          <div className="relative bg-[oklch(0.95_0.02_290)]">
            <Image
              src="/images/dovision/image_02.png"
              alt="도미닉 오브라이언 세계 기억력 챔피언"
              fill
              sizes="80mm"
              className="object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-5">
              <p className="text-[10px] font-bold tracking-[0.25em] text-white/70">
                DOMINIC O&apos;BRIEN
              </p>
              <p className="mt-1 text-[18px] font-black leading-[1.1] text-white">
                세계 기억력
                <br />
                선수권 8회 우승
              </p>
              <p className="mt-2 text-[10px] leading-[1.55] text-white/85">
                난독증으로 16세 학교 중퇴 → 이미지화 훈련만으로 세계 챔피언
              </p>
            </div>
          </div>

          {/* Right: story content */}
          <div className="px-[15mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              CHAPTER 02 · 기원
            </p>
            <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
              기억력은 <span className="text-primary">타고나는 것</span>이
              아니라,
              <br />
              누구나 연습하면 되는 것.
            </h2>

            <div className="mt-5 space-y-3">
              <Quote className="h-5 w-5 text-primary/40" />
              <p className="text-[11.5px] leading-[1.85] text-muted-foreground">
                학창 시절 난독증으로 16세에 학교를 그만뒀던{" "}
                <strong className="text-foreground">도미닉 오브라이언</strong>은
                <strong className="text-foreground">
                  &ldquo;정보의 이미지화&rdquo;
                </strong>{" "}
                훈련만으로 세계 기억력 선수권에서{" "}
                <strong className="text-primary">8번이나 우승</strong>했습니다.
                두비전은 그의 핵심 원리를 한국 학생의 학습 환경에 맞게
                체계화하고, 25년에 걸쳐 검증한 프로그램입니다.
              </p>
              <p className="text-[11.5px] leading-[1.85] text-muted-foreground">
                2001년 창립자가 도미닉 오브라이언의 방법론을 한국에 처음 도입한
                이후, 누적 1만명이 넘는 학생을 가르치며 한국형 커리큘럼으로
                재설계했습니다. 그 결과가 2018년 등록된{" "}
                <strong className="text-primary">
                  특허 제10-1994856호 이미지전환기억법
                </strong>
                입니다.
              </p>
            </div>

            {/* Timeline */}
            <div className="mt-7">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                BRAND TIMELINE
              </p>
              <div className="mt-3 space-y-2">
                {[
                  ["1999", "㈜키네스 설립 · 성장관리 프랜차이즈 출범"],
                  ["2001", "두비전 R&D 착수 · 도미닉 오브라이언 방법론 도입"],
                  ["2010", "직영 3개 센터 운영 본격화 · 교재 12차 개정"],
                  ["2018", "이미지전환기억법 특허 등록 · 우수 프랜차이즈 선정"],
                  ["2020", "베트남 하노이 진출 · 그룹 해외 사업 확장"],
                  ["2026", "두비전 가맹 본격화 · 본 회사소개서 발행"],
                ].map(([y, d]) => (
                  <div key={y} className="flex items-baseline gap-3">
                    <span className="w-[36px] text-[12px] font-black text-primary">
                      {y}
                    </span>
                    <span className="text-[10.5px] leading-[1.55] text-foreground/85">
                      {d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 5 — KINESS GROUP                                 */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={5} title="KINESS GROUP · ㈜키네스 그룹 27년" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CHAPTER 03 · 그룹 시너지
          </p>
          <h2 className="mt-3 text-[28px] font-black leading-[1.1] tracking-[-0.02em]">
            두비전은 <span className="text-primary">27년 프랜차이즈</span>의
            <br />
            DNA를 그대로 이식받습니다.
          </h2>

          {/* Group stat row with map image hint */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { icon: Calendar, num: "27", label: "년 운영 노하우" },
              { icon: MapPin, num: "17", label: "전국 지점" },
              { icon: Globe, num: "1", label: "해외 진출 (베트남)" },
              { icon: Users, num: "10,000+", label: "누적 수강생" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center"
              >
                <s.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1.5 text-[20px] font-black text-primary">
                  {s.num}
                </p>
                <p className="text-[9.5px] font-semibold text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11.5px] leading-[1.85] text-muted-foreground">
            두비전은 <strong>신생 브랜드 가맹이 아닙니다.</strong> 1999년 설립된
            ㈜키네스가 27년간 전국 17개 지점·해외 1개국(베트남 하노이)을 운영하며
            축적한 실전 매뉴얼이 두비전 가맹점주의 첫 날부터 그대로 작동합니다.
          </p>

          {/* 6 group strengths */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              {
                icon: BookOpen,
                t: "검증된 운영 매뉴얼",
                d: "키네스 17개 지점이 27년간 다듬어 온 상담·회원관리·환불·클레임 매뉴얼이 그대로 두비전에 이식됩니다.",
              },
              {
                icon: Users,
                t: "동일 타겟 고객 풀",
                d: "키네스(성장관리) + 두비전(뇌교육) 모두 8세 이상 자녀의 잠재력을 과학으로 끌어올리려는 학부모를 공유합니다.",
              },
              {
                icon: Building2,
                t: "본사 슈퍼바이저 조직",
                d: "이미 구축된 SV·교육·R&D 조직을 그대로 활용. 별도 본사 셋업 비용 없이 가맹 첫 달부터 풀 지원이 가동됩니다.",
              },
              {
                icon: Tv,
                t: "공동 마케팅 자산",
                d: "KBS·MBC·SBS 등 지상파 다수 출연 이력과 연구 논문·도서 실적이 두비전 브랜드 신뢰도로 직접 연결됩니다.",
              },
              {
                icon: MapPin,
                t: "상권 데이터·입지 우선권",
                d: "서울·경인·경상권 주요 상권 데이터 기반 두비전 입지 컨설팅. 키네스 인근은 시너지 우선 검토 지역입니다.",
              },
              {
                icon: ShieldCheck,
                t: "지역 독점 영업권",
                d: "특허 기반 독점성으로 동일 프로그램 진입 차단. 가맹 계약 시 영업 지역을 별도 보호합니다.",
              },
            ].map((g) => (
              <div
                key={g.t}
                className="rounded-xl border border-border/60 bg-card p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <g.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11.5px] font-bold leading-[1.3]">
                      {g.t}
                    </p>
                    <p className="mt-1 text-[9.5px] leading-[1.6] text-muted-foreground">
                      {g.d}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="mt-5 rounded-xl bg-foreground p-4 text-background">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                  ZERO-TO-ONE NOT NEEDED
                </p>
                <p className="mt-1 text-[13px] font-bold leading-[1.45]">
                  두비전 가맹점주는 신규 본사를 만나는 것이 아니라,
                  <br />
                  27년 검증된 본사 시스템을 첫 날부터 가동합니다.
                </p>
              </div>
              <Sparkles className="h-8 w-8 shrink-0 text-primary" />
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 6 — PROGRAM 1 : MEMORY METHOD (PATENT)          */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={6} title="PROGRAM 01 · 이미지전환기억법" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[1fr_75mm]">
          <div className="px-[18mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              CHAPTER 04 · 핵심 프로그램 1
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-primary-foreground">
              <ShieldCheck className="h-3 w-3" />
              특허 제10-1994856호
            </div>
            <h2 className="mt-3 text-[28px] font-black leading-[1.1] tracking-[-0.02em]">
              이미지전환기억법
              <br />
              <span className="text-primary">Image Memory Method</span>
            </h2>
            <p className="mt-4 text-[11.5px] leading-[1.85] text-muted-foreground">
              숫자·단어·개념 등 추상적 정보를 시각적 이미지로 전환하여 장기기억으로
              저장하는 두비전만의 독자적 기억법입니다. 인간의 뇌가 텍스트보다
              이미지를 훨씬 빠르고 오래 기억한다는 신경과학적 원리에 기반합니다.
            </p>

            {/* Method 4-step */}
            <div className="mt-6">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                4단계 메소드
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    n: "STEP 1",
                    t: "정보 분해 (Decode)",
                    d: "암기 대상을 핵심 단위로 쪼개어 의미 구조를 분석합니다.",
                  },
                  {
                    n: "STEP 2",
                    t: "이미지 변환 (Visualize)",
                    d: "각 단위를 두비전 표준 이미지 코드로 변환합니다.",
                  },
                  {
                    n: "STEP 3",
                    t: "스토리 연결 (Link)",
                    d: "변환된 이미지들을 인과 관계 스토리로 연결합니다.",
                  },
                  {
                    n: "STEP 4",
                    t: "장기 저장 (Encode)",
                    d: "복습 사이클을 통해 장기기억으로 안정화합니다.",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-2.5"
                  >
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary">
                      {s.n}
                    </span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">{s.t}</p>
                      <p className="mt-0.5 text-[10px] leading-[1.55] text-muted-foreground">
                        {s.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="mt-5 rounded-xl border-l-4 border-primary bg-primary/5 p-3.5">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                CURRICULUM
              </p>
              <p className="mt-1.5 text-[11.5px] font-bold">
                48주 체계 (기초 16주 → 심화 16주 → 실전 16주)
              </p>
              <p className="mt-1 text-[10px] leading-[1.6] text-muted-foreground">
                초·중·고 전 학년 적용 가능. 학년·학습 수준에 따라 진도 조정.
              </p>
            </div>

            {/* Key metric */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-foreground p-3.5 text-background">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-[11px] font-bold">기억량 평균 변화</p>
              </div>
              <p className="text-[20px] font-black text-primary">
                +200~600<span className="text-[12px]">%</span>
              </p>
            </div>
          </div>

          {/* Right column: visualization */}
          <div className="flex flex-col bg-gradient-to-b from-primary/10 to-primary/20">
            <div className="relative h-[110mm]">
              <Image
                src="/images/dovision/image_05.png"
                alt="이미지전환기억법 원리"
                fill
                sizes="75mm"
                className="object-contain p-3"
              />
            </div>
            <div className="relative h-[100mm] border-t border-primary/20">
              <Image
                src="/images/dovision/image_06_01_02.png"
                alt="이미지 메모리 적용 사례"
                fill
                sizes="75mm"
                className="object-contain p-3"
              />
            </div>
            <div className="border-t border-primary/20 p-4">
              <p className="text-[9.5px] font-bold tracking-[0.2em] text-primary">
                APPLY TO
              </p>
              <p className="mt-1 text-[10.5px] leading-[1.55] text-foreground/85">
                영어 단어 · 한자 · 역사 연표 · 과학 공식 · 수학 정의
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 7 — PROGRAM 2 : NEUROFEEDBACK                    */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={7} title="PROGRAM 02 · 뉴로피드백" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[75mm_1fr]">
          {/* Left: image stack */}
          <div className="flex flex-col bg-gradient-to-b from-primary/15 to-primary/5">
            <div className="relative h-[145mm]">
              <Image
                src="/images/dovision/image_07.png"
                alt="뉴로피드백 훈련 시각화"
                fill
                sizes="75mm"
                className="object-contain p-3"
              />
            </div>
            <div className="relative h-[110mm] border-t border-primary/20">
              <Image
                src="/images/dovision/image_06_01.png"
                alt="뇌파 측정 그래프"
                fill
                sizes="75mm"
                className="object-contain p-4"
              />
            </div>
            <div className="border-t border-primary/20 bg-foreground p-4 text-background">
              <p className="text-[9.5px] font-bold tracking-[0.2em] text-primary">
                EVIDENCE-BASED
              </p>
              <p className="mt-1 text-[10.5px] leading-[1.55]">
                뇌파(EEG) 측정 기반 임상 검증 훈련법
              </p>
            </div>
          </div>

          <div className="px-[15mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              CHAPTER 05 · 핵심 프로그램 2
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-primary">
              <Activity className="h-3 w-3" />
              EEG · BIOFEEDBACK
            </div>
            <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
              뉴로피드백 훈련
              <br />
              <span className="text-primary">Neurofeedback Training</span>
            </h2>
            <p className="mt-4 text-[11.5px] leading-[1.85] text-muted-foreground">
              실시간 뇌파 측정으로 학생의 집중·이완 상태를 시각화하고, 뇌가
              스스로 최적 상태를 학습하도록 유도하는 과학적 훈련법입니다. 기억법이
              <strong className="text-foreground"> &ldquo;방법&rdquo;</strong>이라면
              뉴로피드백은
              <strong className="text-foreground"> &ldquo;뇌의 상태&rdquo;</strong>를
              훈련합니다.
            </p>

            {/* Key benefits */}
            <div className="mt-6 space-y-2.5">
              {[
                {
                  icon: Target,
                  t: "집중력 강화",
                  d: "주의력결핍·과잉행동(ADHD) 개선에 임상적 효과 검증. 학습 지속 시간 연장.",
                },
                {
                  icon: Zap,
                  t: "정보처리 속도 향상",
                  d: "뇌파 안정화 훈련으로 동일 시간 내 정보 처리량 증가.",
                },
                {
                  icon: Brain,
                  t: "메타인지 강화",
                  d: "자신의 뇌 상태를 인지하고 조절하는 능력 발달. 학습 효율의 결정 요인.",
                },
                {
                  icon: GraduationCap,
                  t: "학업 스트레스 관리",
                  d: "시험·발표 등 고압 상황에서 뇌 상태를 자기 조절할 수 있는 능력 형성.",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11.5px] font-bold">{b.t}</p>
                    <p className="mt-1 text-[10px] leading-[1.6] text-muted-foreground">
                      {b.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Equipment note */}
            <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] text-primary">
                    EQUIPMENT
                  </p>
                  <p className="mt-1 text-[10.5px] font-semibold leading-[1.55]">
                    본사 납품·세팅·A/S 일괄 지원
                    <br />
                    가맹점주 별도 장비 조달 불필요
                  </p>
                </div>
                <p className="text-[18px] font-black text-primary">
                  +30~50<span className="text-[10px]">%</span>
                </p>
              </div>
              <p className="mt-2 border-t border-primary/20 pt-2 text-[9.5px] text-muted-foreground">
                * 집중력 측정 점수 평균 개선 폭 (직영 센터 6개월 데이터 기준)
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 8 — PROGRAM 3 : BTS + LEARNING PROCESS           */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={8} title="PROGRAM 03 · BTS + 학습 프로세스" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CHAPTER 06 · 통합 시스템
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
            검사 · 훈련 · 코칭의
            <br />
            <span className="text-primary">3-in-1 통합 학습 사이클</span>
          </h2>

          {/* BTS card */}
          <div className="mt-6 rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <LineChart className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-primary">
                    BTS · BRAIN TEST
                  </span>
                </div>
                <p className="mt-2 text-[15px] font-bold">
                  BTS 뇌기능검사 — 정량 평가 시스템
                </p>
                <p className="mt-1.5 text-[10.5px] leading-[1.7] text-muted-foreground">
                  외부 전문기관과 연계해 기억력·집중력·정보처리속도·실행기능 등
                  핵심 인지 기능을 정량적으로 측정합니다. 매 3개월 재검사로 학생의
                  변화를 그래프 리포트로 시각화하여 학부모 상담 시 객관적 데이터로
                  활용합니다.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[
                    "기억력",
                    "집중력",
                    "정보처리속도",
                    "실행기능",
                    "공간지각",
                    "언어능력",
                  ].map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[9.5px] font-semibold text-primary"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learning process visual */}
          <div className="mt-6 grid grid-cols-[1fr_85mm] gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                LEARNING CYCLE · 3개월 1사이클
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    n: "1",
                    t: "BTS 진단",
                    d: "현재 인지 기능 영역별 측정 → 개인 맞춤 진단 리포트",
                  },
                  {
                    n: "2",
                    t: "프로그램 매칭",
                    d: "기억법 + 뉴로피드백 비중을 학생 특성에 맞게 조정",
                  },
                  {
                    n: "3",
                    t: "훈련 실행",
                    d: "주 2회 수업 + 코칭 + 필요시 뉴로피드백 (월 80만원)",
                  },
                  {
                    n: "4",
                    t: "재진단·코칭",
                    d: "3개월 후 BTS 재검사 → 변화 그래프 + 학부모 코칭 상담",
                  },
                ].map((p) => (
                  <div
                    key={p.n}
                    className="flex items-start gap-3 rounded-lg bg-muted/30 p-2.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-black text-primary-foreground">
                      {p.n}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11.5px] font-bold">{p.t}</p>
                      <p className="mt-0.5 text-[10px] leading-[1.55] text-muted-foreground">
                        {p.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-primary/5">
              <Image
                src="/images/dovision/image_06_02.png"
                alt="두비전 학습 프로세스 다이어그램"
                fill
                sizes="85mm"
                className="object-contain p-3"
              />
            </div>
          </div>

          {/* Class structure */}
          <div className="mt-5 rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                  CLASS STRUCTURE
                </p>
                <p className="mt-1.5 text-[13px] font-bold">
                  주 2회 수업 (집중 교육 + 코칭/상담 + 필요시 뉴로피드백)
                </p>
                <p className="mt-1 text-[10px] leading-[1.55] text-muted-foreground">
                  월 80만원 · 6개월 선불 480만원 · BTS 재검사 매 3개월 10만원 별도
                </p>
              </div>
              <div className="text-right">
                <p className="text-[28px] font-black text-primary">
                  480<span className="text-[12px]">만원</span>
                </p>
                <p className="text-[9.5px] font-semibold text-muted-foreground">
                  6개월 선불 등록비
                </p>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 9 — CREDENTIALS                                  */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={9} title="CREDENTIALS · 특허·수상·미디어" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[80mm_1fr]">
          {/* Left: patent image */}
          <div className="relative bg-[oklch(0.94_0.02_290)] p-5">
            <div className="relative h-full overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm">
              <Image
                src="/images/dovision/image_03.png"
                alt="이미지전환기억법 특허증 (대한민국 특허청)"
                fill
                sizes="80mm"
                className="object-contain p-3"
              />
            </div>
            <div className="absolute bottom-7 left-7 right-7 rounded-md bg-foreground/85 p-3 text-center backdrop-blur">
              <p className="text-[9.5px] font-bold tracking-[0.2em] text-primary">
                PATENT NO.
              </p>
              <p className="mt-1 text-[14px] font-black text-background">
                제10-1994856호
              </p>
              <p className="mt-1 text-[9px] text-background/70">
                대한민국 특허청 등록
              </p>
            </div>
          </div>

          <div className="px-[15mm] py-[14mm]">
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
              CHAPTER 07 · 검증된 신뢰
            </p>
            <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
              검증된 신뢰,
              <br />
              <span className="text-primary">27년의 증거</span>
            </h2>

            {/* Cred items */}
            <div className="mt-6 space-y-3">
              {[
                {
                  icon: ShieldCheck,
                  tag: "PATENT",
                  t: "특허 제10-1994856호",
                  d: "대한민국 특허청 정식 등록 · 이미지전환기억법. 동일 프로그램의 타 브랜드 진입이 법적으로 제한되어, 가맹점주는 지역 독점성을 누립니다.",
                },
                {
                  icon: Award,
                  tag: "AWARD",
                  t: "우수 프랜차이즈 (2018)",
                  d: "소상공인진흥공단 우수 프랜차이즈 선정. 본사 운영 시스템과 가맹점 지원 체계의 공식 인증입니다.",
                },
                {
                  icon: Tv,
                  tag: "MEDIA",
                  t: "KBS · MBC · SBS 다수 출연",
                  d: "지상파 3사 교양·시사·교육 프로그램에 두비전 교육 사례 다수 방영. 신규 가맹점 오픈 시 학부모 신뢰 자산으로 직접 활용 가능합니다.",
                },
                {
                  icon: Building2,
                  tag: "GROUP",
                  t: "㈜키네스 그룹 27년",
                  d: "1999년 설립 · 전국 17개 지점 + 해외 1개국(베트남) 운영. 두비전은 그룹의 뇌교육 사업부로 동일 본사·SV·R&D 조직을 활용합니다.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-primary-foreground">
                        {c.tag}
                      </span>
                      <p className="text-[12px] font-bold">{c.t}</p>
                    </div>
                    <p className="mt-1.5 text-[10px] leading-[1.65] text-muted-foreground">
                      {c.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Track record numbers */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { num: "10,000+", l: "누적 수강생" },
                { num: "80%+", l: "재등록률" },
                { num: "27", l: "교재 개정 횟수" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-center"
                >
                  <p className="text-[15px] font-black text-primary">{s.num}</p>
                  <p className="text-[9px] font-semibold text-muted-foreground">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 10 — SUCCESS CASES (BEFORE / AFTER)              */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={10} title="SUCCESS CASES · 학생 변화 사례" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CHAPTER 08 · 실제 성과
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
            학부모가 <span className="text-primary">눈으로 확인</span>한
            <br />
            학생들의 변화입니다.
          </h2>

          {/* Before / After image strip */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="relative h-[55mm] overflow-hidden rounded-xl border border-border/60 bg-muted/30">
              <Image
                src="/images/dovision/image_04_01.png"
                alt="훈련 전 학생 학습 상태"
                fill
                sizes="80mm"
                className="object-contain p-2"
              />
              <div className="absolute left-2 top-2 rounded-md bg-foreground/85 px-2 py-0.5 text-[9px] font-bold text-background backdrop-blur">
                BEFORE
              </div>
            </div>
            <div className="relative h-[55mm] overflow-hidden rounded-xl border border-primary bg-primary/5">
              <Image
                src="/images/dovision/image_04_02.png"
                alt="훈련 후 학생 학습 상태"
                fill
                sizes="80mm"
                className="object-contain p-2"
              />
              <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                AFTER
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[9.5px] text-muted-foreground">
            ※ 두비전 훈련 전·후 학습 집중도 변화 시각 비교
          </p>

          {/* Student cases grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              {
                name: "김O준",
                grade: "초등 5학년",
                duration: "6개월",
                achievement: "기억량 200% 향상",
                quote:
                  "두비전에서 6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요. 영어 단어 시험이 가장 자신 있는 과목이 됐어요.",
              },
              {
                name: "이O서",
                grade: "중학교 2학년",
                duration: "1년",
                achievement: "IQ 100 → 125",
                quote:
                  "뉴로피드백 훈련 덕분에 집중력이 크게 향상되었습니다. 문제집을 풀어도 끝까지 가는 힘이 생겼어요.",
              },
              {
                name: "박O현",
                grade: "고등학교 1학년",
                duration: "2년",
                achievement: "서울대학교 합격",
                quote:
                  "이미지전환기억법으로 영어 단어와 한자 암기가 수월해졌고, 결과적으로 원하는 대학에 합격할 수 있었습니다.",
              },
              {
                name: "최O아",
                grade: "초등학교 3학년",
                duration: "8개월",
                achievement: "기억량 600% 향상",
                quote:
                  "처음에는 단어 10개도 어려웠는데 지금은 60개 이상 쉽게 외워요. 학교에서 발표도 자신감 있게 합니다.",
              },
            ].map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-border/60 bg-card p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-bold">
                      {c.name}{" "}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        · {c.grade}
                      </span>
                    </p>
                    <p className="text-[9.5px] text-muted-foreground">
                      훈련 기간 {c.duration}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9.5px] font-bold text-primary">
                    {c.achievement}
                  </span>
                </div>
                <div className="mt-2.5 border-l-2 border-primary/40 pl-2.5">
                  <Quote className="h-3 w-3 text-primary/40" />
                  <p className="mt-1 text-[10px] leading-[1.65] text-foreground/85">
                    {c.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom highlight */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-foreground p-4 text-background">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                AVERAGE OUTCOMES
              </p>
              <p className="mt-1 text-[12px] font-bold leading-[1.5]">
                기억량 +200~600% · 집중력 +30~50% · 재등록률 80%+
              </p>
            </div>
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 11 — INVESTMENT                                  */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={11} title="INVESTMENT · 가맹 투자·운영 구조" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CHAPTER 09 · 투자 구조
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.1] tracking-[-0.02em]">
            총 <span className="text-primary">1억원</span> · 30~35평 표준 모델
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">
            {/* Initial */}
            <div className="rounded-xl border border-border/60 bg-card p-3.5">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground">
                초기 투자비
              </p>
              <p className="mt-1 text-[20px] font-black text-primary">1억원</p>
              <table className="mt-2.5 w-full text-[10px]">
                <tbody>
                  {[
                    ["가맹비", "1,000만원"],
                    ["인테리어 (30~35평)", "2,500~3,000만원"],
                    ["강의시설·장비", "1,500만원"],
                    ["교육비 (3개월)", "1,500만원"],
                  ].map(([k, v]) => (
                    <tr
                      key={k}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-1.5 font-semibold">{k}</td>
                      <td className="py-1.5 text-right text-foreground/85">
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 rounded-md bg-muted/40 p-2 text-[9px] text-muted-foreground">
                ※ 임대보증금 2,500~3,000만원은 별도
              </p>
            </div>

            {/* Monthly */}
            <div className="rounded-xl border border-border/60 bg-card p-3.5">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground">
                월 운영비
              </p>
              <p className="mt-1 text-[20px] font-black text-primary">
                1,300~1,800만원
              </p>
              <table className="mt-2.5 w-full text-[10px]">
                <tbody>
                  {[
                    ["임대료·관리비", "250만원"],
                    ["인건비 (정 1+보조 2)", "850만원"],
                    ["로얄티", "매출 × 10%", true],
                    ["앱 교재비", "매출 × 12.5%", true],
                    ["세금·홍보비", "250~350만원"],
                    ["뇌검사·소모품·전기", "100만원"],
                  ].map(([k, v, hl]) => (
                    <tr
                      key={k as string}
                      className={`border-b border-border/60 last:border-0 ${
                        hl ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-1.5 font-semibold">{k}</td>
                      <td
                        className={`py-1.5 text-right ${
                          hl
                            ? "font-bold text-primary"
                            : "text-foreground/85"
                        }`}
                      >
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COGS 22.5% */}
          <div className="mt-4 rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                  TOTAL COGS · 본사 공급원가
                </p>
                <p className="mt-1 text-[14px] font-bold leading-[1.4]">
                  매출 연동 로열티 10% + 앱 교재비 12.5%
                </p>
                <p className="mt-1 text-[10px] leading-[1.7] text-muted-foreground">
                  음식점의 &ldquo;재료비&rdquo; 개념. 매출의{" "}
                  <strong>77.5%가 가맹점주</strong>에게 남는 구조로, 동종 교육
                  프랜차이즈 대비 가맹점주 마진이 강합니다.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[44px] font-black leading-none text-primary">
                  22.5<span className="text-[18px]">%</span>
                </p>
                <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                  매출액 대비
                </p>
              </div>
            </div>
          </div>

          {/* Revenue model */}
          <p className="mt-5 text-[10px] font-bold tracking-[0.2em] text-primary">
            OFFICIAL REVENUE MODEL
          </p>
          <table className="mt-2 w-full overflow-hidden rounded-lg border border-border/60 text-[10px]">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-2.5 py-2 text-left font-bold">월 신규등록</th>
                <th className="px-2.5 py-2 text-right font-bold">월 매출</th>
                <th className="px-2.5 py-2 text-right font-bold">월 순이익</th>
              </tr>
            </thead>
            <tbody>
              {[
                [5, 2400, 600],
                [6, 2880, 1080],
                [7, 3360, 1560],
                [8, 3840, 2040],
                [9, 4320, 2520],
                [10, 4800, 3000],
              ].map(([n, r, p], i) => (
                <tr
                  key={n}
                  className={`border-t border-border/60 ${
                    i % 2 === 1 ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="px-2.5 py-1.5 font-semibold">
                    {n}명{" "}
                    <span className="text-muted-foreground">× 480만</span>
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-semibold">
                    {r.toLocaleString()}만원
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-black text-primary">
                    +{p.toLocaleString()}만원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1.5 text-[9px] text-muted-foreground">
            ※ 월 지출 1,800만원(본사 공급원가 22.5% 포함) 기준 · BEP 월 신규등록
            3~4명
          </p>

          {/* Bottom badges */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MicroStat icon={Users} num="3-4명" label="BEP 신규등록(월)" />
            <MicroStat icon={Calculator} num="60일" label="계약→오픈" />
            <MicroStat icon={ShieldCheck} num="지역 독점" label="영업권 보호" />
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* PAGE 12 — SUPPORT + TIMELINE + CONTACT                */}
      {/* ==================================================== */}
      <Page>
        <PageHeader pageNo={12} title="SUPPORT & CONTACT · 다음 단계" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CHAPTER 10 · 본사 지원 + 다음 단계
          </p>

          {/* Support 2 columns */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SupportBlock
              tag="OPEN 전 지원"
              items={[
                "상권 분석 · 입지 선정 컨설팅",
                "인테리어 설계·시공 관리",
                "뉴로피드백 장비 세팅·검수",
                "실장+교사 3개월 집중 연수",
                "교재·앱·콘텐츠 일괄 제공",
                "오픈 마케팅 패키지 지원",
              ]}
            />
            <SupportBlock
              tag="OPEN 후 지원"
              items={[
                "슈퍼바이저 정기 방문 (월 1~2회)",
                "신규 프로그램·교재 지속 업데이트",
                "본사 차원 온라인 공동 마케팅",
                "분기별 가맹점주 워크숍",
                "운영·상담 매뉴얼 상시 제공",
                "성과 데이터 분석·컨설팅",
              ]}
            />
          </div>

          {/* Timeline */}
          <div className="mt-5">
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
              TIMELINE · 계약부터 오픈까지 60일
            </p>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {[
                ["D-60", "상담·계약"],
                ["D-50", "상권·입지"],
                ["D-30", "인테리어·장비"],
                ["D-14", "집중 연수"],
                ["D-0", "오픈"],
                ["D+30", "집중 SV"],
              ].map(([d, t]) => (
                <div
                  key={d}
                  className="rounded-md border border-primary/30 bg-primary/5 p-1.5 text-center"
                >
                  <p className="text-[10px] font-black text-primary">{d}</p>
                  <p className="mt-0.5 text-[8.5px] font-semibold">{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA hero */}
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-[oklch(0.32_0.18_290)] p-5 text-white">
            <Image
              src="/images/dovision/image_08.png"
              alt=""
              aria-hidden
              fill
              sizes="180mm"
              className="absolute inset-0 object-cover opacity-20 mix-blend-overlay"
            />
            <div className="relative">
              <p className="text-[10px] font-bold tracking-[0.25em] text-white/80">
                NEXT STEP
              </p>
              <p className="mt-2 text-[20px] font-black leading-[1.1]">
                지금 바로 <span className="text-primary-foreground">사업성 분석</span>을 받아보세요.
              </p>
              <p className="mt-2 text-[10.5px] leading-[1.7] text-white/85">
                가맹 전담 매니저가 지역 상권 분석 + 입지 검토 + 맞춤 사업성
                시뮬레이션을 무료로 제공합니다.
              </p>
            </div>
          </div>

          {/* Contact card */}
          <div className="mt-4 rounded-xl border-2 border-primary bg-primary/5 p-4">
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
              가맹 전담 매니저
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[10.5px]">
              <ContactRow
                icon={Phone}
                label="대표 전화"
                value="0507-1434-3226"
              />
              <ContactRow
                icon={Mail}
                label="이메일"
                value="franchise@dovision.kr"
              />
              <ContactRow
                icon={MapPin}
                label="본사 주소"
                value={"서울 강남구 역삼2동 775-2\n초원빌딩 3층"}
              />
              <ContactRow
                icon={Building2}
                label="운영 법인"
                value={"㈜키네스 그룹\n(설립 1999년)"}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 border-t border-border/60 pt-3 text-center text-[9px] leading-[1.6] text-muted-foreground">
            <p className="font-semibold text-foreground/80">
              본 자료는 두비전 가맹 검토용 비공개 자료입니다.
            </p>
            <p className="mt-0.5">
              ⓒ 2026 ㈜키네스 그룹 · DOVISION. All rights reserved. ·
              www.dovision.kr
            </p>
          </div>
        </div>
      </Page>

      {/* ==================================================== */}
      {/* 인쇄용 글로벌 스타일                                   */}
      {/* ==================================================== */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .brochure-root {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .brochure-actionbar,
          header,
          footer,
          [class*="FloatingCTA"],
          [class*="floating"] {
            display: none !important;
          }
          .brochure-page {
            page-break-after: always;
            break-after: page;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
          }
          .brochure-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="brochure-page mx-auto mb-6 overflow-hidden bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
      style={{ width: "210mm", height: "297mm" }}
    >
      {children}
    </div>
  );
}

function PageHeader({ pageNo, title }: { pageNo: number; title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-[18mm] py-3.5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black tracking-[0.2em] text-primary">
          DOVISION
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground">
          {title}
        </span>
      </div>
      <span className="text-[10px] font-bold text-muted-foreground">
        {String(pageNo).padStart(2, "0")} / {String(TOTAL_PAGES).padStart(2, "0")}
      </span>
    </div>
  );
}

function MicroStat({
  icon: Icon,
  num,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  num: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-[14px] font-black text-primary">{num}</p>
      <p className="text-[9px] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function SupportBlock({ tag, items }: { tag: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3.5">
      <span className="rounded-md bg-primary px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-primary-foreground">
        {tag}
      </span>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-1.5 text-[10px] leading-[1.55]"
          >
            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <p className="text-[9px] font-bold tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 whitespace-pre-line text-[11px] font-bold leading-[1.4]">
          {value}
        </p>
      </div>
    </div>
  );
}
