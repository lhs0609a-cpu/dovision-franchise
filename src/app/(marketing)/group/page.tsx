import { Metadata } from "next";
import Link from "next/link";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import {
  ArrowRight,
  Building2,
  Tv,
  Award,
  Globe,
  MapPin,
  Phone,
  Sparkles,
  Network,
  GraduationCap,
  HeartHandshake,
  Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "㈜키네스 그룹 · 27년 프랜차이즈 운영 노하우",
  description:
    "1999년 설립된 ㈜키네스는 아동 성장관리 브랜드 '키네스(전국 17개점·해외 1개점)'와 뇌교육 브랜드 '두비전'을 운영합니다. 27년 프랜차이즈 노하우를 두비전 가맹점에 그대로 이관합니다.",
};

// 그룹 현황 스탯
const groupStats = [
  { value: "27년", label: "프랜차이즈 운영" },
  { value: "20+", label: "그룹 전체 지점 수" },
  { value: "1개국", label: "해외 진출 (베트남)" },
  { value: "2개", label: "전문 브랜드" },
];

// 통합 연혁 타임라인
const timeline = [
  {
    year: "1999",
    brand: "KINESS",
    event: "㈜키네스 설립 · 아동 성장관리 프로그램 연구 시작",
    milestone: true,
  },
  {
    year: "2001",
    brand: "DOVISION",
    event: "뇌교육 프로그램 연구·개발 착수 (두비전 전신)",
    milestone: true,
  },
  {
    year: "2005",
    brand: "DOVISION",
    event: "이미지전환기억법 특허 등록",
  },
  {
    year: "2010",
    brand: "DOVISION",
    event: "뉴로피드백 트레이닝 프로그램 도입",
  },
  {
    year: "2015",
    brand: "KINESS",
    event: "해외 진출 — 베트남 하노이점 오픈",
    milestone: true,
  },
  {
    year: "2015",
    brand: "DOVISION",
    event: "BTS(Brain Training Skill) 시스템 완성",
  },
  {
    year: "2018",
    brand: "DOVISION",
    event: "두비전 강남 직영 센터 오픈",
  },
  {
    year: "2020",
    brand: "DOVISION",
    event: "두비전 반포·위례 직영 센터 추가 오픈",
  },
  {
    year: "2024",
    brand: "DOVISION",
    event: "두비전 가맹 사업 본격 확장 · 전국 모집 개시",
    milestone: true,
  },
];

// 키네스 지점 현황 (공개 정보 기반)
const kinessRegions = [
  {
    region: "서울권",
    count: 6,
    locations: ["강남", "잠실", "목동", "반포", "성북", "마포"],
  },
  {
    region: "경인권",
    count: 7,
    locations: ["분당", "일산", "부천", "수원", "평택", "용인수지", "송도"],
  },
  {
    region: "경상권",
    count: 3,
    locations: ["대구", "부산", "창원"],
  },
  {
    region: "해외",
    count: 1,
    locations: ["베트남 하노이"],
  },
];

// 두비전 직영 현황
const dovisionBranches = ["강남점 (본사)", "반포점", "위례점"];

// 그룹 인프라 (두비전 가맹점이 누리는 혜택)
const groupInfrastructure = [
  {
    icon: Network,
    title: "슈퍼바이저 운영 조직",
    desc: "키네스 17개 지점을 관리해온 슈퍼바이저 조직이 두비전 가맹점도 함께 지원합니다. 지점 운영 트러블슈팅 데이터가 20+개 지점 단위로 축적되어 있습니다.",
  },
  {
    icon: Building2,
    title: "본사 운영 매뉴얼",
    desc: "27년간 갱신되어 온 프랜차이즈 표준 매뉴얼(회원 관리·상담·마케팅·세무)을 두비전 가맹점주에게 동일하게 적용합니다.",
  },
  {
    icon: GraduationCap,
    title: "통합 연수 커리큘럼",
    desc: "키네스 가맹점주 대상 신규 오픈 연수 프로세스를 그대로 두비전에 이관. 실장·교사 3개월 집중 교육 체계가 이미 검증되어 있습니다.",
  },
  {
    icon: HeartHandshake,
    title: "아동 타겟 고객 접점",
    desc: "키네스(성장)와 두비전(뇌교육)은 타겟 고객층이 8세 이상 아동·학부모로 겹칩니다. 그룹 차원의 교차 레퍼런스·공동 상담 가능성을 활용할 수 있습니다.",
  },
];

// 미디어 노출 (공개 사실)
const mediaBadges = [
  { label: "KBS", desc: "아침 프로그램 방영" },
  { label: "MBC", desc: "아침 프로그램 방영" },
  { label: "SBS", desc: "아침 프로그램 방영" },
];

// 그룹 신뢰 포인트
const trustPoints = [
  {
    icon: Trophy,
    title: "목표 달성률 기반 운영",
    desc: "키네스 브랜드는 '목표키 성공률 92%'(키네스 공개 지표 기준)를 달성하며 결과 중심의 프랜차이즈 DNA를 입증했습니다.",
  },
  {
    icon: Award,
    title: "특허·연구 자산",
    desc: "특허 받은 전용 장비, 연구논문, 전문서적 출간 등 27년간 축적된 지적 자산이 본사 차원에서 통합 관리됩니다.",
  },
  {
    icon: Globe,
    title: "해외 확장 경험",
    desc: "베트남 하노이 지점 오픈·운영 경험을 통해 해외 진출 매뉴얼까지 보유. 두비전의 향후 글로벌 전략에도 활용됩니다.",
  },
];

export default function GroupPage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.45_0.18_290_/_0.12),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              <Sparkles className="h-4 w-4" />
              KINESS GROUP
            </div>
            <h1 className="mt-6 font-bold leading-[1.08] tracking-[-0.02em] break-keep text-[36px] sm:text-[56px] lg:text-[76px]">
              두비전은 신생 브랜드가
              <br />
              <span className="text-primary">아닙니다.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[16px] font-medium leading-[1.75] text-muted-foreground break-keep sm:text-[19px] lg:text-[21px]">
              27년간 전국 17개 지점·해외 1개 지점으로 확장해온
              <br className="hidden sm:inline" />
              <span className="font-bold text-foreground">
                ㈜키네스 그룹
              </span>
              의 검증된 프랜차이즈 운영 노하우를
              <br className="hidden sm:inline" />
              두비전 가맹점에 그대로 이관합니다.
            </p>
          </SectionFadeIn>

          {/* 그룹 스탯 */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4">
            {groupStats.map((s, i) => (
              <SectionFadeIn key={s.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-border/50 bg-white/60 p-6 backdrop-blur">
                  <div className="text-[32px] font-extrabold text-primary sm:text-[44px]">
                    {s.value}
                  </div>
                  <p className="mt-2 text-[12px] font-medium text-muted-foreground sm:text-[13px]">
                    {s.label}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 두 브랜드 소개 */}
      <section className="py-24">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                TWO BRANDS · ONE GROUP
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[56px]">
                ㈜키네스가 운영하는 두 브랜드
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                같은 대표(김양수) · 같은 본사 · 같은 프랜차이즈 시스템 ·
                다른 전문 영역
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
            {/* 키네스 */}
            <SectionFadeIn>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-shadow hover:shadow-xl sm:p-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.25em] text-primary/70">
                      SINCE 1999
                    </p>
                    <h3 className="mt-2 text-[32px] font-black sm:text-[40px]">
                      KINESS
                    </h3>
                    <p className="mt-1 text-[14px] text-muted-foreground sm:text-[15px]">
                      키네스 · 아동 성장관리
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                    17개점 + 해외 1
                  </span>
                </div>
                <p className="mt-6 text-[14px] leading-[1.75] text-muted-foreground sm:text-[15px]">
                  8~10세 이상 저신장·성장관리가 필요한 아동을 대상으로
                  성장정밀검사·영양·운동·수면·스트레스 통합 관리 프로그램을
                  운영합니다. KBS·MBC·SBS 아침 프로그램 방영, 특허 전용 장비,
                  연구논문·도서 출간 등 업계 전문성을 구축해왔습니다.
                </p>
                <div className="mt-6 grid gap-2 text-[12px] sm:text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      성장정밀검사 · 성장책임보증제
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      자세교정 · 성조숙 관리 · 소아비만
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      해외 진출 (베트남 하노이)
                    </span>
                  </div>
                </div>
                <a
                  href="https://www.kiness.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                >
                  kiness.co.kr 바로가기
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </SectionFadeIn>

            {/* 두비전 */}
            <SectionFadeIn delay={0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border-2 border-primary bg-primary/5 p-8 transition-shadow hover:shadow-xl sm:p-10">
                <div className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                  NOW EXPANDING
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.25em] text-primary/70">
                    SINCE 2001
                  </p>
                  <h3 className="mt-2 text-[32px] font-black text-primary sm:text-[40px]">
                    DOVISION
                  </h3>
                  <p className="mt-1 text-[14px] text-muted-foreground sm:text-[15px]">
                    두비전 · 창의융합 뇌교육
                  </p>
                </div>
                <p className="mt-6 text-[14px] leading-[1.75] text-muted-foreground sm:text-[15px]">
                  특허 이미지전환기억법·뉴로피드백 트레이닝·BTS 시스템을
                  결합한 창의융합 뇌교육 프로그램입니다. 2018년 강남 직영 1호점
                  이후 반포·위례로 확장했으며, 2024년부터 가맹 사업을
                  본격화하고 있습니다.
                </p>
                <div className="mt-6 grid gap-2 text-[12px] sm:text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      이미지전환기억법 (특허)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      뉴로피드백 트레이닝
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      BTS(Brain Training Skill) 시스템
                    </span>
                  </div>
                </div>
                <Link
                  href="/franchise"
                  className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                >
                  가맹 안내 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 통합 연혁 타임라인 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-24">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                GROUP TIMELINE
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[56px]">
                27년간 쉬지 않고
                <br className="sm:hidden" /> 확장해온 궤적
              </h2>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-16 max-w-4xl">
            {timeline.map((t, i) => (
              <SectionFadeIn key={`${t.year}-${t.event}`} delay={i * 0.05}>
                <div className="relative flex gap-6 border-l-2 border-primary/30 py-5 pl-8">
                  <div
                    className={`absolute -left-[9px] top-7 h-4 w-4 rounded-full ${
                      t.milestone ? "bg-primary shadow-lg shadow-primary/40" : "bg-primary/40"
                    }`}
                  />
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex shrink-0 items-center gap-3 sm:w-[180px]">
                      <span className="text-[22px] font-extrabold text-primary sm:text-[26px]">
                        {t.year}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                          t.brand === "KINESS"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        {t.brand}
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.7] text-foreground/80 sm:text-[16px]">
                      {t.event}
                    </p>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 그룹 지점 현황 */}
      <section className="py-24">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                NATIONWIDE NETWORK
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[56px]">
                그룹 전체 20+ 지점 운영
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                키네스 17개 지점 + 해외 1개 + 두비전 직영 3개 센터
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
            {/* 키네스 지점 */}
            <SectionFadeIn>
              <div className="h-full rounded-3xl border border-border/60 bg-card p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-orange-700">
                    KINESS · 성장관리
                  </span>
                  <span className="text-[13px] font-semibold text-muted-foreground">
                    17개점 + 해외 1
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {kinessRegions.map((r) => (
                    <div
                      key={r.region}
                      className="rounded-xl border border-border/50 bg-muted/20 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] font-bold">
                          {r.region}
                        </p>
                        <span className="text-[13px] font-bold text-primary">
                          {r.count}개점
                        </span>
                      </div>
                      <p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground sm:text-[13px]">
                        {r.locations.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionFadeIn>

            {/* 두비전 직영 */}
            <SectionFadeIn delay={0.1}>
              <div className="h-full rounded-3xl border-2 border-primary bg-primary/5 p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                    DOVISION · 뇌교육
                  </span>
                  <span className="text-[13px] font-semibold text-muted-foreground">
                    직영 3개 센터
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  {dovisionBranches.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-3 rounded-xl border border-primary/20 bg-white p-4"
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                      <p className="text-[14px] font-bold sm:text-[15px]">{b}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-primary/10 p-4">
                  <p className="text-[12px] leading-[1.7] text-foreground/80 sm:text-[13px]">
                    <span className="font-bold text-primary">
                      2024년 본격 가맹 확장 중
                    </span>{" "}
                    — 키네스 17개 지점 운영 노하우를 그대로 적용합니다.
                    지역 독점권이 보장되며, 입지 우선 선정이 가능합니다.
                  </p>
                </div>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 미디어 노출 */}
      <section className="bg-foreground py-24 text-background">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-[12px] font-bold text-primary sm:text-[13px]">
                <Tv className="h-4 w-4" />
                MEDIA
              </div>
              <h2 className="mt-5 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[54px]">
                주요 공중파 3사 방영
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-background/70 sm:text-[17px]">
                키네스 브랜드는 KBS·MBC·SBS 아침 프로그램에 방영되며 아동
                전문기업으로서의 전문성을 공신력 있게 검증받았습니다. 이 미디어
                자산은 두비전 가맹점주의 지역 마케팅에도 활용 가능한 그룹 신뢰
                자산입니다.
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            {mediaBadges.map((m, i) => (
              <SectionFadeIn key={m.label} delay={i * 0.1}>
                <div className="rounded-2xl border border-background/20 bg-background/5 p-8 text-center backdrop-blur">
                  <p className="text-[28px] font-black text-primary sm:text-[34px]">
                    {m.label}
                  </p>
                  <p className="mt-2 text-[12px] text-background/70 sm:text-[13px]">
                    {m.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {trustPoints.map((p, i) => (
              <SectionFadeIn key={p.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold sm:text-[16px]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.7] text-background/70 sm:text-[13px]">
                    {p.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 그룹 인프라 = 가맹점 혜택 */}
      <section className="py-24">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                WHAT YOU GET
              </p>
              <h2 className="mt-3 font-bold leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[56px]">
                두비전 가맹점이 누리는
                <br />
                <span className="text-primary">그룹 인프라</span>
              </h2>
              <p className="mx-auto mt-5 text-[15px] font-medium leading-[1.75] text-muted-foreground sm:text-[17px]">
                신규 브랜드 가맹점은 처음부터 시스템을 만들어야 합니다.
                두비전 가맹점은 키네스 27년간 다듬어진 프랜차이즈 인프라를
                첫날부터 사용합니다.
              </p>
            </div>
          </SectionFadeIn>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
            {groupInfrastructure.map((item, i) => (
              <SectionFadeIn key={item.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card p-7 transition-all hover:border-primary/40 hover:shadow-lg sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.75] text-muted-foreground sm:text-[14px]">
                    {item.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 교차 시너지 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-24">
        <div className="container-responsive">
          <div className="mx-auto max-w-5xl">
            <SectionFadeIn>
              <div className="text-center">
                <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                  CROSS-BRAND SYNERGY
                </p>
                <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[46px] lg:text-[54px]">
                  두 브랜드의 시너지
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                  타겟 고객 · 상권 · 운영 인프라가 겹치는 두 브랜드의 시너지는
                  가맹점 수익성에 직접 기여합니다.
                </p>
              </div>
            </SectionFadeIn>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {[
                {
                  title: "타겟 고객 겹침",
                  desc: "키네스(8세+ 성장 관리)와 두비전(8세+ 뇌교육)은 학부모·자녀 고객층이 대부분 일치합니다. 같은 상권에서 교차 홍보·추천이 자연스럽게 발생합니다.",
                },
                {
                  title: "지역 입지 우선권",
                  desc: "키네스 지점이 이미 자리 잡은 지역 인근에 두비전 가맹점을 우선 추천받을 수 있습니다. 본사가 실제 운영 데이터로 상권 가치를 검증합니다.",
                },
                {
                  title: "공동 마케팅",
                  desc: "그룹 차원의 미디어·SNS·검색광고 예산이 집행됩니다. 두비전 가맹점은 단독 마케팅비를 대폭 절감하고, 키네스 학부모 DB도 간접적으로 접근 가능합니다.",
                },
              ].map((item, i) => (
                <SectionFadeIn key={item.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-border/60 bg-card p-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-[15px] font-black text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[17px] font-bold sm:text-[18px]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-[1.75] text-muted-foreground sm:text-[14px]">
                      {item.desc}
                    </p>
                  </div>
                </SectionFadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container-responsive text-center">
          <h2 className="font-black leading-[1.08] tracking-[-0.02em] text-[32px] sm:text-[48px] lg:text-[60px]">
            27년의 프랜차이즈 노하우가
            <br />
            당신의 첫날부터 함께합니다
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-[1.8] text-white/85 sm:text-[16px]">
            ㈜키네스 그룹은 두비전 가맹 사업에 그룹 전체 인프라를 동원합니다.
            가맹 전담 매니저와 직접 상담하고, 그룹 레거시가 어떻게 수익에
            기여하는지 구체적인 데이터로 확인해 보세요.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-foreground transition-transform hover:translate-y-[-2px]"
            >
              가맹 상담 신청하기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:010-9717-3373"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-8 py-4 text-[15px] font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              <Phone className="h-4 w-4" />
              이윤진 매니저 · 010-9717-3373
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
