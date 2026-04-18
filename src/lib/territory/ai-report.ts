// ============================================================
// AI 리포트 생성기 (템플릿 기반)
// ============================================================
// 입력 데이터에 따라 강점/약점/추천 전략을 결정론적으로 생성합니다.
// 향후 OpenAI/Anthropic API를 호출하도록 교체할 수 있게,
// generateAIReport(input) → AIReport 시그니처를 유지합니다.
// ============================================================

import type {
  AIReport,
  Academy,
  ApartmentCluster,
  DemandEstimate,
  Demographics,
  RevenueProjection,
  School,
  TerritoryScore,
} from "./types";

export type ReportInput = {
  address: string;
  schools: School[];
  academies: Academy[];
  apartments: ApartmentCluster[];
  demographics: Demographics;
  demand: DemandEstimate;
  revenue: RevenueProjection;
  score: TerritoryScore;
};

export function generateAIReport(input: ReportInput): AIReport {
  const {
    address,
    schools,
    academies,
    apartments,
    demographics,
    demand,
    revenue,
    score,
  } = input;

  const elementaryCount = schools.filter((s) => s.level === "초등").length;
  const middleCount = schools.filter((s) => s.level === "중학교").length;
  const totalStudents = schools
    .filter((s) => s.level === "초등" || s.level === "중학교")
    .reduce((sum, s) => sum + s.studentCount, 0);
  const competitorCount = academies.filter((a) => a.isCompetitor).length;
  const avgAptPrice = apartments.length
    ? Math.round(
        apartments.reduce((sum, a) => sum + a.avgPriceMillion, 0) /
          apartments.length
      )
    : 0;

  // ---- 헤드라인 ----
  const headline = (() => {
    switch (score.grade) {
      case "S":
        return `${address} 일대는 두비전 가맹의 최우선 추천 입지(S급)입니다.`;
      case "A":
        return `${address} 일대는 두비전 가맹에 매우 적합한 우수 입지(A급)입니다.`;
      case "B":
        return `${address} 일대는 안정적인 운영이 가능한 양호한 입지(B급)입니다.`;
      case "C":
        return `${address} 일대는 운영 가능하나 마케팅 강화가 필요한 보통 입지(C급)입니다.`;
      default:
        return `${address} 일대는 신중한 검토가 필요한 입지(D급)입니다. 다른 후보지와 비교를 권장드립니다.`;
    }
  })();

  // ---- 강점 ----
  const strengths: string[] = [];
  if (totalStudents >= 4500) {
    strengths.push(
      `반경 내 초·중학교 학생수 ${totalStudents.toLocaleString()}명 — 두비전 핵심 타겟이 풍부합니다.`
    );
  }
  if (elementaryCount >= 3) {
    strengths.push(
      `초등학교 ${elementaryCount}곳이 반경 내에 위치 — 학부모 입소문 전파 속도가 빠른 권역입니다.`
    );
  }
  if (demographics.avgHouseholdIncome >= 7000) {
    strengths.push(
      `평균 가구 소득 ${(demographics.avgHouseholdIncome / 10000).toFixed(1)}억원 — 월 80만원 등록비에 대한 저항이 낮은 구매력입니다.`
    );
  }
  if (demographics.privateEduRatio >= 40) {
    strengths.push(
      `사교육 지출 가구 비율 ${demographics.privateEduRatio}% — 학원 시장이 이미 활성화된 권역으로 수요 검증이 끝나 있습니다.`
    );
  }
  if (avgAptPrice >= 100000) {
    strengths.push(
      `주변 아파트 평균 매매가 ${(avgAptPrice / 10000).toFixed(1)}억원 — 안정적 거주층으로 회원 이탈률이 낮을 것으로 예상됩니다.`
    );
  }
  if (competitorCount <= 2) {
    strengths.push(
      `직접 경쟁 학원(사고력·뇌교육) ${competitorCount}곳 — 두비전 특허 프로그램의 차별화 효과가 극대화됩니다.`
    );
  }
  if (strengths.length === 0) {
    strengths.push(
      "두비전의 25년 노하우와 본사 슈퍼바이저 지원으로 평균 이상의 운영 성과가 가능합니다."
    );
  }

  // ---- 약점·리스크 ----
  const weaknesses: string[] = [];
  if (totalStudents < 3000) {
    weaknesses.push(
      `반경 내 초·중 학생수 ${totalStudents.toLocaleString()}명 — 두비전 평균 권장치(4,500명) 대비 부족. 반경 확대 또는 학교 셔틀 운영이 필요할 수 있습니다.`
    );
  }
  if (competitorCount >= 5) {
    weaknesses.push(
      `직접 경쟁 학원이 ${competitorCount}곳으로 다수 — 차별화 메시지(특허·BTS 검사·뉴로피드백) 강조가 필수입니다.`
    );
  }
  if (demographics.avgHouseholdIncome < 5000) {
    weaknesses.push(
      `평균 가구 소득이 권장 기준 대비 낮습니다 — 6개월 선불 480만원 부담이 등록 전환을 어렵게 할 수 있어 분납 옵션 검토가 권장됩니다.`
    );
  }
  if (demographics.privateEduRatio < 30) {
    weaknesses.push(
      `사교육 지출 가구 비율이 낮은 권역 — 두비전을 처음 접하는 학부모를 대상으로 한 무료 BTS 검사 이벤트가 효과적입니다.`
    );
  }
  if (schools.length > 0 && schools[0].distanceM > 800) {
    weaknesses.push(
      `가장 가까운 학교까지 ${schools[0].distanceM}m — 학생 도보 접근성이 낮아 학부모 자가 등하원 의존도가 높을 수 있습니다.`
    );
  }
  if (weaknesses.length === 0) {
    weaknesses.push(
      "현재 데이터 기준 명확한 리스크 요인은 발견되지 않았습니다. 임대 조건과 가시성을 추가 검토 권장."
    );
  }

  // ---- 마케팅 전략 ----
  const marketingStrategy: string[] = [];

  // 학교 타깃
  const topSchool = schools[0];
  if (topSchool) {
    marketingStrategy.push(
      `오픈 첫 달 ${topSchool.name} 학부모 대상 무료 BTS 뇌기능검사 이벤트 — 200명 검사 → 60명 상담 → 15명 등록을 직영 평균 KPI로 합니다.`
    );
  }

  // 경쟁 강도 기반
  if (competitorCount >= 5) {
    marketingStrategy.push(
      `차별화 메시지 집중: "특허 등록된 이미지전환기억법" + "EEG 뉴로피드백" + "3개월 BTS 재검사 그래프 리포트" 3종 세트로 학원 비교 우위를 명확히 합니다.`
    );
  } else {
    marketingStrategy.push(
      `경쟁이 적은 권역 — 두비전 = "뇌교육 카테고리 1등" 인식 선점 전략. 지역 카페·맘카페 콘텐츠 마케팅에 오픈 마케팅 예산의 60% 집중.`
    );
  }

  // 인구·소득 기반
  if (demographics.avgHouseholdIncome >= 7000) {
    marketingStrategy.push(
      `프리미엄 포지셔닝 — "특허 기술 + 그래프 리포트"로 객단가 유지. 할인 마케팅 대신 "한 번 등록 = 6개월 보장 성과" 메시지가 효과적입니다.`
    );
  } else {
    marketingStrategy.push(
      `등록 진입장벽 완화 — "1주 무료 체험 + BTS 검사 무료"로 첫 경험 비용을 0원에 가깝게 설정 후 6개월 등록 전환을 유도합니다.`
    );
  }

  // 아파트 기반
  if (apartments.length >= 5) {
    marketingStrategy.push(
      `반경 내 ${apartments.length}개 아파트 단지 게시판·관리사무소 제휴 마케팅 — 단지별 학부모 모임 활용으로 추천 기반 등록 비율을 ${competitorCount >= 5 ? "30%" : "45%"} 이상 확보 가능합니다.`
    );
  }

  // ---- 종합 의견 ----
  const conclusion = (() => {
    const monthly = revenue.monthlyProfit;
    const stdSignups = demand.standardSignupsPerMonth;
    const monthlyText =
      monthly > 0
        ? `표준 시나리오 기준 월 순이익 ${monthly.toLocaleString()}만원`
        : `표준 시나리오 기준 BEP 미달 (월 ${Math.abs(monthly).toLocaleString()}만원 적자)`;

    switch (score.grade) {
      case "S":
        return `${address} 일대는 두비전이 추구하는 모든 입지 조건을 충족합니다. 표준 시나리오(월 신규 ${stdSignups}명)에서 ${monthlyText}이 예상되며, 본사가 우선 추천하는 권역입니다. 임대 조건 협상에 적극적으로 임할 가치가 있습니다.`;
      case "A":
        return `${address} 일대는 두비전 가맹점주에게 우수한 사업 환경을 제공합니다. 표준 시나리오(월 신규 ${stdSignups}명)에서 ${monthlyText}이 예상됩니다. 약점 항목을 마케팅 전략으로 보완하면 S급 운영도 충분히 가능합니다.`;
      case "B":
        return `${address} 일대는 안정적 운영이 가능한 양호한 입지입니다. 표준 시나리오(월 신규 ${stdSignups}명)에서 ${monthlyText}이 예상되며, 본사 슈퍼바이저 지원과 적극적 마케팅으로 A급 성과를 노릴 수 있습니다.`;
      case "C":
        return `${address} 일대는 운영은 가능하지만 BEP 도달까지 마케팅 강도가 평균 이상으로 필요합니다. 표준 시나리오(월 신규 ${stdSignups}명)에서 ${monthlyText} 수준이며, 인근에 더 좋은 후보지가 있는지 비교 검토를 권장드립니다.`;
      default:
        return `${address} 일대는 본사 데이터 기준 우선 추천 입지가 아닙니다. ${monthlyText}으로 추정되며, 다른 권역과 반드시 비교 검토 후 결정하시기를 권장드립니다.`;
    }
  })();

  return {
    headline,
    strengths,
    weaknesses,
    marketingStrategy,
    conclusion,
  };
}
