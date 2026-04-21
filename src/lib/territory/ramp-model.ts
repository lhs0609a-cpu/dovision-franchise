// ============================================================
// Path to Profit — 램프업 + 코호트 + 월별 P&L 시뮬레이션
// ============================================================
// 기존 steady-state 모델(-334만원 영원 가정)의 한계:
//   - 개업 첫 달부터 3명 유지 전제 → 비현실적
//   - 시간축이 없어 BEP 도달 시점·투자회수기간 제시 불가
//
// 이 모델은 직영 3개 센터(강남/반포/위례)의 6년치 경험치를
// 두 개 곡선으로 요약:
//   1) Ramp: 월별 신규등록 → S-curve로 steady에 수렴
//   2) Cohort Retention: 등록 시점 대비 잔류율
//
// 가맹사업법 §9(허위·과장 광고 금지)를 고려해 보수/표준/공격
// 3시나리오를 항상 동시 제시합니다.
// ============================================================

export type Scenario = "conservative" | "standard" | "aggressive";

export type MonthlyProjection = {
  /** 개업 후 N개월차 (1 시작) */
  month: number;
  /** 해당 월 신규 등록 (명) */
  newSignups: number;
  /** 월말 활성 회원 (유지 중인 누적 회원) */
  activeMembers: number;
  /** 월 매출 (만원) — 회원 × 80만원 */
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
  /** 초기 투자 1억 회수까지 걸리는 달 (누적 순이익 ≥ 10,000, null=24개월 내 미회수) */
  paybackMonth: number | null;
  /** 피크 활성 회원 */
  peakActiveMembers: number;
};

// ============================================================
// 상수 (직영 실적 기반 — 본사 관리자 페이지에서 편집 가능하게 추후 이관)
// ============================================================

/** 회원 1명 월 수업료 (만원) — 6개월 선불 480만원 ÷ 6 */
const MONTHLY_FEE_PER_MEMBER = 80;

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

// ============================================================
// 코호트 유지 곡선 — 등록 후 N개월차 잔류율
// ============================================================
// 직영 평균: 1m=95%, 3m=85%, 6m=70%, 12m=50%, 18m=35%, 24m=25%
// ------------------------------------------------------------

function retention(monthsAfterSignup: number): number {
  if (monthsAfterSignup <= 0) return 1;
  // 지수 감쇠 기반 근사. R(m) = exp(-ln(2) * m / halfLife)
  // halfLife ~ 12개월에서 50% 되도록
  const halfLife = 12;
  return Math.max(0, Math.exp((-Math.LN2 * monthsAfterSignup) / halfLife));
}

// ============================================================
// 램프 곡선 — 월별 신규 등록 수 (steady state에 수렴)
// ============================================================

/**
 * S-curve로 steady state에 수렴.
 * 마케팅 예산이 크면 ramp 속도가 빠르고 상한도 약간 올라감.
 */
function newSignupsAt(
  month: number,
  steadySignups: number,
  marketingBudget: number
): number {
  // 램프 속도 k: 마케팅이 많을수록 빨리 찬다
  //   150만원 → k ≈ 0.18 (느림)
  //   250만원 → k ≈ 0.28
  //   400만원 → k ≈ 0.40 (빠름)
  const k = 0.10 + (marketingBudget / 400) * 0.30;

  // 유입 상한 배수 — 마케팅이 충분하면 steady보다 약간 더 높을 수도 있음
  //   150만원 → 0.75×
  //   250만원 → 0.95×
  //   400만원 → 1.15×
  const ceiling = 0.5 + (marketingBudget / 400) * 0.65;
  const effectiveSteady = steadySignups * ceiling;

  // 첫 달은 홍보만, 신규 유입 거의 없음 → 1-exp(-k*m)으로 자연스레 처리
  return effectiveSteady * (1 - Math.exp(-k * month));
}

// ============================================================
// 단일 시나리오 시뮬레이션
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
  // 코호트: index=등록된 월(1~m), value=최초 등록 인원
  const cohorts: number[] = [];
  let cumulativeProfit = 0;

  for (let m = 1; m <= monthCount; m++) {
    const newSignups = newSignupsAt(m, steadySignups, marketingBudget);
    cohorts.push(newSignups);

    // 월말 활성 회원 = 각 코호트의 retention 합
    let activeMembers = 0;
    for (let c = 0; c < cohorts.length; c++) {
      const monthsSinceSignup = m - (c + 1); // cohort c는 c+1월에 등록
      activeMembers += cohorts[c] * retention(monthsSinceSignup);
    }

    const monthlyRevenue = activeMembers * MONTHLY_FEE_PER_MEMBER;
    const monthlyCogs = monthlyRevenue * COGS_RATIO;
    const monthlyFixedCost = BASELINE_FIXED_COST;
    const monthlyMarketing = marketingBudget;
    const monthlyProfit =
      monthlyRevenue - monthlyCogs - monthlyFixedCost - monthlyMarketing;
    cumulativeProfit += monthlyProfit;

    monthly.push({
      month: m,
      newSignups: round(newSignups, 1),
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
  // 표준 예산 슬라이더를 움직이면 표준 시나리오만 교체하고,
  // 보수/공격은 표준 대비 -100/+150 만원 오프셋
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
// 내보낼 기본값 (UI 슬라이더·참고용)
// ============================================================

export const RAMP_MODEL_CONSTANTS = {
  MONTHLY_FEE_PER_MEMBER,
  COGS_RATIO,
  BASELINE_FIXED_COST,
  MARKETING_BY_SCENARIO,
  INITIAL_INVESTMENT,
} as const;
