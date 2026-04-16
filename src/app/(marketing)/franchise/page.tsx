import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import FranchiseBenefits from "@/components/marketing/FranchiseBenefits";
import InvestmentTable from "@/components/marketing/InvestmentTable";
import FranchiseProcess from "@/components/marketing/FranchiseProcess";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import {
  ArrowRight,
  CheckCircle,
  User,
  Target,
  Users,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  Calculator,
  Dna,
  Network,
  Megaphone,
  Award,
  Tv,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "가맹 안내",
  description:
    "두비전 가맹점 창업 안내. 총 1억원 투자 구조, 본사 지원 체계, 오픈 프로세스, 타겟 가맹점주 프로필 등 상세 정보.",
};

const supports = {
  before: [
    "상권 분석 및 입지 선정 컨설팅",
    "인테리어 설계 및 시공 관리",
    "뉴로피드백 장비 세팅 및 검수",
    "실장 1명 · 교사 2명 3개월 집중 연수 (교육비 1,500만원 포함)",
    "교재·학습 콘텐츠 및 앱 제공",
    "오픈 마케팅 패키지 지원",
  ],
  after: [
    "슈퍼바이저 정기 방문 (월 1~2회)",
    "신규 프로그램·교재 지속 업데이트",
    "본사 차원 온라인 마케팅 공동 진행",
    "분기별 가맹점주 워크숍·정기 연수",
    "운영 매뉴얼·학부모 상담 가이드 제공",
    "성과 데이터 분석 및 컨설팅",
  ],
};

const idealProfiles = [
  {
    icon: Briefcase,
    title: "교육업 경험자",
    desc: "학원·과외·교습소 운영 경험이 있는 예비 창업자",
  },
  {
    icon: Users,
    title: "교육열 높은 학부모",
    desc: "자녀 교육에 관심이 많고 직접 운영에 참여할 의지가 있는 분",
  },
  {
    icon: Target,
    title: "소자본 교육 창업 희망자",
    desc: "검증된 교육 프로그램으로 안정적 창업을 원하는 분",
  },
  {
    icon: User,
    title: "기존 학원·교습소 운영자",
    desc: "차별화 프로그램을 도입해 경쟁력을 확보하고자 하는 분",
  },
];

const keyPoints = [
  {
    icon: ShieldCheck,
    title: "특허 기반 독점권",
    desc: "특허 이미지전환기억법으로 경쟁사 동일 프로그램 진입 차단. 지역 독점 영업권.",
  },
  {
    icon: Calendar,
    title: "25년 운영 노하우",
    desc: "2001년부터 축적된 연구개발 + 직영 3개 센터의 실운영 데이터 이관.",
  },
  {
    icon: Calculator,
    title: "검증된 수익 모델",
    desc: "6개월 선불 480만원 등록 기반. 월 신규등록 5명 시 월 순이익 600만원, 7명 시 1,560만원 구간.",
  },
];

const scheduleTable = [
  { step: "D-60", title: "상담·계약", detail: "가맹 상담 → 사업성 검토 → 계약 체결" },
  { step: "D-50", title: "상권 분석·입지 선정", detail: "본사 상권 컨설팅 + 임대차 계약" },
  { step: "D-30", title: "인테리어·장비 셋업", detail: "시공 관리 + 뉴로피드백 장비 설치" },
  { step: "D-14", title: "집중 교육 연수", detail: "가맹점주·강사 2주 집중 연수" },
  { step: "D-0", title: "오픈", detail: "그랜드 오픈 + 오픈 마케팅 지원" },
  { step: "D+30", title: "집중 SV 방문", detail: "오픈 첫 달 주 1회 슈퍼바이저 방문" },
];

export default function FranchisePage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              FRANCHISE
            </span>
            <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[68px]">
              검증된 뇌교육 프랜차이즈,
              <br />
              <span className="text-primary">두비전</span>과 함께
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
              25년 노하우와 특허 기술을 그대로 이전받아
              <br className="hidden sm:inline" />
              안정적인 교육 사업을 시작할 수 있습니다.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-[15px] font-bold"
                >
                  가맹 상담 신청
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:010-9717-3373">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border px-8 py-6 text-[15px] font-bold"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  010-9717-3373
                </Button>
              </a>
            </div>

            {/* 신뢰 뱃지 바 */}
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-muted-foreground sm:text-[12px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                특허 제10-1994856호
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 backdrop-blur">
                <Award className="h-3.5 w-3.5 text-primary" />
                소상공인진흥공단 우수 프랜차이즈 (2018)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 backdrop-blur">
                <Tv className="h-3.5 w-3.5 text-primary" />
                KBS·MBC·SBS 방영
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 backdrop-blur">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                ㈜키네스 그룹 · 27년
              </span>
            </div>
          </SectionFadeIn>

          {/* 3개 핵심 포인트 */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
            {keyPoints.map((p, i) => (
              <SectionFadeIn key={p.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-border/60 bg-card p-6 text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold sm:text-[17px]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted-foreground sm:text-[14px]">
                    {p.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 타겟 가맹점주 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                WHO FITS
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                어떤 분이 두비전과 잘 맞을까요?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                교육 경험 유무보다 학생의 변화를 진심으로 응원하는 마음이
                가장 중요합니다.
              </p>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {idealProfiles.map((p, i) => (
              <SectionFadeIn key={p.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[16px] font-bold sm:text-[17px]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted-foreground sm:text-[14px]">
                    {p.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 키네스 그룹 DNA·시너지 */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.45_0.18_290_/_0.35),transparent_60%)]" />
        <div className="container-responsive relative z-10">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                KINESS GROUP SYNERGY
              </p>
              <h2 className="mt-3 font-medium leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
                두비전은 <span className="font-black text-primary">27년 프랜차이즈</span>의
                <br />
                DNA를 그대로 이식받습니다.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.7] text-background/70 sm:text-[17px]">
                신생 브랜드 가맹이 아닙니다. 1999년 설립된 ㈜키네스 그룹이 전국 17개
                지점·해외 1개국을 운영하며 축적한 실전 매뉴얼이, 두비전 가맹점주의
                첫 날부터 그대로 작동합니다.
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-3">
            <SectionFadeIn delay={0.05}>
              <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-7 backdrop-blur transition-colors hover:border-primary/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Dna className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                  검증된 운영 매뉴얼
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  키네스 17개 지점이 27년 동안 다듬어 온 상담·회원 관리·환불·
                  클레임 대응 매뉴얼이 그대로 두비전에 이식됩니다. 가맹점주는
                  &ldquo;처음부터 몰라서 생기는 실수&rdquo;를 피합니다.
                </p>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.15}>
              <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-7 backdrop-blur transition-colors hover:border-primary/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                  동일 타겟 고객 풀
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  키네스(성장관리)와 두비전(뇌교육)은 &ldquo;8세 이상 자녀의 잠재력을
                  과학으로 끌어올리려는 학부모&rdquo;라는 동일 고객을 공유합니다.
                  같은 상권에서 크로스-레퍼럴이 발생합니다.
                </p>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.25}>
              <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-7 backdrop-blur transition-colors hover:border-primary/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Network className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                  본사 슈퍼바이저 조직
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  ㈜키네스 본사에 이미 구축된 슈퍼바이저·교육·R&amp;D 조직을 그대로
                  활용합니다. 별도의 본사 조직 셋업 비용 없이, 가맹 첫 달부터
                  풀 지원이 가동됩니다.
                </p>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.3}>
              <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-7 backdrop-blur transition-colors hover:border-primary/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Megaphone className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                  공동 마케팅 자산
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  KBS·MBC·SBS 등 지상파 다수 출연 이력과 연구 논문·도서 실적이
                  두비전 브랜드 신뢰도로 이어집니다. 신규 오픈 시점에 학부모
                  신뢰를 빠르게 확보할 수 있습니다.
                </p>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.35}>
              <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-7 backdrop-blur transition-colors hover:border-primary/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                  상권 데이터 · 입지 우선권
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  서울·경인·경상권 주요 상권에서 키네스가 쌓아 온 상권 데이터를
                  바탕으로 두비전 입지를 컨설팅합니다. 키네스 기존 지점 인근은
                  시너지 확보가 가능한 우선 검토 지역입니다.
                </p>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.4}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-primary/40 bg-primary/15 p-7 backdrop-blur">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold sm:text-[19px]">
                    그룹 전체 이야기
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-background/80 sm:text-[15px]">
                    키네스 그룹의 27년 타임라인·미디어 노출·전국 네트워크를 한눈에
                    확인하세요.
                  </p>
                </div>
                <Link
                  href="/group"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-bold text-primary-foreground transition-colors hover:bg-[oklch(0.38_0.18_290)] sm:text-[14px]"
                >
                  그룹 페이지 바로가기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 가맹 장점 (기존 컴포넌트) */}
      <FranchiseBenefits />

      {/* 투자비 상세 (기존 컴포넌트) */}
      <InvestmentTable />

      {/* 로열티 구조 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                ROYALTY
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                로열티 구조
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                매출 연동형 로열티로, 오픈 초기에는 부담을 낮추고 매출 성장과
                함께 본사도 책임을 나눕니다.
              </p>
            </div>
          </SectionFadeIn>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border/60 bg-card p-8 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-[12px] font-semibold text-muted-foreground">
                  매출 연동 로열티
                </p>
                <p className="mt-2 text-[40px] font-extrabold text-primary sm:text-[48px]">
                  10<span className="text-[20px]">%</span>
                </p>
                <p className="mt-2 text-[12px] text-muted-foreground sm:text-[13px]">
                  월 매출액 × 10%
                </p>
              </div>
              <div className="text-center sm:border-l sm:border-border/60 sm:pl-8">
                <p className="text-[12px] font-semibold text-muted-foreground">
                  기본 로열티 (최소)
                </p>
                <p className="mt-2 text-[40px] font-extrabold text-primary sm:text-[48px]">
                  250<span className="text-[20px]">만원/월</span>
                </p>
                <p className="mt-2 text-[12px] text-muted-foreground sm:text-[13px]">
                  매출 저조 시 하한선
                </p>
              </div>
            </div>
            <p className="mt-8 border-t border-border/60 pt-6 text-center text-[12px] leading-[1.7] text-muted-foreground sm:text-[13px]">
              * 기본계획서 기준 · 신규 프로그램·교재 업데이트, 슈퍼바이저 방문
              컨설팅은 로열티에 포함됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 본사 지원 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                HQ SUPPORT
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                본사가 이만큼 챙깁니다
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <SectionFadeIn delay={0.1}>
              <div className="h-full rounded-2xl border border-border/60 bg-card p-8">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                    OPEN 전
                  </span>
                  <h3 className="text-[20px] font-bold">오픈 전 지원</h3>
                </div>
                <ul className="mt-6 space-y-3">
                  {supports.before.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[14px] leading-[1.6] sm:text-[15px]"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
            <SectionFadeIn delay={0.2}>
              <div className="h-full rounded-2xl border border-border/60 bg-card p-8">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                    OPEN 후
                  </span>
                  <h3 className="text-[20px] font-bold">오픈 후 지원</h3>
                </div>
                <ul className="mt-6 space-y-3">
                  {supports.after.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[14px] leading-[1.6] sm:text-[15px]"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 비교 테이블 */}
      <ComparisonTable />

      {/* 오픈 일정표 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                TIMELINE
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                계약부터 오픈까지 60일
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mx-auto mt-12 max-w-3xl">
            {scheduleTable.map((s, i) => (
              <SectionFadeIn key={s.step} delay={i * 0.06}>
                <div className="relative flex gap-5 border-l-2 border-primary/30 py-5 pl-8">
                  <div className="absolute -left-[7px] top-7 h-3 w-3 rounded-full bg-primary" />
                  <div className="min-w-[60px]">
                    <span className="text-[18px] font-extrabold text-primary">
                      {s.step}
                    </span>
                  </div>
                  <div>
                    <p className="text-[16px] font-bold sm:text-[17px]">{s.title}</p>
                    <p className="mt-1 text-[13px] leading-[1.6] text-muted-foreground sm:text-[14px]">
                      {s.detail}
                    </p>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      <FranchiseProcess />

      {/* FAQ 미니 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                QUICK FAQ
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                가맹 문의 전 자주 묻는 질문
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              {
                q: "㈜키네스 그룹이 두비전을 운영한다는 건 어떤 의미인가요?",
                a: "㈜키네스는 1999년부터 27년간 아동·청소년 교육 분야에서 전국 17개 지점과 해외 1개국(베트남 하노이)을 운영해 온 프랜차이즈 기업입니다. 성장관리 브랜드 '키네스'와 뇌교육 브랜드 '두비전'을 동일 본사가 운영하므로, 가맹점주는 키네스 그룹이 검증한 운영 매뉴얼·슈퍼바이저 조직·R&D 역량을 첫 날부터 그대로 사용할 수 있습니다. 자세한 내용은 /group 페이지에서 확인하세요.",
              },
              {
                q: "교육업 경험이 없어도 운영이 가능한가요?",
                a: "네. 본사가 실장·교사 3개월 집중 교육 연수를 통해 프로그램 이해부터 상담·회원 관리까지 전 과정을 교육합니다(교육비 1,500만원 포함). 오픈 후에도 슈퍼바이저가 정기 방문해 운영 전반을 지원합니다.",
              },
              {
                q: "초기 투자비는 어느 수준인가요?",
                a: "30~35평 기준 총 1억원입니다. 가입비 1,000만원 · 인테리어 2,500~3,000만원 · 강의시설/장비 1,500만원 · 교육비(3개월) 1,500만원. 임대보증금 2,500~3,000만원은 별도이며, 월 운영비는 1,300~1,800만원입니다.",
              },
              {
                q: "손익분기점은 언제쯤 도달하나요?",
                a: "월 신규등록 3~4명이 BEP 지점입니다(월 지출 1,800만원 기준). 5명 확보 시 월 순이익 600만원, 7명 시 1,560만원, 10명 시 3,000만원 구간입니다.",
              },
              {
                q: "등록 방식은 어떻게 되나요?",
                a: "주 2회 수업(중 교육 + 코칭/상담 + 필요시 뉴로피드백) 기준 월 80만원이며, 6개월 선불 480만원으로 등록합니다. 뇌기능 검사 및 상담은 매 3개월 재검사 시 10만원이 별도 부과됩니다.",
              },
              {
                q: "지역 독점권이 보장되나요?",
                a: "네. 특허 기술 기반으로 동일 프로그램의 타 브랜드 진입이 제한되며, 가맹 계약 시 영업 지역을 별도 보호합니다.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-border/60 bg-card p-6"
              >
                <h3 className="text-[15px] font-bold sm:text-[16px]">
                  Q. {item.q}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-muted-foreground sm:text-[15px]">
                  A. {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-responsive text-center">
          <h2 className="font-black leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[48px] lg:text-[60px]">
            지금 바로 상담 신청하세요
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.7] text-white/80 sm:text-[16px]">
            가맹 전담 매니저가 사업성 검토부터 오픈까지 1:1로 안내합니다.
            부담 없이 문의 주세요.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 py-6 text-[15px] font-bold"
              >
                상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:010-9717-3373">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/5 px-8 py-6 text-[15px] font-bold text-white hover:bg-white/15"
              >
                <Phone className="mr-2 h-4 w-4" />
                이윤진 매니저 · 010-9717-3373
              </Button>
            </a>
          </div>
          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-[12px] font-semibold text-white/80 backdrop-blur sm:text-[13px]">
            <MapPin className="h-4 w-4" />
            본사: 서울 강남구 역삼2동 775-2 초원빌딩 3층
          </div>
        </div>
      </section>
    </div>
  );
}
