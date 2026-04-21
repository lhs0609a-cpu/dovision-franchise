"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  School as SchoolIcon,
  Building2,
  Users,
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Phone,
  ArrowRight,
  Download,
  RotateCcw,
  Loader2,
  Award,
  Info,
} from "lucide-react";
import { generateTerritoryData } from "@/lib/territory/mock-data";
import {
  calculateScore,
  estimateDemand,
  projectRevenue,
} from "@/lib/territory/demand-model";
import { generateAIReport } from "@/lib/territory/ai-report";
import {
  fetchRealPlaces,
  estimateDemographicsFromPlaces,
} from "@/lib/territory/fetch-places";
import type {
  TerritoryAnalysis,
  TerritoryInput,
  TerritoryScore,
} from "@/lib/territory/types";
import LocationPickerMap from "@/components/territory/LocationPickerMap";
import ResultMap from "@/components/territory/ResultMap";

// ============================================================
// 두비전 AI 상권분석 도구
// ============================================================

const PRESET_LOCATIONS = [
  "서울 강남구 대치동",
  "서울 송파구 잠실동",
  "서울 양천구 목동",
  "경기 성남시 분당구 정자동",
  "경기 안양시 동안구 평촌동",
  "경기 화성시 동탄2신도시",
];

export default function TerritoryClient() {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [radiusKm, setRadiusKm] = useState(2);
  const [analysis, setAnalysis] = useState<TerritoryAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [mapSearchTrigger, setMapSearchTrigger] = useState<{
    query: string;
    nonce: number;
  } | null>(null);

  const handleMapSelect = (info: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    if (info.address) setAddress(info.address);
    setCoords({ lat: info.lat, lng: info.lng });
  };

  const handleAddressSearch = () => {
    if (!address.trim()) return;
    setMapSearchTrigger({ query: address.trim(), nonce: Date.now() });
  };

  const runAnalysis = async () => {
    if (!address.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);

    const input: TerritoryInput = {
      address: address.trim(),
      radiusKm,
      lat: coords?.lat,
      lng: coords?.lng,
    };

    let schools;
    let academies;
    let apartments;
    let demographics;
    let isRealData = false;
    let dataSource: "kakao-local-api" | "mock-simulation" = "mock-simulation";

    try {
      // 좌표가 있으면 카카오 실데이터 우선 시도
      if (coords) {
        const real = await fetchRealPlaces(coords.lat, coords.lng, radiusKm);
        if (real.schools.length === 0 && real.academies.length === 0) {
          throw new Error("주변에 카카오 검색 결과가 없습니다");
        }
        schools = real.schools;
        academies = real.academies;
        apartments = real.apartments;
        demographics = estimateDemographicsFromPlaces(
          schools,
          apartments,
          radiusKm
        );
        isRealData = true;
        dataSource = "kakao-local-api";
      } else {
        throw new Error("좌표 없음 — mock fallback");
      }
    } catch (err) {
      // Fallback: mock 데이터
      const territory = generateTerritoryData(input.address, radiusKm);
      schools = territory.schools;
      academies = territory.academies;
      apartments = territory.apartments;
      demographics = territory.demographics;
      isRealData = false;
      dataSource = "mock-simulation";
      if (err instanceof Error && !err.message.includes("좌표 없음")) {
        setAnalysisError(
          `실시간 데이터 조회 실패 — 시뮬레이션 데이터로 대체: ${err.message}`
        );
      }
    }

    const demand = estimateDemand(schools, academies, demographics);
    const score = calculateScore(schools, academies, apartments, demographics);
    const revenue = projectRevenue(demand.standardSignupsPerMonth);
    const report = generateAIReport({
      address: input.address,
      schools,
      academies,
      apartments,
      demographics,
      demand,
      revenue,
      score,
    });

    setAnalysis({
      input,
      schools,
      academies,
      apartments,
      demographics,
      demand,
      revenue,
      score,
      report,
      analyzedAt: new Date().toISOString(),
      dataSource,
      isRealData,
    });
    setIsAnalyzing(false);
  };

  const reset = () => {
    setAnalysis(null);
    setAddress("");
    setCoords(null);
    setAnalysisError(null);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="bg-[#fafafe] pb-20">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16 print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />
        <div className="container-responsive relative z-10 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-[0.15em] text-primary sm:text-sm">
            AI TERRITORY ANALYSIS
          </span>
          <h1 className="mt-6 font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[52px] lg:text-[64px]">
            우리 동네는
            <br />
            <span className="text-primary">두비전 가맹에 적합할까?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-[17px]">
            후보 지점의 주변 학교·학원·아파트·인구 데이터를 종합 분석해
            <br className="hidden sm:inline" />
            예상 매출과 사업성 등급을 즉시 확인하세요.
          </p>
        </div>
      </section>

      {/* 데이터 출처 안내 */}
      <section className="pt-6 print:hidden">
        <div className="container-responsive max-w-5xl">
          <div className="flex items-start gap-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 shadow-sm sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-[12px] leading-[1.65] text-emerald-900 sm:text-[13px]">
              <p className="font-bold text-emerald-900">
                ✓ 실시간 데이터 연동 — Kakao Maps + Kakao 로컬 API
              </p>
              <p className="mt-1">
                지도·주소 검색 및 학교·학원 데이터 모두{" "}
                <strong>카카오 API(실제 상호명)</strong>로 조회됩니다. 각
                장소명 옆의 &ldquo;카카오↗&rdquo; 링크로 원본 상세를 확인할 수
                있습니다.
                <br />
                <strong>추정값 항목 (별도 표시):</strong> 학교 학생수 (NEIS 연동
                전 평균값), 아파트 가구수/시세 (국토부 API 연동 전), 인구·소득
                (통계청 SGIS 연동 전).
              </p>
            </div>
          </div>
          {analysisError && (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[12px] text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{analysisError}</p>
            </div>
          )}
        </div>
      </section>

      {/* 입력 폼 + 지도 */}
      <section className="py-8 print:hidden">
        <div className="container-responsive max-w-5xl">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-[18px] font-bold sm:text-[20px]">
                후보 지점 선택
              </h2>
              <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                지도 클릭 or 주소 검색
              </span>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
              {/* 지도 */}
              <LocationPickerMap
                onSelect={handleMapSelect}
                radiusKm={radiusKm}
                searchTrigger={mapSearchTrigger}
              />

              {/* 우측 컨트롤 */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground">
                    주소 또는 지역명
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="예: 서울 강남구 대치동"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddressSearch();
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      disabled={!address.trim()}
                      className="shrink-0 rounded-lg border border-border bg-muted/40 px-3 text-[12px] font-semibold transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                      aria-label="주소 검색"
                    >
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {PRESET_LOCATIONS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setAddress(p);
                          setMapSearchTrigger({ query: p, nonce: Date.now() });
                        }}
                        className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10.5px] font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground">
                    분석 반경: {radiusKm}km
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.5}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1km</span>
                    <span>3km</span>
                    <span>5km</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={!address.trim() || isAnalyzing}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-bold text-primary-foreground shadow-md transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI 분석 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI 상권분석 시작
                    </>
                  )}
                </button>

                <div className="flex items-start gap-1.5 rounded-lg bg-muted/40 p-2.5 text-[10.5px] leading-[1.6] text-muted-foreground">
                  <Info className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>
                    지도에서 <strong>클릭하거나</strong> 우측에 주소를 입력 후{" "}
                    <strong>검색</strong>하면 후보 지점이 설정됩니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 분석 결과 */}
      {analysis && <AnalysisResult analysis={analysis} onReset={reset} onPrint={handlePrint} />}

      {/* 스타일: 인쇄 시 입력폼/헤더/푸터 숨김 */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 분석 결과 화면
// ============================================================

function AnalysisResult({
  analysis,
  onReset,
  onPrint,
}: {
  analysis: TerritoryAnalysis;
  onReset: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="container-responsive max-w-6xl">
      {/* 액션 바 */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[12px] font-semibold transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          새 지역 분석
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12px] font-bold text-primary-foreground shadow-md hover:translate-y-[-1px]"
        >
          <Download className="h-3.5 w-3.5" />
          PDF 리포트 다운로드
        </button>
      </div>

      {/* 데이터 출처 배지 (인쇄에도 포함) */}
      {analysis.isRealData ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="flex-1 text-[12px] leading-[1.65] text-emerald-900">
            <p className="font-bold">
              ✓ Kakao 로컬 API 실시간 데이터 기반 리포트
            </p>
            <p className="mt-0.5">
              학교·학원 명칭은 카카오 로컬 API에서 실시간 조회된 실제 상호명입니다.
              학생수는 NEIS 연동 전까지 평균 추정치(초 650·중 550·고 500)를
              사용합니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1 text-[12px] leading-[1.65] text-amber-900">
            <p className="font-bold">
              본 리포트는 시뮬레이션 데이터로 작성된 예시입니다
            </p>
            <p className="mt-0.5">
              지도에서 후보 지점을 클릭하거나 주소를 검색해 좌표를 설정하면 카카오
              실데이터로 자동 전환됩니다.
            </p>
          </div>
        </div>
      )}

      {/* ======== 1. 종합 점수 + 헤드라인 ======== */}
      <ScoreSection analysis={analysis} />

      {/* ======== 2. 입지 정보 + 지도(SVG) ======== */}
      <LocationSection analysis={analysis} />

      {/* ======== 3. 주변 시설 카드 (학교/학원/아파트) ======== */}
      <FacilitiesSection analysis={analysis} />

      {/* ======== 4. 인구 통계 ======== */}
      <DemographicsSection analysis={analysis} />

      {/* ======== 5. 잠재 수요 추정 ======== */}
      <DemandSection analysis={analysis} />

      {/* ======== 6. AI 분석 리포트 ======== */}
      <AIReportSection analysis={analysis} />

      {/* ======== 7. 예상 수익 시뮬레이션 ======== */}
      <RevenueSection analysis={analysis} />

      {/* ======== 8. 다음 단계 CTA ======== */}
      <CTASection analysis={analysis} />
    </div>
  );
}

// ============================================================
// 1. 종합 점수
// ============================================================

function ScoreSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { score, report, input } = analysis;
  const gradeColor: Record<TerritoryScore["grade"], string> = {
    S: "from-amber-400 via-orange-400 to-rose-400",
    A: "from-violet-500 via-fuchsia-500 to-purple-600",
    B: "from-cyan-400 via-blue-500 to-indigo-500",
    C: "from-slate-400 via-slate-500 to-slate-600",
    D: "from-red-400 via-red-500 to-rose-600",
  };

  return (
    <section className="mb-10">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradeColor[score.grade]} p-8 text-white shadow-xl sm:p-10`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <p className="text-[12px] font-bold tracking-[0.2em]">
                ANALYSIS RESULT · {input.address}
              </p>
            </div>
            <h2 className="mt-3 text-[26px] font-black leading-[1.2] sm:text-[34px]">
              {report.headline}
            </h2>
            <div className="mt-5 grid grid-cols-5 gap-2 text-center sm:gap-3">
              {Object.entries(score.breakdown).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg bg-white/15 p-2.5 backdrop-blur sm:p-3"
                >
                  <p className="text-[9px] font-bold opacity-80 sm:text-[10px]">
                    {scoreLabel(k)}
                  </p>
                  <p className="mt-1 text-[18px] font-black sm:text-[22px]">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white/20 backdrop-blur sm:h-[180px] sm:w-[180px]">
              <div className="absolute inset-3 rounded-full bg-white/30" />
              <div className="relative text-center">
                <p className="text-[100px] font-black leading-none drop-shadow-md sm:text-[120px]">
                  {score.grade}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[14px] font-bold">
              종합점수{" "}
              <span className="text-[20px]">{score.score}</span>
              <span className="opacity-70">/100</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function scoreLabel(key: string): string {
  switch (key) {
    case "studentDensity":
      return "학생 밀도";
    case "income":
      return "가구 소득";
    case "competition":
      return "경쟁 강도";
    case "accessibility":
      return "접근성";
    case "populationDensity":
      return "인구 밀도";
    default:
      return key;
  }
}

// ============================================================
// 2. 입지 정보 + SVG 지도
// ============================================================

function LocationSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { input, schools, academies } = analysis;
  const hasCoords = input.lat != null && input.lng != null;
  return (
    <section className="mb-10">
      <SectionHeader
        icon={MapPin}
        eyebrow="LOCATION"
        title="입지 위치"
        subtitle={`반경 ${input.radiusKm}km 이내 실제 좌표 기반 시각화 · Kakao Maps`}
      />
      <div className="mt-5 space-y-0 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        {hasCoords ? <ResultMap analysis={analysis} /> : <SvgMap analysis={analysis} />}
        <div className="grid grid-cols-3 border-t border-border/60 text-center text-[12px] sm:text-[13px]">
          <div className="border-r border-border/60 p-3">
            <p className="text-muted-foreground">분석 주소</p>
            <p className="mt-1 font-bold">{input.address}</p>
          </div>
          <div className="border-r border-border/60 p-3">
            <p className="text-muted-foreground">학교 (반경 내)</p>
            <p className="mt-1 font-bold text-primary">{schools.length}곳</p>
          </div>
          <div className="p-3">
            <p className="text-muted-foreground">학원 (반경 내)</p>
            <p className="mt-1 font-bold text-primary">{academies.length}곳</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SvgMap({ analysis }: { analysis: TerritoryAnalysis }) {
  const { schools, academies, apartments, input } = analysis;
  // 좌표를 정규화: 거리 → 0-100 범위
  const maxDist = input.radiusKm * 1000;
  const points = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return {
      schools: schools.map((s) => ({
        ...s,
        x: 50 + (s.distanceM / maxDist) * 38 * Math.cos(rand() * Math.PI * 2),
        y: 50 + (s.distanceM / maxDist) * 38 * Math.sin(rand() * Math.PI * 2),
      })),
      academies: academies.map((a) => ({
        ...a,
        x: 50 + (a.distanceM / maxDist) * 38 * Math.cos(rand() * Math.PI * 2),
        y: 50 + (a.distanceM / maxDist) * 38 * Math.sin(rand() * Math.PI * 2),
      })),
      apartments: apartments.map((p) => ({
        ...p,
        x: 50 + (p.distanceM / maxDist) * 38 * Math.cos(rand() * Math.PI * 2),
        y: 50 + (p.distanceM / maxDist) * 38 * Math.sin(rand() * Math.PI * 2),
      })),
    };
  }, [schools, academies, apartments, maxDist]);

  return (
    <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[oklch(0.97_0.02_290)] to-[oklch(0.94_0.04_290)]">
      <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full">
        {/* 격자 */}
        <defs>
          <pattern
            id="grid"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="oklch(0.85 0.04 290)"
              strokeWidth="0.1"
            />
          </pattern>
        </defs>
        <rect width="100" height="56" fill="url(#grid)" />

        {/* 반경 원 */}
        {[15, 28, 38].map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="28"
            r={r}
            fill="none"
            stroke="oklch(0.45 0.18 290)"
            strokeWidth="0.15"
            strokeDasharray="0.5 0.5"
            opacity={0.3 + i * 0.15}
          />
        ))}

        {/* 후보 지점 (중심) */}
        <circle cx="50" cy="28" r="1.8" fill="oklch(0.45 0.18 290)" />
        <circle
          cx="50"
          cy="28"
          r="3.5"
          fill="none"
          stroke="oklch(0.45 0.18 290)"
          strokeWidth="0.4"
          opacity="0.5"
        />
        <text
          x="50"
          y="24"
          textAnchor="middle"
          fontSize="2"
          fontWeight="bold"
          fill="oklch(0.32 0.18 290)"
        >
          ★ 후보지
        </text>

        {/* 학교 (파랑 사각형) */}
        {points.schools.map((s, i) => {
          const y = (s.y / 100) * 56;
          return (
            <g key={`s-${i}`}>
              <rect
                x={s.x - 1}
                y={y - 1}
                width="2"
                height="2"
                fill="oklch(0.55 0.15 240)"
                rx="0.3"
              />
              <text
                x={s.x}
                y={y - 1.5}
                textAnchor="middle"
                fontSize="1.2"
                fill="oklch(0.4 0.15 240)"
              >
                {s.name.slice(0, 4)}
              </text>
            </g>
          );
        })}

        {/* 학원 (주황 다이아몬드) */}
        {points.academies.map((a, i) => {
          const y = (a.y / 100) * 56;
          const color = a.isCompetitor
            ? "oklch(0.55 0.18 25)"
            : "oklch(0.7 0.12 60)";
          return (
            <rect
              key={`a-${i}`}
              x={a.x - 0.7}
              y={y - 0.7}
              width="1.4"
              height="1.4"
              fill={color}
              transform={`rotate(45 ${a.x} ${y})`}
            />
          );
        })}

        {/* 아파트 (회색 원) */}
        {points.apartments.map((p, i) => {
          const y = (p.y / 100) * 56;
          return (
            <circle
              key={`p-${i}`}
              cx={p.x}
              cy={y}
              r={0.6 + Math.log(p.households / 100) * 0.3}
              fill="oklch(0.6 0.04 290)"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {/* 범례 */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-lg bg-white/85 px-3 py-2 text-[11px] backdrop-blur">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.55_0.15_240)]" />
          학교
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rotate-45 bg-[oklch(0.55_0.18_25)]" />
          경쟁 학원
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rotate-45 bg-[oklch(0.7_0.12_60)]" />
          일반 학원
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.6_0.04_290)]" />
          아파트
        </span>
      </div>
    </div>
  );
}

// ============================================================
// 3. 주변 시설
// ============================================================

function FacilitiesSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { schools, academies, apartments, isRealData } = analysis;
  const elem = schools.filter((s) => s.level === "초등");
  const mid = schools.filter((s) => s.level === "중학교");
  const high = schools.filter((s) => s.level === "고등학교");
  const competitors = academies.filter((a) => a.isCompetitor);
  const others = academies.filter((a) => !a.isCompetitor);

  return (
    <section className="mb-10">
      <SectionHeader
        icon={SchoolIcon}
        eyebrow="FACILITIES"
        title="주변 시설 분석"
        subtitle="학교·학원·아파트 데이터 (시뮬레이션)"
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* 학교 */}
        <FacilityCard title="학교" count={schools.length} icon={SchoolIcon}>
          <FacilitySubGroup
            label="초등학교"
            count={elem.length}
            studentSum={elem.reduce((s, x) => s + x.studentCount, 0)}
          />
          <FacilitySubGroup
            label="중학교"
            count={mid.length}
            studentSum={mid.reduce((s, x) => s + x.studentCount, 0)}
            highlight
          />
          <FacilitySubGroup
            label="고등학교"
            count={high.length}
            studentSum={high.reduce((s, x) => s + x.studentCount, 0)}
          />
          <div className="mt-3 max-h-[180px] space-y-1 overflow-auto">
            {schools.slice(0, 10).map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-[11px]"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  {isRealData ? (
                    s.placeUrl ? (
                      <a
                        href={s.placeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {s.name}{" "}
                        <span className="text-[9px] text-primary">↗</span>
                      </a>
                    ) : (
                      <span>{s.name}</span>
                    )
                  ) : (
                    <>
                      <span className="rounded bg-amber-200 px-1 text-[8px] font-black tracking-wider text-amber-900">
                        예시
                      </span>
                      {s.name}
                    </>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {s.studentCount}명{s.estimated && "*"} · {s.distanceM}m
                </span>
              </div>
            ))}
            {isRealData && schools.some((s) => s.estimated) && (
              <p className="pt-1 text-[9.5px] text-muted-foreground">
                * 학생수는 평균 추정값 (NEIS 연동 전)
              </p>
            )}
          </div>
        </FacilityCard>

        {/* 학원 */}
        <FacilityCard
          title="학원·교습소"
          count={academies.length}
          icon={Brain}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5">
              <p className="text-[10px] font-bold text-rose-600">경쟁 학원</p>
              <p className="mt-0.5 text-[18px] font-black text-rose-600">
                {competitors.length}
              </p>
              <p className="text-[9.5px] text-rose-600/80">
                사고력·뇌교육 카테고리
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-[10px] font-bold text-amber-700">일반 학원</p>
              <p className="mt-0.5 text-[18px] font-black text-amber-700">
                {others.length}
              </p>
              <p className="text-[9.5px] text-amber-700/80">
                교과·외국어·예체능
              </p>
            </div>
          </div>
          <div className="mt-3 max-h-[180px] space-y-1 overflow-auto">
            {academies.slice(0, 12).map((a, i) => (
              <div
                key={`${a.name}-${i}`}
                className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-[11px]"
              >
                <span className="flex items-center gap-1.5">
                  {!isRealData && (
                    <span className="rounded bg-amber-200 px-1 text-[8px] font-black tracking-wider text-amber-900">
                      예시
                    </span>
                  )}
                  {a.isCompetitor && (
                    <span className="rounded bg-rose-500 px-1 text-[8px] font-bold text-white">
                      경쟁
                    </span>
                  )}
                  {isRealData && a.placeUrl ? (
                    <a
                      href={a.placeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold hover:underline"
                    >
                      {a.name}{" "}
                      <span className="text-[9px] text-primary">↗</span>
                    </a>
                  ) : (
                    <span className="font-semibold">{a.name}</span>
                  )}
                </span>
                <span className="text-muted-foreground">{a.distanceM}m</span>
              </div>
            ))}
          </div>
        </FacilityCard>

        {/* 아파트 */}
        <FacilityCard title="아파트 단지" count={apartments.length} icon={Building2}>
          {isRealData ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-[10.5px] leading-[1.6] text-muted-foreground">
              <p className="font-bold text-foreground/80">
                실시간 단지 목록 ({apartments.length}개)
              </p>
              <p className="mt-1">
                가구수·평균 매매가·평형 데이터는 국토부 실거래가 API 연동 후
                자동 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 p-2.5 text-center">
                <p className="text-[10px] font-bold text-primary">총 가구수</p>
                <p className="mt-0.5 text-[18px] font-black text-primary">
                  {apartments
                    .reduce((s, a) => s + a.households, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-primary/5 p-2.5 text-center">
                <p className="text-[10px] font-bold text-primary">평균 매매가</p>
                <p className="mt-0.5 text-[18px] font-black text-primary">
                  {apartments.length
                    ? (
                        apartments.reduce(
                          (s, a) => s + a.avgPriceMillion,
                          0
                        ) /
                        apartments.length /
                        10000
                      ).toFixed(1)
                    : 0}
                  억
                </p>
              </div>
            </div>
          )}
          <div className="mt-3 max-h-[180px] space-y-1 overflow-auto">
            {apartments.slice(0, 10).map((a, i) => (
              <div
                key={`${a.name}-${i}`}
                className="rounded-md bg-muted/30 px-2.5 py-1.5 text-[11px]"
              >
                <p className="flex items-center gap-1.5 font-semibold">
                  {!isRealData && (
                    <span className="rounded bg-amber-200 px-1 text-[8px] font-black tracking-wider text-amber-900">
                      예시
                    </span>
                  )}
                  {isRealData && a.placeUrl ? (
                    <a
                      href={a.placeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {a.name}{" "}
                      <span className="text-[9px] text-primary">↗</span>
                    </a>
                  ) : (
                    <span>{a.name}</span>
                  )}
                </p>
                {isRealData ? (
                  <p className="text-[10px] text-muted-foreground">
                    {a.distanceM}m · 시세·가구수는 국토부 API 연동 후 표시
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    {a.households.toLocaleString()}세대 · 평균{" "}
                    {a.avgPyeong}평 ·{" "}
                    {(a.avgPriceMillion / 10000).toFixed(1)}억
                  </p>
                )}
              </div>
            ))}
          </div>
        </FacilityCard>
      </div>
    </section>
  );
}

function FacilityCard({
  title,
  count,
  icon: Icon,
  children,
}: {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-[14px] font-bold">{title}</h3>
        </div>
        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          {count}곳
        </span>
      </div>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function FacilitySubGroup({
  label,
  count,
  studentSum,
  highlight,
}: {
  label: string;
  count: number;
  studentSum: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] ${
        highlight ? "bg-primary/10" : "bg-muted/40"
      }`}
    >
      <span className="font-semibold">{label}</span>
      <span className="font-bold">
        {count}곳{" "}
        <span className="text-muted-foreground">
          · {studentSum.toLocaleString()}명
        </span>
      </span>
    </div>
  );
}

// ============================================================
// 4. 인구 통계
// ============================================================

function DemographicsSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { demographics } = analysis;
  return (
    <section className="mb-10">
      <SectionHeader
        icon={Users}
        eyebrow="DEMOGRAPHICS"
        title="인구·소득 통계"
        subtitle="반경 내 인구 분포 및 소득 수준"
      />
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="총 인구"
          value={demographics.totalPopulation.toLocaleString()}
          unit="명"
        />
        <StatCard
          label="학령 인구 (8-19세)"
          value={demographics.schoolAgePopulation.toLocaleString()}
          unit="명"
          highlight
        />
        <StatCard
          label="평균 가구 소득"
          value={(demographics.avgHouseholdIncome / 10000).toFixed(1)}
          unit="억원/년"
        />
        <StatCard
          label="사교육 지출 가구"
          value={demographics.privateEduRatio}
          unit="%"
          highlight
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-white"
      }`}
    >
      <p className="text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-[28px] font-black leading-none text-primary">
        {value}
        <span className="ml-1 text-[12px] font-bold text-foreground/60">
          {unit}
        </span>
      </p>
    </div>
  );
}

// ============================================================
// 5. 잠재 수요 추정
// ============================================================

function DemandSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { demand } = analysis;
  return (
    <section className="mb-10">
      <SectionHeader
        icon={Target}
        eyebrow="DEMAND"
        title="잠재 수요 추정"
        subtitle="두비전 직영 6년치 데이터 기반 예측 모델"
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* 시나리오 3종 */}
        <div className="grid gap-3 sm:grid-cols-3">
          <ScenarioCard
            label="보수형"
            signups={demand.conservativeSignupsPerMonth}
            tone="muted"
          />
          <ScenarioCard
            label="표준형 (추천)"
            signups={demand.standardSignupsPerMonth}
            tone="primary"
          />
          <ScenarioCard
            label="공격형"
            signups={demand.aggressiveSignupsPerMonth}
            tone="success"
          />
        </div>

        {/* 잠재 회원 */}
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
            POTENTIAL POOL
          </p>
          <p className="mt-2 text-[40px] font-black leading-none text-primary">
            {demand.potentialMembers}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-foreground/80">
            반경 내 동시 수강 가능 잠재 회원수
          </p>
          <p className="mt-3 text-[10px] leading-[1.6] text-muted-foreground">
            평균 등록 기간 9개월 가정 시, 시나리오별 월 신규 등록 수가 좌측에
            표시됩니다.
          </p>
        </div>
      </div>

      {/* 계산 근거 */}
      <div className="mt-4 rounded-xl border border-border/60 bg-white p-5">
        <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
          CALCULATION RATIONALE · 산정 근거
        </p>
        <ul className="mt-3 space-y-1.5 text-[12px] leading-[1.7] text-foreground/85">
          {demand.rationale.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="text-primary">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ScenarioCard({
  label,
  signups,
  tone,
}: {
  label: string;
  signups: number;
  tone: "muted" | "primary" | "success";
}) {
  const toneClass = {
    muted: "border-border/60 bg-white",
    primary: "border-primary bg-primary/8 ring-2 ring-primary/20",
    success: "border-emerald-300 bg-emerald-50",
  }[tone];
  const numColor = {
    muted: "text-foreground",
    primary: "text-primary",
    success: "text-emerald-600",
  }[tone];

  return (
    <div className={`rounded-xl border-2 p-5 ${toneClass}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 text-[36px] font-black leading-none ${numColor}`}>
        {signups}
        <span className="ml-1 text-[14px]">명/월</span>
      </p>
      <p className="mt-1 text-[10px] text-muted-foreground">월 신규 등록</p>
    </div>
  );
}

// ============================================================
// 6. AI 분석 리포트
// ============================================================

function AIReportSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { report } = analysis;
  return (
    <section className="mb-10">
      <SectionHeader
        icon={Sparkles}
        eyebrow="AI ANALYSIS"
        title="AI 종합 분석 리포트"
        subtitle="GPT 기반 권역 평가 — 강점·약점·마케팅 전략"
      />

      <div className="mt-5 space-y-4">
        {/* 강점 */}
        <ReportCard
          title="이 입지의 강점"
          icon={CheckCircle2}
          color="emerald"
          items={report.strengths}
        />

        {/* 약점 */}
        <ReportCard
          title="주의해야 할 리스크"
          icon={AlertTriangle}
          color="amber"
          items={report.weaknesses}
        />

        {/* 마케팅 전략 */}
        <ReportCard
          title="추천 마케팅 전략"
          icon={Lightbulb}
          color="primary"
          items={report.marketingStrategy}
        />

        {/* 종합 의견 */}
        <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
              EXECUTIVE SUMMARY
            </p>
          </div>
          <p className="mt-3 text-[14px] leading-[1.85] text-foreground/90 sm:text-[15px]">
            {report.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
}

function ReportCard({
  title,
  icon: Icon,
  color,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "emerald" | "amber" | "primary";
  items: string[];
}) {
  const colorClass = {
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    },
    primary: {
      border: "border-primary/30",
      bg: "bg-primary/5",
      text: "text-primary",
      iconBg: "bg-primary/15",
    },
  }[color];

  return (
    <div
      className={`rounded-2xl border ${colorClass.border} ${colorClass.bg} p-5`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClass.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${colorClass.text}`} />
        </div>
        <h3 className={`text-[15px] font-bold ${colorClass.text}`}>{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 text-[13px] leading-[1.7] text-foreground/85"
          >
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${colorClass.text} bg-current`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// 7. 예상 수익 시뮬레이션
// ============================================================

function RevenueSection({ analysis }: { analysis: TerritoryAnalysis }) {
  const { revenue, demand } = analysis;
  const stdSignups = demand.standardSignupsPerMonth;

  return (
    <section className="mb-10">
      <SectionHeader
        icon={TrendingUp}
        eyebrow="REVENUE PROJECTION"
        title="예상 수익 시뮬레이션"
        subtitle={`표준 시나리오 (월 신규등록 ${stdSignups}명) 기준`}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        <BigStat
          label="월 매출"
          value={revenue.monthlyRevenue.toLocaleString()}
          unit="만원"
        />
        <BigStat
          label="월 고정비"
          value={revenue.monthlyFixedCost.toLocaleString()}
          unit="만원"
        />
        <BigStat
          label="본사 공급원가 (22.5%)"
          value={revenue.monthlyCogs.toLocaleString()}
          unit="만원"
        />
        <BigStat
          label="월 순이익"
          value={revenue.monthlyProfit.toLocaleString()}
          unit="만원"
          tone={revenue.monthlyProfit > 0 ? "success" : "danger"}
        />
      </div>

      {/* 12개월 + BEP */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
            12-MONTH PROJECTION
          </p>
          <p className="mt-2 text-[40px] font-black leading-none text-primary">
            {revenue.yearlyProfit > 0 ? "+" : ""}
            {revenue.yearlyProfit.toLocaleString()}
            <span className="ml-1 text-[14px]">만원</span>
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            월 표준 시나리오 12개월 누적 순이익 (1억원 초기투자 회수 기준)
          </p>
          <div className="mt-3 rounded-lg bg-muted/30 p-2.5 text-[11px]">
            예상 회수 시점:{" "}
            <strong className="text-primary">
              {revenue.monthlyProfit > 0
                ? `${Math.ceil(10000 / revenue.monthlyProfit)}개월`
                : "BEP 미달"}
            </strong>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary">
            BEP · 손익분기점
          </p>
          <p className="mt-2 text-[40px] font-black leading-none text-primary">
            {revenue.bepSignups}
            <span className="ml-1 text-[14px]">명/월</span>
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            본사 공급원가 22.5% 차감 후 고정비 회수 가능 신규등록 수
          </p>
          <div className="mt-3 rounded-lg bg-primary/5 p-2.5 text-[11px]">
            본 입지 표준 시나리오{" "}
            <strong className="text-primary">{stdSignups}명</strong> →{" "}
            {stdSignups >= revenue.bepSignups ? (
              <span className="font-bold text-emerald-600">
                BEP +{stdSignups - revenue.bepSignups}명 초과 달성
              </span>
            ) : (
              <span className="font-bold text-rose-600">
                BEP까지 {revenue.bepSignups - stdSignups}명 부족
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-[12px] leading-[1.7]">
        <strong className="text-primary">※ 본사 공급원가 22.5% 구조</strong> —
        매출의 77.5%가 가맹점주에게 남는 구조로, 동종 교육 프랜차이즈 대비
        가맹점주 마진이 강합니다. 공급원가 = 로얄티 10% + 앱교재비 12.5%.
      </div>
    </section>
  );
}

function BigStat({
  label,
  value,
  unit,
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit: string;
  tone?: "default" | "success" | "danger";
}) {
  const numColor =
    tone === "success"
      ? "text-emerald-600"
      : tone === "danger"
        ? "text-rose-600"
        : "text-foreground";
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-2 text-[26px] font-black leading-none ${numColor}`}>
        {tone === "success" && Number(value) > 0 ? "+" : ""}
        {value}
        <span className="ml-1 text-[12px] font-bold text-foreground/60">
          {unit}
        </span>
      </p>
    </div>
  );
}

// ============================================================
// 8. CTA
// ============================================================

function CTASection({ analysis }: { analysis: TerritoryAnalysis }) {
  return (
    <section className="mt-12 print:hidden">
      <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.32_0.18_290)] p-8 text-white sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.28_0.20_290)] via-transparent to-[oklch(0.20_0.18_290)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-white/85">
              NEXT STEP
            </p>
            <h2 className="mt-2 text-[26px] font-black leading-[1.15] sm:text-[32px]">
              본 분석 결과로
              <br />
              가맹 전담 매니저와 1:1 상담을 받아보세요.
            </h2>
            <p className="mt-3 max-w-[480px] text-[13px] leading-[1.7] text-white/85 sm:text-[14px]">
              현장 답사·임대 조건 검토·맞춤 마케팅 플랜까지 무료로 제공합니다.
              본 리포트는 PDF로 저장하여 전담 매니저에게 미리 공유하실 수
              있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-bold text-foreground transition-transform hover:translate-y-[-2px]"
            >
              상담 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:0507-1434-3226"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[14px] font-bold backdrop-blur transition-colors hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              0507-1434-3226
            </a>
          </div>
        </div>
        <p className="relative mt-6 border-t border-white/20 pt-4 text-[11px] text-white/65">
          분석 시각: {new Date(analysis.analyzedAt).toLocaleString("ko-KR")} ·
          본 리포트는 두비전 본사 데이터 모델 기반으로 자동 생성된 참고
          자료입니다.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// 공통: 섹션 헤더
// ============================================================

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-1.5 text-[22px] font-black leading-[1.2] tracking-[-0.01em] sm:text-[26px]">
          {title}
        </h2>
        <p className="mt-1 text-[12px] text-muted-foreground sm:text-[13px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
