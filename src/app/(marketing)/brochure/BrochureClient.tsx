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
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  ArrowLeft,
  CheckCircle2,
  Calculator,
} from "lucide-react";

// ============================================================
// 두비전 공식 회사소개서 (A4 인쇄 최적화)
// 8 페이지 구성: 표지 / 브랜드 / 그룹 / 프로그램 / 특허·미디어 /
//                투자비·운영비 / 수익모델·지원체계 / 연락처
// ============================================================

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

      {/* ========== 페이지 1 : 표지 ========== */}
      <Page>
        <div className="relative flex h-full flex-col overflow-hidden bg-[oklch(0.32_0.18_290)] text-white">
          <Image
            src="/images/dovision/image_08.png"
            alt=""
            aria-hidden
            fill
            sizes="210mm"
            className="absolute inset-0 object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.28_0.20_290)] via-transparent to-[oklch(0.20_0.18_290)]" />
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
              <h1 className="mt-4 font-black leading-[0.95] tracking-[-0.03em] text-[64px]">
                DOVISION
              </h1>
              <p className="mt-4 text-[18px] font-medium leading-[1.5] text-white/90">
                천재의 기억법 · 두비전
              </p>
              <p className="mt-2 max-w-[140mm] text-[12px] leading-[1.7] text-white/70">
                25년 뇌교육 연구와 특허 기술로, 학생의 잠재력을 과학적으로
                끌어올리는 창의융합 뇌교육 프랜차이즈입니다.
              </p>
            </div>

            <div className="flex items-end justify-between border-t border-white/20 pt-5 text-[10px] text-white/70">
              <div>
                <p className="font-bold text-white">㈜키네스 두비전 사업부</p>
                <p className="mt-1">서울 강남구 역삼2동 775-2 초원빌딩 3층</p>
              </div>
              <div className="text-right">
                <p>www.dovision.kr</p>
                <p className="mt-0.5">0507-1434-3226</p>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 2 : 브랜드 / Why DOVISION ========== */}
      <Page>
        <PageHeader pageNo={2} title="BRAND · 두비전을 소개합니다" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            WHY DOVISION
          </p>
          <h2 className="mt-3 text-[28px] font-black leading-[1.15] tracking-[-0.02em]">
            기억은 재능이 아니라
            <br />
            <span className="text-primary">학습 가능한 기술</span>입니다.
          </h2>
          <p className="mt-5 max-w-[160mm] text-[12px] leading-[1.85] text-muted-foreground">
            두비전(DOVISION)은 2001년부터 축적된 뇌교육 연구와
            이미지전환기억법(특허 제10-1994856호)을 결합한 창의융합 뇌교육
            브랜드입니다. 단순 암기 학원이 아닌, &ldquo;뇌의 작동 원리를 이해하고
            훈련해 학습 효율을 극대화&rdquo;하는 과학적 교육 시스템을 제공합니다.
          </p>

          {/* 3-column USP */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              {
                no: "01",
                title: "특허 기반 독점 커리큘럼",
                desc: "이미지전환기억법(특허 제10-1994856호)을 비롯한 검증된 뇌교육 시스템. 동종 프로그램의 시장 진입을 차단합니다.",
              },
              {
                no: "02",
                title: "25년 연구·교육 노하우",
                desc: "2001년부터 누적된 학생 데이터·교재 개정 27차례·직영 3개 센터의 운영 매뉴얼이 가맹점주에게 그대로 이전됩니다.",
              },
              {
                no: "03",
                title: "뉴로피드백·BTS 통합",
                desc: "기억법 + 뉴로피드백 + BTS(뇌기능검사). 단일 프로그램이 아닌 통합 솔루션으로 학습 성과를 입증합니다.",
              },
            ].map((u) => (
              <div
                key={u.no}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <p className="text-[18px] font-black text-primary">{u.no}</p>
                <p className="mt-2 text-[13px] font-bold leading-[1.4]">
                  {u.title}
                </p>
                <p className="mt-2 text-[10.5px] leading-[1.7] text-muted-foreground">
                  {u.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-4 gap-3">
            {[
              { num: "25+", label: "년 연구·교육 노하우" },
              { num: "27", label: "교재 개정 횟수" },
              { num: "10,000+", label: "누적 수강생" },
              { num: "1", label: "특허 등록(제10-1994856호)" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-primary/5 p-4 text-center"
              >
                <p className="text-[24px] font-black text-primary">{s.num}</p>
                <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Brand promise */}
          <div className="mt-8 rounded-2xl border-l-4 border-primary bg-muted/30 p-5">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              BRAND PROMISE
            </p>
            <p className="mt-2 text-[14px] font-bold leading-[1.55]">
              &ldquo;학생이 변화하는 모습을 학부모가 눈으로 확인할 수 있는
              교육&rdquo; — 검사·훈련·코칭 3-in-1 시스템으로 정량적 성과를
              제공합니다.
            </p>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 3 : 키네스 그룹 ========== */}
      <Page>
        <PageHeader pageNo={3} title="GROUP · ㈜키네스 그룹" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            KINESS GROUP SYNERGY
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.15] tracking-[-0.02em]">
            두비전은 <span className="text-primary">27년 프랜차이즈</span>의
            <br />
            DNA를 그대로 이식받습니다.
          </h2>
          <p className="mt-4 text-[11.5px] leading-[1.85] text-muted-foreground">
            두비전은 신생 브랜드 가맹이 아닙니다. 1999년 설립된 ㈜키네스가 27년간
            전국 17개 지점·해외 1개국(베트남 하노이)을 운영하며 축적한 실전
            매뉴얼이 두비전 가맹점주의 첫 날부터 그대로 작동합니다.
          </p>

          {/* Group strengths */}
          <div className="mt-7 grid grid-cols-2 gap-4">
            {[
              {
                t: "검증된 운영 매뉴얼",
                d: "키네스 17개 지점이 27년간 다듬어 온 상담·회원관리·환불·클레임 대응 매뉴얼이 그대로 두비전에 이식됩니다.",
              },
              {
                t: "동일 타겟 고객 풀",
                d: "키네스(성장관리) + 두비전(뇌교육) 모두 8세 이상 자녀의 잠재력을 과학으로 끌어올리려는 학부모를 공유합니다.",
              },
              {
                t: "본사 슈퍼바이저 조직",
                d: "이미 구축된 SV·교육·R&D 조직을 그대로 활용. 별도 본사 셋업 비용 없이 가맹 첫 달부터 풀 지원이 가동됩니다.",
              },
              {
                t: "공동 마케팅 자산",
                d: "KBS·MBC·SBS 등 지상파 다수 출연 이력과 연구 논문·도서 실적이 두비전 브랜드 신뢰도로 직접 연결됩니다.",
              },
              {
                t: "상권 데이터·입지 우선권",
                d: "서울·경인·경상권 주요 상권 데이터 기반 두비전 입지 컨설팅. 키네스 인근은 시너지 우선 검토 지역입니다.",
              },
              {
                t: "지역 독점 영업권",
                d: "특허 기반 독점성으로 동일 프로그램 진입 차단. 가맹 계약 시 영업 지역을 별도 보호합니다.",
              },
            ].map((g) => (
              <div
                key={g.t}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <p className="text-[12.5px] font-bold">{g.t}</p>
                <p className="mt-2 text-[10.5px] leading-[1.7] text-muted-foreground">
                  {g.d}
                </p>
              </div>
            ))}
          </div>

          {/* Group timeline */}
          <div className="mt-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              TIMELINE
            </p>
            <div className="mt-3 grid grid-cols-5 gap-2 text-center">
              {[
                { y: "1999", e: "㈜키네스 설립" },
                { y: "2001", e: "두비전 R&D 착수" },
                { y: "2018", e: "특허 등록 · 우수 프랜차이즈" },
                { y: "2020", e: "베트남 하노이 진출" },
                { y: "2026", e: "두비전 가맹 본격화" },
              ].map((t) => (
                <div
                  key={t.y}
                  className="rounded-lg border border-primary/30 bg-primary/5 p-2.5"
                >
                  <p className="text-[14px] font-black text-primary">{t.y}</p>
                  <p className="mt-1 text-[9px] font-semibold text-foreground/80">
                    {t.e}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 4 : 프로그램 ========== */}
      <Page>
        <PageHeader pageNo={4} title="PROGRAM · 3대 핵심 프로그램" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            CORE CURRICULUM
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.15] tracking-[-0.02em]">
            검사 · 훈련 · 코칭의
            <br />
            <span className="text-primary">3-in-1 통합 프로그램</span>
          </h2>

          <div className="mt-7 space-y-5">
            {/* Program 1 */}
            <ProgramRow
              icon={BookOpen}
              tag="MEMORY METHOD · PATENT"
              title="이미지전환기억법"
              subtitle="특허 제10-1994856호"
              points={[
                "숫자·단어·개념을 시각적 이미지로 전환해 장기기억으로 저장",
                "48주 체계적 커리큘럼 (기초→심화→실전)",
                "초·중·고 전 학년 적용 가능",
              ]}
              metric="기억량 평균 200~600% 향상"
            />
            {/* Program 2 */}
            <ProgramRow
              icon={Activity}
              tag="NEUROFEEDBACK"
              title="뉴로피드백 훈련"
              subtitle="뇌파 측정 기반 집중력 강화"
              points={[
                "실시간 뇌파 측정으로 집중·이완 상태 시각화",
                "주의력결핍·과잉행동 개선에 임상적 효과 검증",
                "학습 효율을 결정하는 메타인지 능력 강화",
              ]}
              metric="집중력 점수 평균 30~50% 개선"
            />
            {/* Program 3 */}
            <ProgramRow
              icon={Brain}
              tag="BTS · BRAIN TEST"
              title="BTS 뇌기능검사"
              subtitle="외부 전문기관 연계 정량 평가"
              points={[
                "기억력·집중력·정보처리속도·실행기능 영역별 측정",
                "3개월 단위 재검사로 변화 추적 (그래프 리포트 제공)",
                "학부모 상담 시 객관적 데이터로 신뢰 확보",
              ]}
              metric="객관적 성과 데이터 → 재등록률 80%+"
            />
          </div>

          {/* Class structure */}
          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
                  CLASS STRUCTURE
                </p>
                <p className="mt-2 text-[13px] font-bold">
                  주 2회 수업 (집중 교육 + 코칭/상담 + 필요시 뉴로피드백)
                </p>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  월 80만원 · 6개월 선불 480만원 · 뇌기능 재검사 매 3개월 10만원
                  별도
                </p>
              </div>
              <div className="text-right">
                <p className="text-[28px] font-black text-primary">480<span className="text-[14px]">만원</span></p>
                <p className="text-[10px] font-semibold text-muted-foreground">
                  6개월 선불 등록비
                </p>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 5 : 특허·미디어·실적 ========== */}
      <Page>
        <PageHeader pageNo={5} title="CREDENTIALS · 특허·수상·미디어" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            TRUST &amp; RECOGNITION
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.15] tracking-[-0.02em]">
            검증된 신뢰, <span className="text-primary">27년의 증거</span>
          </h2>

          {/* Credentials grid */}
          <div className="mt-7 grid grid-cols-2 gap-4">
            <CredCard
              icon={ShieldCheck}
              tag="PATENT"
              title="특허 제10-1994856호"
              desc="대한민국 특허청 등록 · 이미지전환기억법. 동일 프로그램의 타 브랜드 진입이 법적으로 제한됩니다."
            />
            <CredCard
              icon={Award}
              tag="AWARD"
              title="우수 프랜차이즈 (2018)"
              desc="소상공인진흥공단 우수 프랜차이즈 선정. 본사 운영 시스템과 가맹점 지원 체계의 공식 인증."
            />
            <CredCard
              icon={Tv}
              tag="MEDIA"
              title="KBS · MBC · SBS 다수 출연"
              desc="지상파 3사 교양·시사 프로그램에 두비전 교육 사례 다수 방영. 미디어 신뢰 자산 확보."
            />
            <CredCard
              icon={Building2}
              tag="GROUP"
              title="㈜키네스 그룹 · 27년"
              desc="1999년 설립 · 전국 17개 지점 + 해외 1개국 운영. 두비전은 그룹의 뇌교육 사업부입니다."
            />
          </div>

          {/* Track record */}
          <div className="mt-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              TRACK RECORD
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { num: "17", label: "전국 키네스 그룹 지점" },
                { num: "10,000+", label: "누적 수강생" },
                { num: "80%+", label: "재등록률 (직영 평균)" },
                { num: "200~600%", label: "기억량 향상 평균" },
                { num: "30~50%", label: "집중력 개선 평균" },
                { num: "27", label: "교재 개정 횟수" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border/60 bg-card p-3"
                >
                  <p className="text-[20px] font-black text-primary">{s.num}</p>
                  <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-xl border-l-4 border-primary bg-muted/30 p-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              CASE
            </p>
            <p className="mt-2 text-[12px] font-semibold leading-[1.6]">
              &ldquo;6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요&rdquo; (초등 5학년) ·
              &ldquo;IQ 100→125&rdquo; (중2) · &ldquo;서울대 합격&rdquo; (고1) ·
              &ldquo;기억량 600% 향상&rdquo; (초등 3학년) — 누적 수강생 학부모
              인터뷰 발췌
            </p>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 6 : 가맹 투자 / 운영비 / 본사 공급원가 ========== */}
      <Page>
        <PageHeader pageNo={6} title="INVESTMENT · 가맹 투자·운영 구조" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            INVESTMENT STRUCTURE
          </p>
          <h2 className="mt-3 text-[26px] font-black leading-[1.15] tracking-[-0.02em]">
            총 <span className="text-primary">1억원</span> · 30~35평 표준 모델
          </h2>

          {/* Initial cost table */}
          <div className="mt-6 grid grid-cols-2 gap-5">
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                초기 투자비
              </p>
              <p className="mt-1 text-[20px] font-black text-primary">1억원</p>
              <table className="mt-3 w-full text-[10.5px]">
                <tbody>
                  {[
                    ["가맹비", "1,000만원"],
                    ["인테리어 (30~35평)", "2,500~3,000만원"],
                    ["강의시설·장비", "1,500만원"],
                    ["교육비 (3개월)", "1,500만원"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-border/60 last:border-0">
                      <td className="py-1.5 font-semibold">{k}</td>
                      <td className="py-1.5 text-right text-foreground/80">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 rounded-md bg-muted/40 p-2 text-[9.5px] text-muted-foreground">
                ※ 임대보증금 2,500~3,000만원은 별도
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                월 운영비
              </p>
              <p className="mt-1 text-[20px] font-black text-primary">
                1,300~1,800만원
              </p>
              <table className="mt-3 w-full text-[10.5px]">
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
                          hl ? "font-bold text-primary" : "text-foreground/80"
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

          {/* COGS 22.5% block */}
          <div className="mt-5 rounded-xl border-2 border-primary bg-primary/5 p-5">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
                  TOTAL COGS · 본사 공급원가
                </p>
                <p className="mt-1 text-[16px] font-bold leading-[1.4]">
                  매출 연동 로열티 10% + 앱 교재비 12.5%
                </p>
                <p className="mt-1.5 text-[10.5px] leading-[1.7] text-muted-foreground">
                  음식점의 &ldquo;재료비&rdquo;에 해당하는 본사 공급원가 비율.
                  매출의 <strong>77.5%가 가맹점주에게</strong> 남는 구조로,
                  동종 교육 프랜차이즈 대비 가맹점주 마진이 강합니다.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[44px] font-black leading-none text-primary">
                  22.5<span className="text-[20px]">%</span>
                </p>
                <p className="mt-1 text-[9.5px] font-semibold text-muted-foreground">
                  매출액 대비 본사 공급원가
                </p>
              </div>
            </div>
          </div>

          {/* Why 1억 footer */}
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <MicroStat icon={Users} num="3-4명" label="BEP 신규등록 (월)" />
            <MicroStat icon={Calculator} num="60일" label="계약→오픈 소요" />
            <MicroStat icon={ShieldCheck} num="지역 독점" label="영업권 보호" />
          </div>
        </div>
      </Page>

      {/* ========== 페이지 7 : 수익 모델 + 본사 지원 + 타임라인 ========== */}
      <Page>
        <PageHeader pageNo={7} title="REVENUE & SUPPORT · 수익·지원 체계" />
        <div className="px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            OFFICIAL REVENUE MODEL
          </p>
          <h2 className="mt-3 text-[24px] font-black leading-[1.15] tracking-[-0.02em]">
            6개월 선불 480만원 ·{" "}
            <span className="text-primary">월 신규 5명부터 흑자</span>
          </h2>

          <table className="mt-5 w-full overflow-hidden rounded-xl border border-border/60 text-[11px]">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-3 py-2.5 text-left font-bold">월 신규등록</th>
                <th className="px-3 py-2.5 text-right font-bold">월 매출</th>
                <th className="px-3 py-2.5 text-right font-bold">월 순이익</th>
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
                  <td className="px-3 py-2 font-semibold">
                    {n}명 <span className="text-muted-foreground">× 480만</span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {r.toLocaleString()}만원
                  </td>
                  <td className="px-3 py-2 text-right font-black text-primary">
                    +{p.toLocaleString()}만원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[9.5px] text-muted-foreground">
            ※ 월 지출 1,800만원(본사 공급원가 22.5% 포함) 기준 · BEP 월 신규등록
            3~4명
          </p>

          {/* Support */}
          <div className="mt-6 grid grid-cols-2 gap-4">
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
          <div className="mt-6">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              TIMELINE · 계약부터 오픈까지 60일
            </p>
            <div className="mt-3 grid grid-cols-6 gap-1.5 text-center">
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
                  className="rounded-md border border-primary/30 bg-primary/5 p-2"
                >
                  <p className="text-[11px] font-black text-primary">{d}</p>
                  <p className="mt-0.5 text-[9px] font-semibold">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* ========== 페이지 8 : 연락처 / 다음 단계 ========== */}
      <Page>
        <PageHeader pageNo={8} title="CONTACT · 다음 단계" />
        <div className="flex h-full flex-col px-[18mm] py-[14mm]">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            NEXT STEP
          </p>
          <h2 className="mt-3 text-[28px] font-black leading-[1.15] tracking-[-0.02em]">
            지금 바로
            <br />
            <span className="text-primary">사업성 분석</span>을 받아보세요.
          </h2>
          <p className="mt-4 max-w-[155mm] text-[12px] leading-[1.85] text-muted-foreground">
            가맹 전담 매니저가 지역 상권 분석 + 입지 검토 + 맞춤 사업성
            시뮬레이션을 무료로 제공합니다. 본 회사소개서를 검토하신 뒤 아래
            연락처로 문의 주세요.
          </p>

          {/* Contact card */}
          <div className="mt-7 rounded-2xl border-2 border-primary bg-primary/5 p-6">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              가맹 전담 매니저
            </p>
            <div className="mt-4 grid grid-cols-2 gap-5 text-[11.5px]">
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

          {/* CTA links */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["홈페이지", "www.dovision.kr"],
              ["가맹 안내", "www.dovision.kr/franchise"],
              ["수익 시뮬레이터", "www.dovision.kr/simulator"],
            ].map(([t, u]) => (
              <div
                key={t}
                className="rounded-xl border border-border/60 bg-card p-3 text-center"
              >
                <p className="text-[10.5px] font-bold">{t}</p>
                <p className="mt-1 text-[9.5px] font-mono text-primary">{u}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-border/60 pt-5 text-center text-[9.5px] leading-[1.7] text-muted-foreground">
            <p className="font-semibold text-foreground/80">
              본 자료는 두비전 가맹 검토용 비공개 자료입니다.
            </p>
            <p className="mt-1">
              ⓒ 2026 ㈜키네스 그룹 · DOVISION. All rights reserved.
            </p>
          </div>
        </div>
      </Page>

      {/* ========== 인쇄용 글로벌 스타일 ========== */}
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
        {String(pageNo).padStart(2, "0")} / 08
      </span>
    </div>
  );
}

function ProgramRow({
  icon: Icon,
  tag,
  title,
  subtitle,
  points,
  metric,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  metric: string;
}) {
  return (
    <div className="grid grid-cols-[40mm_1fr] items-start gap-4 rounded-xl border border-border/60 bg-card p-4">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <Icon className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-2 text-[9px] font-bold tracking-[0.15em] text-primary">
          {tag}
        </p>
        <p className="mt-1.5 text-[12px] font-bold leading-[1.3]">{title}</p>
        <p className="mt-1 text-[9.5px] text-muted-foreground">{subtitle}</p>
      </div>
      <div>
        <ul className="space-y-1.5">
          {points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-1.5 text-[10.5px] leading-[1.55]"
            >
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
          <TrendingUp className="h-3 w-3" />
          {metric}
        </div>
      </div>
    </div>
  );
}

function CredCard({
  icon: Icon,
  tag,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold tracking-[0.1em] text-primary-foreground">
          {tag}
        </span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-[13px] font-bold leading-[1.35]">{title}</p>
      <p className="mt-2 text-[10.5px] leading-[1.7] text-muted-foreground">
        {desc}
      </p>
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
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1.5 text-[16px] font-black text-primary">{num}</p>
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function SupportBlock({ tag, items }: { tag: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <span className="rounded-md bg-primary px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-primary-foreground">
        {tag}
      </span>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-1.5 text-[10.5px] leading-[1.55]"
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
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 whitespace-pre-line text-[12.5px] font-bold leading-[1.4]">
          {value}
        </p>
      </div>
    </div>
  );
}
