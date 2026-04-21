// ============================================================
// AI 어드바이저 컨텍스트 수집 — 본사 최신 데이터 스냅샷
// ============================================================
// Claude에게 전달할 본사 운영 현황을 Markdown 표로 정리.
// prompt caching의 prefix 부분으로 사용되므로 deterministic 직렬화
// (정렬·안정 필드) 유지가 중요.
// ============================================================

import { prisma } from "@/lib/prisma";

export const ADVISOR_SYSTEM_PROMPT = `당신은 두비전(DOVISION) 가맹본부 운영을 보좌하는 AI 어드바이저입니다.
아래 "본사 현황 스냅샷"을 기반으로 담당자의 질문에 정확하고 실행 가능한 답변을 제공합니다.

두비전 비즈니스 모델:
- 창의융합 뇌교육 프로그램 (이미지 전환 기억법·뉴로피드백·BTS 5단계)
- 운영법인: ㈜키네스 / 대표: 김양수
- 6개월 선불 480만원 수납 (월 회비 80만원 상당)
- 본사 공급원가 22.5% (로열티 10% + 앱교재비 12.5%)
- 직영 3개 센터(강남·반포·위례) + 가맹 확장 중

답변 원칙:
1. 구체적 숫자 제시: "매출 높음" 금지 → "전월 대비 +12%(XXX만원)" 형식
2. 질문이 모호하면 해석을 명시하고 답변
3. 가맹사업법·학원법 등 법적 이슈가 얽힌 질문은 반드시 "법률 자문 권장" 명시
4. 해지 위험·매출 하락 지적 시 원인 추정 + 본사 대응책 함께 제시
5. 한국어로 답변, 핵심은 bullet로 정리`;

export async function collectBusinessContext(): Promise<string> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      franchisees,
      inquiries,
      recentInquiries,
      activeContract,
      contractStats,
      visits,
      training,
      checklistProgress,
    ] = await Promise.all([
      prisma.franchisee.findMany({
        select: {
          id: true,
          name: true,
          region: true,
          status: true,
          targetOpenDate: true,
          openedAt: true,
          createdAt: true,
          infoDisclosureReceivedAt: true,
          currentPhase: true,
        },
      }),
      prisma.inquiry.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.inquiry.findMany({
        where: { createdAt: { gte: lastMonth } },
        select: { createdAt: true, status: true, region: true },
      }),
      prisma.contractTemplate.findFirst({
        where: { isActive: true },
        select: { version: true, title: true, effectiveFrom: true },
      }),
      prisma.contractSignature.aggregate({
        where: { agreedAt: { not: null } },
        _count: { _all: true },
      }),
      prisma.supervisorVisit.findMany({
        orderBy: { scheduledAt: "desc" },
        take: 20,
        select: {
          scheduledAt: true,
          visitedAt: true,
          issues: true,
          franchisee: { select: { name: true, region: true } },
        },
      }),
      prisma.trainingCompletion.groupBy({
        by: ["franchiseeId"],
        _count: { _all: true },
      }),
      prisma.checklistProgress.groupBy({
        by: ["franchiseeId"],
        where: { isChecked: true },
        _count: { _all: true },
      }),
    ]);

    const operating = franchisees.filter((f) => f.status === "OPERATING");
    const onboarding = franchisees.filter((f) => f.status === "ONBOARDING");
    const terminated = franchisees.filter((f) => f.status === "TERMINATED");

    const inquiriesThisMonth = recentInquiries.filter(
      (i) => i.createdAt >= startOfMonth
    ).length;
    const inquiriesLastMonth = recentInquiries.filter(
      (i) => i.createdAt >= lastMonth && i.createdAt <= endOfLastMonth
    ).length;
    const regionCounts = new Map<string, number>();
    for (const i of recentInquiries) {
      regionCounts.set(i.region, (regionCounts.get(i.region) ?? 0) + 1);
    }
    const topRegions = Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const completedVisits = visits.filter((v) => v.visitedAt);
    const pendingVisits = visits.filter(
      (v) => !v.visitedAt && new Date(v.scheduledAt) < now
    );
    const visitIssues = completedVisits
      .filter((v) => v.issues)
      .slice(0, 5)
      .map(
        (v) =>
          `  - ${v.franchisee.name}(${v.franchisee.region}): ${v.issues?.slice(0, 80)}`
      );

    const avgTrainingPerFranchisee =
      franchisees.length > 0
        ? (training.reduce((s, t) => s + t._count._all, 0) / franchisees.length).toFixed(1)
        : "0";

    const avgChecklistPerFranchisee =
      franchisees.length > 0
        ? (checklistProgress.reduce((s, c) => s + c._count._all, 0) / franchisees.length).toFixed(1)
        : "0";

    const avgMonthlyRevenuePerStore = 2400; // 만원
    const estimatedHqRevenue = operating.length * avgMonthlyRevenuePerStore * 0.225;

    return `# 본사 현황 스냅샷 (${now.toISOString().slice(0, 10)})

## 가맹점 (총 ${franchisees.length}곳)
- 운영 중: ${operating.length}곳
- 개업 준비 중: ${onboarding.length}곳
- 해지: ${terminated.length}곳
- 지역 분포: ${topRegionsForFranchisees(franchisees)}

## 본사 수입 (추정)
- 이번 달 로열티+앱교재비 합계: **${Math.round(estimatedHqRevenue).toLocaleString()}만원**
  (운영 ${operating.length}곳 × 평균 월매출 2,400만원 × 22.5%)

## 가맹 문의 (최근 2개월)
- 이번 달 신규: ${inquiriesThisMonth}건
- 전월 신규: ${inquiriesLastMonth}건
- 전월 대비: ${inquiriesThisMonth >= inquiriesLastMonth ? "+" : ""}${inquiriesThisMonth - inquiriesLastMonth}건
- 상태별 누적:
${inquiries.map((i) => `  - ${i.status}: ${i._count._all}건`).join("\n")}
- 관심 지역 TOP 5:
${topRegions.map(([r, c]) => `  - ${r}: ${c}건`).join("\n") || "  (데이터 없음)"}

## 가맹계약서
- 활성 버전: ${activeContract ? `${activeContract.version} (${activeContract.title})` : "없음"}
- 동의 완료 가맹점: ${contractStats._count._all}곳 / 전체 ${franchisees.length}곳

## SV 방문 (최근 20건)
- 완료: ${completedVisits.length}건
- 예정일 지난 미완료: ${pendingVisits.length}건
${visitIssues.length > 0 ? `- 최근 발견 이슈:\n${visitIssues.join("\n")}` : ""}

## 교육·체크리스트
- 가맹점당 평균 교육 이수: ${avgTrainingPerFranchisee}개
- 가맹점당 평균 체크리스트 완료: ${avgChecklistPerFranchisee}개

## 법정 주요 리스크
- 정보공개서 수령 후 14일 숙고기간 진행 중 가맹점: ${franchisees.filter((f) => f.infoDisclosureReceivedAt && isWithinCooldown(f.infoDisclosureReceivedAt, now)).length}곳

---
이 데이터는 ${now.toISOString()} 기준이며, 실시간 수치가 필요한 경우 해당 메뉴에서 재확인하세요.`;
  } catch {
    return `# 본사 현황 스냅샷\n\n(DB 연결 실패 — 마이그레이션·프로덕션 연결 확인 필요)`;
  }
}

function topRegionsForFranchisees(
  franchisees: Array<{ region: string; status: string }>
): string {
  const counts = new Map<string, number>();
  for (const f of franchisees.filter((f) => f.status === "OPERATING")) {
    counts.set(f.region, (counts.get(f.region) ?? 0) + 1);
  }
  if (counts.size === 0) return "(운영 중 가맹점 없음)";
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([r, c]) => `${r}(${c})`)
    .join(", ");
}

function isWithinCooldown(start: Date, now: Date): boolean {
  const end = new Date(start);
  end.setDate(end.getDate() + 14);
  return now <= end;
}
