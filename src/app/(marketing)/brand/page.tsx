import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import {
  Award,
  Users,
  Target,
  Heart,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Building2,
  ArrowRight,
  Tv,
  Globe2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "브랜드 소개",
  description:
    "두비전(DOVISION) 창의융합 뇌교육 프로그램 브랜드 소개. 25년 노하우, 특허 보유 이미지전환기억법, 뉴로피드백 트레이닝, ㈜키네스 운영.",
};

const values = [
  {
    icon: Target,
    title: "미션",
    desc: "모든 아이의 두뇌 잠재력을 과학적으로 개발하여 창의융합 인재로 성장시킵니다.",
  },
  {
    icon: Heart,
    title: "비전",
    desc: "대한민국 No.1 뇌교육 전문 프랜차이즈로서 교육의 패러다임을 혁신합니다.",
  },
  {
    icon: Users,
    title: "핵심 가치",
    desc: "과학적 교육 · 검증된 성과 · 학생 중심 · 지속적 혁신",
  },
  {
    icon: Award,
    title: "차별화",
    desc: "특허 이미지전환기억법 + 뉴로피드백 + BTS 시스템의 삼위일체 교육.",
  },
];

const history = [
  { year: "2001", event: "두비전 뇌교육 프로그램 연구·개발 시작" },
  { year: "2010", event: "뉴로피드백 트레이닝 프로그램 도입" },
  { year: "2014", event: "창의융합 뇌교육 센터 시범 운영 착수" },
  { year: "2015", event: "BTS(Brain Training Skill) 시스템 완성, 통신판매업 신고 (2015-서울강남-03819)" },
  { year: "2018", event: "강남 직영 1호점 오픈 · 소상공인진흥공단 우수 프랜차이즈 선정" },
  { year: "2019", event: "이미지전환기억법 특허 제10-1994856호 승인 · 『창의융합 뇌교육 두비전』 교재 발행" },
  { year: "2020", event: "반포·위례 직영 센터 추가 오픈" },
  { year: "2024", event: "가맹 사업 본격 확장 및 전국 모집 개시" },
];

const branches = [
  {
    name: "강남점",
    address: "서울 강남구 논현로72길 16, 초원빌딩 3층",
    role: "본사 직영 1호점",
  },
  {
    name: "반포점",
    address: "서울 서초구 잠원로3길 40, 타남홀딩스 4층 (잠원동)",
    role: "직영점",
  },
  {
    name: "위례점",
    address: "경기 성남시 수정구 창곡동 566, 밀리토피아시티A B1 #3",
    role: "직영점",
  },
];

const stats = [
  { value: "25년+", label: "뇌교육 연구 경력" },
  { value: "600%", label: "평균 기억량 향상" },
  { value: "3개", label: "직영 센터 운영" },
  { value: "특허", label: "이미지전환기억법" },
];

export default function BrandPage() {
  return (
    <div className="pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <SectionFadeIn>
            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
              ABOUT DOVISION
            </span>
            <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[68px]">
              25년의 뇌교육,
              <br />
              <span className="text-primary">두비전</span>입니다.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
              2001년부터 축적된 뇌교육 연구와 교육 현장 경험을 바탕으로
              <br className="hidden sm:inline" />
              과학적으로 검증된 창의융합 뇌교육 프로그램을 운영합니다.
            </p>
          </SectionFadeIn>

          {/* Stat row */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[28px] font-extrabold text-primary sm:text-[36px]">
                  {s.value}
                </div>
                <p className="mt-1 text-[12px] font-medium text-muted-foreground sm:text-[13px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 법인 소개 — 2단 비대칭 */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <SectionFadeIn>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-border/50 shadow-xl">
                <Image
                  src="/images/dovision/image_02.png"
                  alt="두비전 도미닉 오브라이언 스토리"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-contain bg-[oklch(0.97_0.005_290)]"
                />
              </div>
            </SectionFadeIn>
            <SectionFadeIn delay={0.1}>
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                COMPANY
              </p>
              <h2 className="mt-3 font-medium leading-[1.1] tracking-[-0.02em] text-[34px] sm:text-[46px] lg:text-[56px]">
                <span className="font-black">㈜키네스</span>가
                <br />
                두비전을 운영합니다.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.8] text-muted-foreground sm:text-[16px]">
                ㈜키네스는 2001년부터 뇌교육 콘텐츠 연구개발을 시작해 25년간
                기억법·집중력·뉴로피드백 분야에서 독자 기술을 축적해온 교육
                기업입니다. 대표 김양수가 이끄는 전문 R&D·교육 조직이
                두비전(DOVISION) 브랜드를 전국으로 확산하고 있으며, 서울 강남·반포와
                경기 위례에 직영 센터 3곳을 직접 운영하며 교육 품질을 검증하고
                있습니다.
              </p>
              <div className="mt-8 grid gap-3 text-[14px] sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground">법인명</p>
                  <p className="mt-1 font-bold">㈜키네스</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground">대표이사</p>
                  <p className="mt-1 font-bold">김양수</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground">사업자등록번호</p>
                  <p className="mt-1 font-bold">220-86-00194</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground">통신판매업</p>
                  <p className="mt-1 font-bold">2015-서울강남-03819</p>
                </div>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 키네스 그룹 — 모기업 네트워크 */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.45_0.18_290_/_0.35),transparent_60%)]" />
        <div className="container-responsive relative z-10">
          <div className="grid items-start gap-12 lg:grid-cols-[3fr_4fr] lg:gap-16">
            <SectionFadeIn>
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                GROUP NETWORK
              </p>
              <h2 className="mt-3 font-medium leading-[1.1] tracking-[-0.02em] text-[34px] sm:text-[46px] lg:text-[56px]">
                <span className="font-black text-primary">27년</span> 프랜차이즈
                <br />
                <span className="font-black">노하우 위에서</span>
                <br />
                두비전은 출발합니다.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.8] text-background/70 sm:text-[16px]">
                ㈜키네스는 1999년 설립 이래 아동·청소년 교육 분야에서 전국 17개
                지점과 해외 1개국(베트남 하노이)으로 확장한 프랜차이즈 그룹입니다.
                성장관리 브랜드 <span className="font-bold text-background">키네스</span>와
                뇌교육 브랜드 <span className="font-bold text-primary">두비전</span>을
                함께 운영하며, 두 브랜드의 R&amp;D·운영·교육 노하우가 그대로
                두비전 가맹점주에게 이식됩니다.
              </p>

              <div className="mt-10">
                <Link
                  href="/group"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14px] font-bold text-primary-foreground transition-colors hover:bg-[oklch(0.38_0.18_290)] sm:text-[15px]"
                >
                  ㈜키네스 그룹 스토리 보기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </SectionFadeIn>

            <SectionFadeIn delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-primary">
                    <Building2 className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-[0.15em]">
                      FOUNDED
                    </span>
                  </div>
                  <p className="mt-3 text-[32px] font-extrabold sm:text-[40px]">
                    1999
                  </p>
                  <p className="mt-1 text-[13px] text-background/60">
                    ㈜키네스 설립
                  </p>
                </div>
                <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-[0.15em]">
                      BRANCHES
                    </span>
                  </div>
                  <p className="mt-3 text-[32px] font-extrabold sm:text-[40px]">
                    20<span className="text-primary">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-background/60">
                    그룹 전체 지점 (키네스 17 + 두비전 3)
                  </p>
                </div>
                <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-primary">
                    <Globe2 className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-[0.15em]">
                      GLOBAL
                    </span>
                  </div>
                  <p className="mt-3 text-[32px] font-extrabold sm:text-[40px]">
                    1
                    <span className="ml-1 text-[18px] text-background/60 sm:text-[22px]">
                      개국
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] text-background/60">
                    해외 진출 · 베트남 하노이
                  </p>
                </div>
                <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-primary">
                    <Tv className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-[0.15em]">
                      ON AIR
                    </span>
                  </div>
                  <p className="mt-3 text-[18px] font-extrabold leading-tight sm:text-[22px]">
                    KBS · MBC · SBS
                  </p>
                  <p className="mt-1 text-[13px] text-background/60">
                    지상파 방송 다수 출연
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-5 backdrop-blur">
                <p className="text-[13px] leading-[1.7] text-background/80 sm:text-[14px]">
                  <span className="font-bold text-primary">두 브랜드, 하나의 그룹.</span>{" "}
                  키네스(성장관리)와 두비전(뇌교육)은 &ldquo;아이의 잠재력을
                  과학으로 끌어올린다&rdquo;는 동일한 철학 아래 운영되며, 본사
                  슈퍼바이저·운영 매뉴얼·연수 시스템을 공유합니다.
                </p>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 미션/비전/가치 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                MISSION & VISION
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                두비전이 추구하는 가치
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
              <SectionFadeIn key={item.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-border/50 bg-card p-7 transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[17px] font-bold sm:text-[18px]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted-foreground sm:text-[14px]">
                    {item.desc}
                  </p>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                HISTORY
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                25년 뇌교육 발자취
              </h2>
            </div>
          </SectionFadeIn>
          <div className="mx-auto mt-14 max-w-3xl">
            {history.map((item, i) => (
              <SectionFadeIn key={item.year} delay={i * 0.06}>
                <div className="relative flex gap-6 border-l-2 border-primary/30 py-5 pl-8">
                  <div className="absolute -left-[7px] top-7 h-3 w-3 rounded-full bg-primary" />
                  <span className="shrink-0 text-[20px] font-extrabold text-primary">
                    {item.year}
                  </span>
                  <span className="text-[15px] leading-[1.6] text-muted-foreground sm:text-[16px]">
                    {item.event}
                  </span>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 특허 신뢰성 */}
      <section className="bg-[oklch(0.97_0.005_290)] py-20">
        <div className="container-responsive">
          <div className="grid items-center gap-12 lg:grid-cols-[3fr_4fr] lg:gap-16">
            <SectionFadeIn>
              <div className="relative mx-auto aspect-[5/6] w-full max-w-[420px] overflow-hidden rounded-[18px] border border-border/50 bg-background shadow-xl">
                <Image
                  src="/images/dovision/image_03.png"
                  alt="두비전 이미지전환기억법 특허증"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain"
                />
              </div>
            </SectionFadeIn>
            <SectionFadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[12px] font-bold text-primary sm:text-[13px]">
                <ShieldCheck className="h-4 w-4" />
                대한민국 특허청 등록 완료
              </div>
              <h2 className="mt-5 font-medium leading-[1.1] tracking-[-0.02em] text-[34px] sm:text-[46px] lg:text-[56px]">
                <span className="font-black text-primary">독자 기술</span>로
                <br />
                <span className="font-black">차별화된 교육권.</span>
              </h2>
              <p className="mt-6 text-[15px] leading-[1.8] text-muted-foreground sm:text-[16px]">
                두비전의 이미지전환기억법은 대한민국 특허청에 정식 등록된 독자
                기술입니다. 동일 방식의 경쟁 프로그램이 상업적으로 진입할 수
                없어, 가맹점주는 지역 독점권과 함께 안정적인 영업권을 확보할 수
                있습니다.
              </p>

              {/* 특허 상세 카드 */}
              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                    DOVISION
                  </span>
                  <span className="text-[11px] font-bold tracking-wider text-primary">
                    KOREA PATENT
                  </span>
                </div>
                <p className="mt-3 text-[14px] font-extrabold tracking-tight sm:text-[16px]">
                  특허 제10-1994856호
                </p>
                <p className="mt-1 text-[13px] font-semibold text-foreground/85 sm:text-[14px]">
                  사물 관찰을 통한 시각화 및 학습능력 향상 기술
                </p>
                <p className="mt-3 text-[12px] leading-[1.65] text-muted-foreground sm:text-[13px]">
                  2019년 특허청 승인 · 그룹 본사(㈜키네스) 명의 보유 · 두비전
                  가맹점에 지역 독점 라이선스 부여
                </p>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* 직영 센터 안내 */}
      <section className="py-20">
        <div className="container-responsive">
          <SectionFadeIn>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                DIRECT CENTERS
              </p>
              <h2 className="mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[52px]">
                전국 3곳 직영 센터
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
                본사가 직접 운영하며 교육 품질을 검증한 직영 센터입니다.
              </p>
            </div>
          </SectionFadeIn>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {branches.map((b, i) => (
              <SectionFadeIn key={b.name} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card p-7 transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-bold">{b.name}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                      {b.role}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start gap-2 text-[13px] leading-[1.6] text-muted-foreground sm:text-[14px]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b.address}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[13px] sm:text-[14px]">
                    <Phone className="h-4 w-4 text-primary" />
                    <a
                      href="tel:031-758-2758"
                      className="font-semibold transition-colors hover:text-primary"
                    >
                      031-758-2758
                    </a>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 본사 정보 + CTA */}
      <section className="bg-foreground py-20 text-background">
        <div className="container-responsive">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <SectionFadeIn>
              <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
                HEADQUARTERS
              </p>
              <h2 className="mt-3 font-bold leading-[1.1] tracking-[-0.02em] text-[32px] sm:text-[42px] lg:text-[52px]">
                ㈜키네스 본사
              </h2>
              <ul className="mt-8 space-y-4 text-[14px] text-background/80 sm:text-[15px]">
                <li className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-background/50">주소</p>
                    <p className="mt-1">서울 강남구 역삼2동 775-2 초원빌딩 3층</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-background/50">전화</p>
                    <p className="mt-1">031-758-2758</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-background/50">이메일</p>
                    <p className="mt-1">kinessking@naver.com</p>
                  </div>
                </li>
              </ul>
            </SectionFadeIn>
            <SectionFadeIn delay={0.1}>
              <div className="rounded-2xl bg-background/5 p-8 backdrop-blur sm:p-10">
                <h3 className="text-[24px] font-bold sm:text-[28px]">
                  가맹 상담은 전담 매니저가
                </h3>
                <p className="mt-4 text-[14px] leading-[1.7] text-background/70 sm:text-[15px]">
                  사업 검토부터 입지 컨설팅, 오픈까지 가맹 전담 매니저가 일대일로
                  안내합니다. 부담 없이 문의 주세요.
                </p>
                <div className="mt-8 space-y-3">
                  <Link
                    href="/contact"
                    className="group flex items-center justify-between rounded-xl bg-primary px-6 py-4 text-[14px] font-bold text-primary-foreground transition-colors hover:bg-[oklch(0.38_0.18_290)] sm:text-[15px]"
                  >
                    가맹 상담 신청하기
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a
                    href="tel:010-9717-3373"
                    className="flex items-center justify-between rounded-xl border border-background/30 px-6 py-4 text-[14px] font-bold transition-colors hover:bg-background/10 sm:text-[15px]"
                  >
                    가맹 전담 매니저 · 이윤진
                    <span className="text-primary">010-9717-3373</span>
                  </a>
                </div>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
