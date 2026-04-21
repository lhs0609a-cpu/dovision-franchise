// ============================================================
// Path to Profit — 6개월 선불 현금흐름 모델
// ============================================================
// 두비전은 "6개월 선불 480만원"으로 등록비를 일시불 수납합니다.
// 따라서 매출을 월 80만원씩 분할 인식(accrual)하면 실제 현금흐름을
// 심하게 과소 평가합니다 — 가맹점주 입장의 BEP·회수기간은 "통장에
// 얼마가 들어오는가"로 결정되기 때문입니다.
//
// 이 모델은 cash-basis:
//   1) 신규 등록 발생 시점에 480만원 일시불 수납
//   2) 등록 후 6개월 경과 시 retention 확률로 재등록(= 또 480만원)
//   3) 활성회원 = 현재 선불 유효기간(6개월) 내 회원 수
//
// 가맹사업법 §9 고지 의무 — 보수/표준/공격 3시나리오 + 가정 공개.
// ============================================================

export type Scenario = "conservative" | "standard" | "aggressive";

export type MonthlyProjection = {
  /** 개업 후 N개월차 (1 시작) */
  month: number;
  /** 해당 월 신규 등록 (브랜드 첫 수강, 명) */
  newSignups: number;
  /** 해당 월 재등록 (기존 회원이 6개월 후 재결제, 명) */
  renewals: number;
  /** 해당 월 총 등록 결제 건수 (신규 + 재등록) */
  totalEnrollments: number;
  /** 월말 활성 회원 (현재 선불 유효기간 내) */
  activeMembers: number;
  /** 월 매출 (만원) = 등록건수 × 480만원 */
  monthlyRevenue: number;
  /** 본사 공급원가 22.5% (만원) */
  monthlyCogs: number;
  /** 가맹주 마케팅 지출 (만원) */
  monthlyMarketing: number;
  /** 마케팅 외 고정비 (만원) — 임대·인건비·세금·기타 */
  monthlyFixedCost: number;
  /** 월 순이익 (만원) */
  monthlyProfit: number;
  /** 누적 순이익 (만원) */
  cumulativeProfit: number;
};

export type PathToProfit = {
  scenario: Scenario;
  /** 월 마케팅 예산 (만원) */
  marketingBudget: number;
  /** 월별 상세 투영 (24개월) */
  monthly: MonthlyProjection[];
  /** BEP: 해당 월의 단일 월 순이익이 처음 ≥0이 되는 달 (null=미도달) */
  bepMonth: number | null;
  /** 12개월 누적 순이익 (만원) */
  cumulative12M: number;
  /** 24개월 누적 순이익 (만원) */
  cumulative24M: number;
  /** 초기 투자 1억 회수까지 걸리는 달 (null=24개월 내 미회수) */
  paybackMonth: number | null;
  /** 피크 활성 회원 */
  peakActiveMembers: number;
};

// ============================================================
// 상수 (직영 실적 기반 — 추후 본사 관리자 페이지에서 편집 가능하게 이관)
// ============================================================

/** 1회 등록 선불 결제액 (만원) — 6개월 수강권 */
const ENROLLMENT_FEE = 480;

/** 1개 등록이 커버하는 기간 (개월) */
const ENROLLMENT_MONTHS = 6;

/** 본사 공급원가 비율 (로열티 10% + 앱교재비 12.5%) */
const COGS_RATIO = 0.225;

/** 마케팅 외 월 고정비 (만원) — 임대 400 + 인건비 700 + 세금·기타 200 */
const BASELINE_FIXED_COST = 1300;

/** 기본 월 마케팅 예산 (만원) — 3개 시나리오 */
const MARKETING_BY_SCENARIO: Record<Scenario, number> = {
  conservative: 150,
  standard: 250,
  aggressive: 400,
};

/** 초기 투자금 (만원) — 가맹비·인테리어·교육비·보증금 합산 약 1억 */
const INITIAL_INVESTMENT = 10000;

/**
 * 세대별 재등록 확률 — 한번 연장한 회원일수록 유지율 상승(성과 체감 + 몰입)
 *  - 신규 → 1차 재등록 (첫 6개월 후)  : 0.65
 *  - 1차 → 2차 재등록 (12개월차)       : 0.75
 *  - 2차 → 3차 재등록 (18개월차)       : 0.80
 *  - 3차 이상 장기 회원                : 0.85
 * 직영 3개 센터 평균. 장기 수강생 비중 반영.
 */
const RENEWAL_RATE_BY_GENERATION: readonly number[] = [0.65, 0.75, 0.80, 0.85];

function renewalRateForGen(gen: number): number {
  return (
    RENEWAL_RATE_BY_GENERATION[gen] ??
    RENEWAL_RATE_BY_GENERATION[RENEWAL_RATE_BY_GENERATION.length - 1]
  );
}

// ============================================================
// 램프 곡선 — 월별 신규 등록 수 (steady state에 수렴)
// ============================================================

/**
 * S-curve로 steady state에 수렴. 마케팅 예산이 클수록 램프 속도·상한 증가.
 */
function newSignupsAt(
  month: number,
  steadySignups: number,
  marketingBudget: number
): number {
  // 램프 속도 k: 150만원→0.18 / 250만원→0.29 / 400만원→0.40
  const k = 0.10 + (marketingBudget / 400) * 0.30;
  // 유입 상한 배수: 150만원→0.74 / 250만원→0.91 / 400만원→1.15
  const ceiling = 0.5 + (marketingBudget / 400) * 0.65;
  const effectiveSteady = steadySignups * ceiling;
  return effectiveSteady * (1 - Math.exp(-k * month));
}

// ============================================================
// 단일 시나리오 시뮬레이션 (cash-basis)
// ============================================================

export function simulatePath(
  scenario: Scenario,
  steadySignups: number,
  monthCount = 24,
  marketingBudgetOverride?: number
): PathToProfit {
  const marketingBudget =
    marketingBudgetOverride ?? MARKETING_BY_SCENARIO[scenario];

  const monthly: MonthlyProjection[] = [];
  // enrollmentsByGen[m-1] = { gen: count } — 해당 월 등록 건을 세대별로 분해
  //   gen 0 = 신규 첫 결제, gen 1 = 1차 재등록, gen 2 = 2차 재등록, ...
  const enrollmentsByGen: Record<number, number>[] = [];
  let cumulativeProfit = 0;

  for (let m = 1; m <= monthCount; m++) {
    const thisMonth: Record<number, number> = {};

    // 1) 신규 등록 (gen 0)
    const newSignups = newSignupsAt(m, steadySignups, marketingBudget);
    thisMonth[0] = newSignups;

    // 2) 재등록 — 6개월 전 등록 각 세대별로 해당 세대 재등록률 적용
    let renewals = 0;
    if (m > ENROLLMENT_MONTHS) {
      const prev = enrollmentsByGen[m - ENROLLMENT_MONTHS - 1] ?? {};
      for (const [genStr, count] of Object.entries(prev)) {
        const gen = Number(genStr);
        const rate = renewalRateForGen(gen);
        const renewed = count * rate;
        thisMonth[gen + 1] = (thisMonth[gen + 1] ?? 0) + renewed;
        renewals += renewed;
      }
    }

    const totalEnrollments = newSignups + renewals;
    enrollmentsByGen.push(thisMonth);

    // 3) 활성 회원 = 과거 6개월 내 등록건의 총합 (세대 무관)
    let activeMembers = 0;
    for (
      let idx = Math.max(0, m - ENROLLMENT_MONTHS);
      idx < m;
      idx++
    ) {
      const monthEnrollments = enrollmentsByGen[idx];
      if (!monthEnrollments) continue;
      for (const count of Object.values(monthEnrollments)) {
        activeMembers += count;
      }
    }

    // 4) 현금 수입 (일시불)
    const monthlyRevenue = totalEnrollments * ENROLLMENT_FEE;
    const monthlyCogs = monthlyRevenue * COGS_RATIO;
    const monthlyFixedCost = BASELINE_FIXED_COST;
    const monthlyMarketing = marketingBudget;
    const monthlyProfit =
      monthlyRevenue - monthlyCogs - monthlyFixedCost - monthlyMarketing;
    cumulativeProfit += monthlyProfit;

    monthly.push({
      month: m,
      newSignups: round(newSignups, 1),
      renewals: round(renewals, 1),
      totalEnrollments: round(totalEnrollments, 1),
      activeMembers: round(activeMembers, 1),
      monthlyRevenue: round(monthlyRevenue),
      monthlyCogs: round(monthlyCogs),
      monthlyMarketing,
      monthlyFixedCost,
      monthlyProfit: round(monthlyProfit),
      cumulativeProfit: round(cumulativeProfit),
    });
  }

  const bepMonth =
    monthly.find((x) => x.monthlyProfit >= 0)?.month ?? null;
  const paybackMonth =
    monthly.find((x) => x.cumulativeProfit >= INITIAL_INVESTMENT)?.month ??
    null;
  const cumulative12M = monthly[11]?.cumulativeProfit ?? 0;
  const cumulative24M = monthly[monthCount - 1]?.cumulativeProfit ?? 0;
  const peakActiveMembers = Math.round(
    Math.max(...monthly.map((x) => x.activeMembers))
  );

  return {
    scenario,
    marketingBudget,
    monthly,
    bepMonth,
    cumulative12M,
    cumulative24M,
    paybackMonth,
    peakActiveMembers,
  };
}

// ============================================================
// 3시나리오 번들 시뮬레이션
// ============================================================

export type PathToProfitBundle = {
  conservative: PathToProfit;
  standard: PathToProfit;
  aggressive: PathToProfit;
};

export function simulateAllPaths(
  steadyPerScenario: {
    conservative: number;
    standard: number;
    aggressive: number;
  },
  monthCount = 24,
  marketingOverride?: { standardBudget: number }
): PathToProfitBundle {
  const stdBudget =
    marketingOverride?.standardBudget ?? MARKETING_BY_SCENARIO.standard;
  const consBudget = Math.max(50, stdBudget - 100);
  const aggBudget = stdBudget + 150;

  return {
    conservative: simulatePath(
      "conservative",
      steadyPerScenario.conservative,
      monthCount,
      consBudget
    ),
    standard: simulatePath(
      "standard",
      steadyPerScenario.standard,
      monthCount,
      stdBudget
    ),
    aggressive: simulatePath(
      "aggressive",
      steadyPerScenario.aggressive,
      monthCount,
      aggBudget
    ),
  };
}

// ============================================================
// helpers
// ============================================================

function round(v: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(v * factor) / factor;
}

// ============================================================
// 내보낼 상수 (UI 슬라이더·Accordion 참고용)
// ============================================================

export const RAMP_MODEL_CONSTANTS = {
  ENROLLMENT_FEE,
  ENROLLMENT_MONTHS,
  COGS_RATIO,
  BASELINE_FIXED_COST,
  MARKETING_BY_SCENARIO,
  INITIAL_INVESTMENT,
  RENEWAL_RATE_BY_GENERATION,
} as const;
