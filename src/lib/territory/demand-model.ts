// ============================================================
// 두비전 수요 추정 모델
// ============================================================
// 직영 3개 센터의 6년치 데이터를 기반으로 한 경험적 공식.
// 향후 실제 가맹점 데이터가 누적되면 계수를 보정합니다.
// ============================================================

import type {
  Academy,
  ApartmentCluster,
  DemandEstimate,
  Demographics,
  RevenueProjection,
  School,
  TerritoryScore,
} from "./types";

// ----------------------------------------------------------
// 잠재 수요 추정
// ----------------------------------------------------------
// 공식:
//   잠재회원 = (반경내 초·중 학생수) × 두비전타겟비율(60%) ×
//             학원수강가능소득가구비율 × 침투율(베이스 1.5%)
//   - 침투율은 경쟁강도/소득에 따라 보정
//
// 월 신규등록 = 잠재회원 / 평균등록기간(개월) × 시나리오계수
//   - 평균 등록 기간: 9개월 (직영 평균)
//   - 보수형: 0.4 / 표준형: 0.7 / 공격형: 1.1
// ----------------------------------------------------------

const TARGET_AGE_RATIO = 0.6; // 8-19세 중 두비전 타겟(초3-중2 등) 비율
const AVG_RETENTION_MONTHS = 9; // 평균 회원 유지 개월
const BASE_PENETRATION = 0.015; // 베이스 침투율 1.5%

export function estimateDemand(
  schools: School[],
  academies: Academy[],
  demographics: Demographics
): DemandEstimate {
  // 1) 반경 내 초·중 학생수 합계
  const elementaryStudents = schools
    .filter((s) => s.level === "초등")
    .reduce((sum, s) => sum + s.studentCount, 0);
  const middleStudents = schools
    .filter((s) => s.level === "중학교")
    .reduce((sum, s) => sum + s.studentCount, 0);
  const targetStudents = elementaryStudents + middleStudents;

  // 2) 학원 수강 가능 소득 가구 비율
  //    사교육 지출 비율을 직접 가구 비중 근사값으로 활용
  const incomeRatio = Math.min(0.6, demographics.privateEduRatio / 100);

  // 3) 침투율 보정
  //    - 경쟁 학원 수가 많으면 침투율 ↓
  //    - 평균 소득이 높으면 침투율 ↑
  const competitorCount = academies.filter((a) => a.isCompetitor).length;
  const competitionFactor = Math.max(0.5, 1 - competitorCount * 0.08);
  const incomeFactor =
    demographics.avgHouseholdIncome > 8000
      ? 1.3
      : demographics.avgHouseholdIncome > 6000
        ? 1.1
        : demographics.avgHouseholdIncome > 4500
          ? 1.0
          : 0.85;
  const penetration = BASE_PENETRATION * competitionFactor * incomeFactor;

  // 4) 잠재 회원수
  const potentialMembers = Math.round(
    targetStudents * TARGET_AGE_RATIO * incomeRatio * penetration
  );

  // 5) 월 신규등록 = 잠재회원 / 평균유지기간 × 시나리오 계수
  const baseMonthly = potentialMembers / AVG_RETENTION_MONTHS;
  const conservativeSignupsPerMonth = Math.max(2, Math.round(baseMonthly * 0.4));
  const standardSignupsPerMonth = Math.max(3, Math.round(baseMonthly * 0.7));
  const aggressiveSignupsPerMonth = Math.max(4, Math.round(baseMonthly * 1.1));

  // 6) 계산 근거 (UI 표시용)
  const rationale = [
    `반경 내 초·중 학생수 합계: ${targetStudents.toLocaleString()}명`,
    `두비전 타겟 연령 비율: ${(TARGET_AGE_RATIO * 100).toFixed(0)}%`,
    `사교육 지출 가구 비율: ${(incomeRatio * 100).toFixed(1)}%`,
    `직영 평균 침투율 1.5% × 경쟁보정 ${competitionFactor.toFixed(2)} × 소득보정 ${incomeFactor.toFixed(2)} = ${(penetration * 100).toFixed(2)}%`,
    `→ 잠재 회원수 ${potentialMembers}명 (반경 내 동시 수강 가능 추정)`,
    `→ 평균 유지 9개월 가정 시 월 신규 베이스 ${baseMonthly.toFixed(1)}명`,
  ];

  return {
    potentialMembers,
    conservativeSignupsPerMonth,
    standardSignupsPerMonth,
    aggressiveSignupsPerMonth,
    rationale,
  };
}

// ----------------------------------------------------------
// 사업성 점수 (S/A/B/C/D)
// ----------------------------------------------------------

export function calculateScore(
  schools: School[],
  academies: Academy[],
  apartments: ApartmentCluster[],
  demographics: Demographics
): TerritoryScore {
  // 학생 밀도 (반경 내 초·중 학생수)
  const targetStudents = schools
    .filter((s) => s.level === "초등" || s.level === "중학교")
    .reduce((sum, s) => sum + s.studentCount, 0);
  const studentDensity = clamp((targetStudents / 6000) * 100, 0, 100);

  // 소득 점수 (가구당 평균소득)
  const income = clamp(
    ((demographics.avgHouseholdIncome - 3000) / 7000) * 100,
    0,
    100
  );

  // 경쟁 강도 (경쟁 학원 수가 적을수록 높음)
  const competitorCount = academies.filter((a) => a.isCompetitor).length;
  const competition = clamp(100 - competitorCount * 12, 0, 100);

  // 접근성 (가장 가까운 학교까지 거리)
  const closestSchool = Math.min(
    ...schools.map((s) => s.distanceM),
    9999
  );
  const accessibility = clamp(100 - (closestSchool / 1500) * 100, 0, 100);

  // 인구 밀도 (반경 내 학령 인구)
  const populationDensity = clamp(
    (demographics.schoolAgePopulation / 8000) * 100,
    0,
    100
  );

  // 가중 평균
  const score = Math.round(
    studentDensity * 0.3 +
      income * 0.2 +
      competition * 0.2 +
      accessibility * 0.15 +
      populationDensity * 0.15
  );

  const grade: TerritoryScore["grade"] =
    score >= 85 ? "S" : score >= 72 ? "A" : score >= 58 ? "B" : score >= 42 ? "C" : "D";

  return {
    grade,
    score,
    breakdown: {
      studentDensity: Math.round(studentDensity),
      income: Math.round(income),
      competition: Math.round(competition),
      accessibility: Math.round(accessibility),
      populationDensity: Math.round(populationDensity),
    },
  };
}

// ----------------------------------------------------------
// 수익 프로젝션 (표준 시나리오 기준)
// ----------------------------------------------------------

const PREPAY_PER_MEMBER = 480; // 6개월 선불 480만원
const FIXED_COST = 1450; // 고정 운영비 (만원/월) — 임대+인건비+세금/홍보+기타
const COGS_RATIO = 0.225; // 본사 공급원가 22.5% (로얄티 10% + 앱교재비 12.5%)

export function projectRevenue(signupsPerMonth: number): RevenueProjection {
  const monthlyRevenue = signupsPerMonth * PREPAY_PER_MEMBER;
  const monthlyCogs = Math.round(monthlyRevenue * COGS_RATIO);
  const monthlyProfit = monthlyRevenue - FIXED_COST - monthlyCogs;
  // BEP: revenue × (1 - 0.225) = FIXED_COST → revenue = FIXED_COST / 0.775
  const bepSignups = Math.ceil(FIXED_COST / 0.775 / PREPAY_PER_MEMBER);
  const yearlyProfit = monthlyProfit * 12;

  return {
    monthlyRevenue,
    monthlyFixedCost: FIXED_COST,
    monthlyCogs,
    monthlyProfit,
    bepSignups,
    yearlyProfit,
  };
}

// ----------------------------------------------------------
// helpers
// ----------------------------------------------------------

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
