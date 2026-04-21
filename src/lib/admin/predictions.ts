// ============================================================
// 해지 위험 예측 (휴리스틱)
// ============================================================
// 실제 가맹점 해지 히스토리·매출 데이터가 쌓이기 전까지 쓸 간단
// 점수 모델. 운영 시그널 6개에 가중치를 걸어 0~100 위험도 산출.
// ============================================================

import { prisma } from "@/lib/prisma";

export type ChurnRiskFactor = {
  code: string;
  label: string;
  weight: number; // 0~100 기여 가능한 최대 위험도
  actual: number; // 이 가맹점이 실제로 가져간 위험도
  detail: string;
};

export type FranchiseeRisk = {
  id: string;
  name: string;
  region: string;
  centerName: string | null;
  status: string;
  monthsOpen: number;
  riskScore: number; // 0~100 (높을수록 위험)
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  factors: ChurnRiskFactor[];
};

function riskLevel(score: number): FranchiseeRisk["riskLevel"] {
  if (score >= 70) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export async function computeChurnRisks(): Promise<FranchiseeRisk[]> {
  try {
    const [franchisees, visits, training, checklist, activeContract, signatures] =
      await Promise.all([
        prisma.franchisee.findMany({
          where: { status: { in: ["ONBOARDING", "OPERATING"] } },
          select: {
            id: true,
            name: true,
            region: true,
            centerName: true,
            status: true,
            createdAt: true,
            openedAt: true,
            targetOpenDate: true,
          },
        }),
        prisma.supervisorVisit.findMany({
          select: { franchiseeId: true, scheduledAt: true, visitedAt: true, issues: true },
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
        prisma.contractTemplate.findFirst({ where: { isActive: true } }),
        prisma.contractSignature.findMany({
          select: { franchiseeId: true, agreedAt: true, templateId: true },
        }),
      ]);

    const totalRequiredTraining = 12; // 시드 중 필수 교육 대략 개수
    const totalChecklistItems = 95; // lib/checklist.ts 기준

    return franchisees.map((f) => {
      const now = Date.now();
      const monthsOpen = Math.max(
        0,
        Math.floor(
          (now - f.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
        )
      );

      // 1) SV 방문 부재 (가중치 25)
      const myVisits = visits.filter((v) => v.franchiseeId === f.id);
      const lastCompletedVisit = myVisits
        .filter((v) => v.visitedAt)
        .sort(
          (a, b) =>
            (b.visitedAt!.getTime() - a.visitedAt!.getTime())
        )[0];
      const daysSinceVisit = lastCompletedVisit
        ? Math.floor(
            (now - lastCompletedVisit.visitedAt!.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 999;
      let visitRisk = 0;
      let visitDetail = "방문 이력 없음 (최대 위험)";
      if (daysSinceVisit < 30) {
        visitRisk = 0;
        visitDetail = `최근 방문 ${daysSinceVisit}일 전 (정상)`;
      } else if (daysSinceVisit < 60) {
        visitRisk = 10;
        visitDetail = `최근 방문 ${daysSinceVisit}일 전`;
      } else if (daysSinceVisit < 120) {
        visitRisk = 18;
        visitDetail = `최근 방문 ${daysSinceVisit}일 전 (주의)`;
      } else {
        visitRisk = 25;
        visitDetail = `최근 방문 ${daysSinceVisit === 999 ? "없음" : `${daysSinceVisit}일 전`} — 심각`;
      }

      // 2) SV 방문 시 발견된 이슈 (가중치 15)
      const recentIssues = myVisits
        .filter((v) => v.issues && v.visitedAt)
        .slice(0, 3);
      const issueRisk = Math.min(15, recentIssues.length * 5);
      const issueDetail =
        recentIssues.length > 0
          ? `최근 ${recentIssues.length}건 이슈 발견`
          : "방문 시 이슈 없음";

      // 3) 교육 이수 부족 (가중치 20)
      const myTraining =
        training.find((t) => t.franchiseeId === f.id)?._count._all ?? 0;
      const trainingPct = Math.round(
        (myTraining / totalRequiredTraining) * 100
      );
      let trainingRisk = 0;
      if (trainingPct < 30) trainingRisk = 20;
      else if (trainingPct < 60) trainingRisk = 12;
      else if (trainingPct < 85) trainingRisk = 6;
      const trainingDetail = `이수 ${myTraining}/${totalRequiredTraining} (${Math.min(100, trainingPct)}%)`;

      // 4) 체크리스트 진행 정체 (가중치 15) — 개업 전 가맹점만
      const myChecklist =
        checklist.find((c) => c.franchiseeId === f.id)?._count._all ?? 0;
      let checklistRisk = 0;
      let checklistDetail = `${myChecklist}/${totalChecklistItems} 완료`;
      if (f.status === "ONBOARDING") {
        // 개업 준비인데 체크리스트가 한 달이상 정체 → 위험
        const expectedForMonth = Math.min(totalChecklistItems, monthsOpen * 10);
        if (myChecklist < expectedForMonth * 0.5) {
          checklistRisk = 15;
          checklistDetail += " (진행 정체)";
        } else if (myChecklist < expectedForMonth * 0.8) {
          checklistRisk = 8;
          checklistDetail += " (다소 느림)";
        }
      }

      // 5) 계약서 미동의 (가중치 10)
      let contractRisk = 0;
      let contractDetail = "해당 없음";
      if (activeContract) {
        const mySig = signatures.find(
          (s) =>
            s.franchiseeId === f.id && s.templateId === activeContract.id
        );
        if (!mySig?.agreedAt) {
          contractRisk = 10;
          contractDetail = `활성 계약 ${activeContract.version} 미동의`;
        } else {
          contractDetail = "활성 계약 동의 완료";
        }
      }

      // 6) 개업 지연 (가중치 15) — 목표일 지났는데 운영 아직 안 된 경우
      let openDelayRisk = 0;
      let openDelayDetail = "목표일 없음";
      if (f.status === "ONBOARDING" && f.targetOpenDate) {
        const daysLate = Math.floor(
          (now - f.targetOpenDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysLate > 60) {
          openDelayRisk = 15;
          openDelayDetail = `개업 목표일 ${daysLate}일 경과 — 심각`;
        } else if (daysLate > 30) {
          openDelayRisk = 9;
          openDelayDetail = `개업 목표일 ${daysLate}일 경과`;
        } else if (daysLate > 0) {
          openDelayRisk = 4;
          openDelayDetail = `개업 목표일 ${daysLate}일 경과`;
        } else {
          openDelayDetail = `개업 목표일까지 ${Math.abs(daysLate)}일`;
        }
      }

      const factors: ChurnRiskFactor[] = [
        { code: "visit", label: "SV 방문 관리", weight: 25, actual: visitRisk, detail: visitDetail },
        { code: "issue", label: "방문 이슈", weight: 15, actual: issueRisk, detail: issueDetail },
        { code: "training", label: "교육 이수", weight: 20, actual: trainingRisk, detail: trainingDetail },
        { code: "checklist", label: "체크리스트 진행", weight: 15, actual: checklistRisk, detail: checklistDetail },
        { code: "contract", label: "계약 동의", weight: 10, actual: contractRisk, detail: contractDetail },
        { code: "opendelay", label: "개업 지연", weight: 15, actual: openDelayRisk, detail: openDelayDetail },
      ];

      const riskScore = factors.reduce((s, f) => s + f.actual, 0);

      return {
        id: f.id,
        name: f.name,
        region: f.region,
        centerName: f.centerName,
        status: f.status,
        monthsOpen,
        riskScore,
        riskLevel: riskLevel(riskScore),
        factors,
      };
    });
  } catch {
    return [];
  }
}
