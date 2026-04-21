// ============================================================
// 관리자 알림 수집 — 실시간 점검 항목
// ============================================================
// 서버 컴포넌트에서 호출. 각 알림은 severity + title + body + href.
// ============================================================

import { prisma } from "@/lib/prisma";

export type AdminAlert = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body: string;
  href?: string;
  when: string;
};

function relTime(d: Date): string {
  const now = Date.now();
  const diff = now - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export async function collectAdminAlerts(): Promise<AdminAlert[]> {
  const alerts: AdminAlert[] = [];
  try {
    // 1) 24시간 이상 미대응 신규 문의 (SLA)
    const sla = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const overdueInquiries = await prisma.inquiry.findMany({
      where: { status: "NEW", createdAt: { lt: sla } },
      take: 5,
      orderBy: { createdAt: "asc" },
    });
    for (const i of overdueInquiries) {
      alerts.push({
        id: `inq-${i.id}`,
        severity: "critical",
        title: "24시간 미대응 문의",
        body: `${i.name} (${i.region}) · ${relTime(i.createdAt)} 접수`,
        href: `/admin/inquiries/${i.id}`,
        when: relTime(i.createdAt),
      });
    }

    // 2) 가맹사업법 숙고기간 만료 임박 (D-3 이내)
    const now = new Date();
    const allFranchisees = await prisma.franchisee.findMany({
      where: {
        infoDisclosureReceivedAt: { not: null },
        status: "ONBOARDING",
      },
      take: 10,
    });
    for (const f of allFranchisees) {
      if (!f.infoDisclosureReceivedAt) continue;
      const end = new Date(f.infoDisclosureReceivedAt);
      end.setDate(end.getDate() + 14);
      const daysLeft = Math.ceil(
        (end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (daysLeft > 0 && daysLeft <= 3) {
        alerts.push({
          id: `cool-${f.id}`,
          severity: "warning",
          title: "정보공개서 숙고기간 임박",
          body: `${f.name} · D-${daysLeft} (가맹사업법 §7)`,
          href: `/admin/franchisees/${f.id}`,
          when: `D-${daysLeft}`,
        });
      }
    }

    // 3) 신규 문의 (24시간 이내)
    const recent = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newInquiries = await prisma.inquiry.findMany({
      where: { status: "NEW", createdAt: { gte: recent } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    for (const i of newInquiries) {
      alerts.push({
        id: `newinq-${i.id}`,
        severity: "info",
        title: "신규 문의 도착",
        body: `${i.name} (${i.region}) · ${i.phone}`,
        href: `/admin/inquiries/${i.id}`,
        when: relTime(i.createdAt),
      });
    }
  } catch {
    // DB 미연결 시 빈 알림
  }
  // critical 먼저, 그다음 warning, info
  const order = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}
