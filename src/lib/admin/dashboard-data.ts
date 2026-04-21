// ============================================================
// 관리자 메인 대시보드 집계 — KPI 12개 + 차트 데이터
// ============================================================

import { prisma } from "@/lib/prisma";

const COGS_RATIO = 0.225;
const ENROLLMENT_FEE = 480; // 만원

export type DashboardData = {
  kpis: {
    totalFranchisees: number;
    activeFranchisees: number;
    terminatedFranchisees: number;
    newThisMonth: number;             // 이번 달 신규 가맹 (계약 기준)
    totalInquiries: number;
    newInquiriesThisMonth: number;
    pendingInquiries: number;         // NEW 상태
    slaOverdue: number;               // 24h+ 미대응
    contractsPending: number;         // 정보공개서 14일 내
    contractAgreedRate: number;       // 활성 계약서 동의율 %
    monthlyRoyalty: number;           // 본사 로열티 수입 (추정, 만원)
    conversionRate: number;           // 문의→계약 전환율 %
  };
  pipelineCounts: { status: string; label: string; count: number }[];
  monthlyInquiryTrend: { month: string; inquiries: number; contracted: number }[];
  monthlyRoyaltyTrend: { month: string; royalty: number }[];
};

const INQUIRY_STATUS_ORDER: Array<{ key: string; label: string }> = [
  { key: "NEW", label: "신규" },
  { key: "CONTACTED", label: "연락완료" },
  { key: "CONSULTING", label: "상담중" },
  { key: "VISITED", label: "방문완료" },
  { key: "CONTRACTED", label: "계약완료" },
  { key: "REJECTED", label: "거절" },
];

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sla = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const [
      totalFranchisees,
      activeFranchisees,
      terminatedFranchisees,
      newThisMonth,
      totalInquiries,
      newInquiriesThisMonth,
      pendingInquiries,
      slaOverdue,
      contractsPending,
      allFranchisees,
      inquiryByStatusRaw,
      activeContract,
      inquiryByMonthRaw,
    ] = await Promise.all([
      prisma.franchisee.count(),
      prisma.franchisee.count({ where: { status: "OPERATING" } }),
      prisma.franchisee.count({ where: { status: "TERMINATED" } }),
      prisma.franchisee.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.count({
        where: { status: "NEW", createdAt: { lt: sla } },
      }),
      prisma.franchisee.count({
        where: {
          infoDisclosureReceivedAt: { not: null },
          status: "ONBOARDING",
        },
      }),
      prisma.franchisee.findMany({
        select: { id: true, status: true },
      }),
      prisma.inquiry.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.contractTemplate.findFirst({
        where: { isActive: true },
        include: {
          _count: { select: { signatures: { where: { agreedAt: { not: null } } } } },
        },
      }),
      prisma.inquiry.findMany({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 11, 1),
          },
        },
        select: { createdAt: true, status: true },
      }),
    ]);

    // 전환율 (계약 완료 / 전체 문의)
    const contractedTotal =
      inquiryByStatusRaw.find((r) => r.status === "CONTRACTED")?._count._all ??
      0;
    const conversionRate =
      totalInquiries > 0
        ? Math.round((contractedTotal / totalInquiries) * 1000) / 10
        : 0;

    // 월 로열티 수입 = 운영중 가맹점 × 평균 월 매출 × 10%
    // (평균 매출은 간단 추정: 활성 회원 30명 × 월 80만원 = 2,400만원)
    // 실제 가맹점 매출 보고가 쌓이기 전까지의 approximation
    const avgMonthlyRevenuePerStore = 2400;
    const monthlyRoyalty = Math.round(
      activeFranchisees * avgMonthlyRevenuePerStore * 0.1
    );

    // 활성 계약서 동의율
    const contractAgreedRate =
      activeContract && totalFranchisees > 0
        ? Math.round(
            (activeContract._count.signatures / totalFranchisees) * 100
          )
        : 0;

    // 파이프라인 분포
    const pipelineCounts = INQUIRY_STATUS_ORDER.map(({ key, label }) => ({
      status: key,
      label,
      count:
        inquiryByStatusRaw.find((r) => r.status === key)?._count._all ?? 0,
    }));

    // 월별 문의·계약 추세 (최근 12개월)
    const trend = new Map<
      string,
      { month: string; inquiries: number; contracted: number }
    >();
    for (let k = 11; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      trend.set(key, { month: key.slice(5) + "월", inquiries: 0, contracted: 0 });
    }
    for (const row of inquiryByMonthRaw) {
      const d = new Date(row.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = trend.get(key);
      if (entry) {
        entry.inquiries += 1;
        if (row.status === "CONTRACTED") entry.contracted += 1;
      }
    }
    const monthlyInquiryTrend = Array.from(trend.values());

    // 월별 로열티 추세 (활성 가맹점 수로 근사)
    // 실제 월간 매출 리포트가 쌓이기 전까지 간단 선형 추정
    const monthlyRoyaltyTrend = monthlyInquiryTrend.map((t, i) => {
      // 현재 기준 활성 가맹점 수 × 월 평균 매출 × 10% 로열티
      // 과거 월은 해당 시점 가맹점 수가 적었다고 가정 (선형 감쇠)
      const ratio = (i + 1) / monthlyInquiryTrend.length;
      const estActive = Math.max(1, Math.round(activeFranchisees * ratio));
      return {
        month: t.month,
        royalty: Math.round(estActive * avgMonthlyRevenuePerStore * 0.1),
      };
    });

    // 사용하지 않는 allFranchisees는 로직에 사용되진 않지만 future-proof
    void allFranchisees;
    void ENROLLMENT_FEE;
    void COGS_RATIO;

    return {
      kpis: {
        totalFranchisees,
        activeFranchisees,
        terminatedFranchisees,
        newThisMonth,
        totalInquiries,
        newInquiriesThisMonth,
        pendingInquiries,
        slaOverdue,
        contractsPending,
        contractAgreedRate,
        monthlyRoyalty,
        conversionRate,
      },
      pipelineCounts,
      monthlyInquiryTrend,
      monthlyRoyaltyTrend,
    };
  } catch {
    return emptyDashboard();
  }
}

function emptyDashboard(): DashboardData {
  return {
    kpis: {
      totalFranchisees: 0,
      activeFranchisees: 0,
      terminatedFranchisees: 0,
      newThisMonth: 0,
      totalInquiries: 0,
      newInquiriesThisMonth: 0,
      pendingInquiries: 0,
      slaOverdue: 0,
      contractsPending: 0,
      contractAgreedRate: 0,
      monthlyRoyalty: 0,
      conversionRate: 0,
    },
    pipelineCounts: INQUIRY_STATUS_ORDER.map((s) => ({
      status: s.key,
      label: s.label,
      count: 0,
    })),
    monthlyInquiryTrend: [],
    monthlyRoyaltyTrend: [],
  };
}
