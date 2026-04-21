// ============================================================
// 상권분석 도메인 타입 정의
// ============================================================
// 이 타입은 mock 데이터와 실제 API(카카오/NEIS/국토부) 양쪽이
// 동일하게 따르는 계약입니다. 향후 API 연동 시 mock-data.ts의
// generateTerritoryData() 함수만 실제 API 호출로 교체하면 됩니다.

export type TerritoryInput = {
  /** 사용자가 입력한 주소 또는 지역명 */
  address: string;
  /** 위도 (지도 클릭/검색 시 설정) */
  lat?: number;
  /** 경도 (지도 클릭/검색 시 설정) */
  lng?: number;
  /** 분석 반경 (km), 기본 2km */
  radiusKm: number;
};

/** 데이터 출처 */
export type DataSource = "kakao-local-api" | "mock-simulation";

export type School = {
  name: string;
  level: "초등" | "중학교" | "고등학교";
  /** 학생수 (NEIS 연동 전까지는 평균 추정치) */
  studentCount: number;
  /** 후보 입지로부터의 직선거리 (m) */
  distanceM: number;
  /** 실제 좌표 (실데이터일 때만, 지도 렌더링용) */
  lat?: number;
  lng?: number;
  /** 카카오 상세 주소 (실제 데이터일 때만) */
  address?: string;
  /** 카카오 장소 상세 URL (검증용, 실제 데이터일 때만) */
  placeUrl?: string;
  /** true면 일부 필드가 추정값 (예: studentCount) */
  estimated?: boolean;
};

export type Academy = {
  name: string;
  category: "교과" | "외국어" | "예체능" | "사고력·뇌교육";
  /** 두비전과 직접 경쟁하는지 여부 */
  isCompetitor: boolean;
  distanceM: number;
  lat?: number;
  lng?: number;
  address?: string;
  placeUrl?: string;
};

export type ApartmentCluster = {
  name: string;
  /** 가구수 (국토부 API 연동 전까지는 0 또는 추정치) */
  households: number;
  /** 평균 매매가 (만원) — 국토부 API 연동 전까지 0 또는 추정치 */
  avgPriceMillion: number;
  /** 평균 평형 (평) */
  avgPyeong: number;
  distanceM: number;
  lat?: number;
  lng?: number;
  address?: string;
  placeUrl?: string;
  estimated?: boolean;
};

export type Demographics = {
  /** 반경 내 총 인구 */
  totalPopulation: number;
  /** 8-19세 학령 인구 */
  schoolAgePopulation: number;
  /** 평균 가구 소득 (만원/년) */
  avgHouseholdIncome: number;
  /** 사교육 지출 비율 (%) */
  privateEduRatio: number;
};

export type DemandEstimate = {
  /** 잠재 회원수 (반경 내, 두비전 타겟) */
  potentialMembers: number;
  /** 보수적 월 신규등록 추정 */
  conservativeSignupsPerMonth: number;
  /** 표준 월 신규등록 추정 */
  standardSignupsPerMonth: number;
  /** 공격적 월 신규등록 추정 */
  aggressiveSignupsPerMonth: number;
  /** 계산 근거 (UI 표시용) */
  rationale: string[];
};

export type RevenueProjection = {
  /** 월 매출 (만원) — 표준 시나리오 */
  monthlyRevenue: number;
  /** 월 고정비 (만원) */
  monthlyFixedCost: number;
  /** 본사 공급원가 (매출 × 22.5%, 만원) */
  monthlyCogs: number;
  /** 월 순이익 (만원) */
  monthlyProfit: number;
  /** BEP까지 신규등록 (월) */
  bepSignups: number;
  /** 12개월 누적 순이익 */
  yearlyProfit: number;
};

export type TerritoryScore = {
  /** S / A / B / C / D 등급 */
  grade: "S" | "A" | "B" | "C" | "D";
  /** 0~100 점수 */
  score: number;
  /** 5개 항목별 점수 (학생인구·가구소득·경쟁강도·접근성·인구밀도) */
  breakdown: {
    studentDensity: number;
    income: number;
    competition: number;
    accessibility: number;
    populationDensity: number;
  };
};

export type AIReport = {
  /** 한 줄 요약 */
  headline: string;
  /** 강점 항목 */
  strengths: string[];
  /** 약점·리스크 항목 */
  weaknesses: string[];
  /** 추천 마케팅 전략 */
  marketingStrategy: string[];
  /** 종합 의견 (3-5문장) */
  conclusion: string;
};

export type TerritoryAnalysis = {
  input: TerritoryInput;
  schools: School[];
  academies: Academy[];
  apartments: ApartmentCluster[];
  demographics: Demographics;
  demand: DemandEstimate;
  revenue: RevenueProjection;
  score: TerritoryScore;
  report: AIReport;
  /** 분석 실행 시각 (ISO 문자열) */
  analyzedAt: string;
  /** 데이터 출처 */
  dataSource: DataSource;
  /** 실제 데이터 사용 여부 */
  isRealData: boolean;
};
