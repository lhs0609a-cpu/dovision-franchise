import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChecklistClient, { type ChecklistItemView } from "./ChecklistClient";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const session = await auth();
  if (!session || session.user.userType !== "franchisee") {
    redirect("/portal/login");
  }

  const franchisee = await prisma.franchisee.findUnique({
    where: { id: session.user.id },
  });
  if (!franchisee) {
    redirect("/portal/login");
  }

  const templates = await prisma.checklistTemplate.findMany({
    orderBy: [{ phase: "asc" }, { order: "asc" }],
  });
  const progressList = await prisma.checklistProgress.findMany({
    where: { franchiseeId: franchisee.id },
  });
  const progressByTemplate = new Map(
    progressList.map((p) => [p.templateId, p])
  );

  const items: ChecklistItemView[] = templates.map((t) => {
    const p = progressByTemplate.get(t.id);
    return {
      templateId: t.id,
      phase: t.phase,
      order: t.order,
      title: t.title,
      description: t.description,
      isLegalRequired: t.isLegalRequired,
      defaultOffsetDays: t.defaultOffsetDays,
      isChecked: p?.isChecked ?? false,
      note: p?.note ?? null,
      adminVerifiedAt: p?.adminVerifiedAt?.toISOString() ?? null,
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11.5px] font-semibold text-primary">
          {franchisee.region} · {franchisee.centerName ?? "센터명 미정"}
        </p>
        <h1 className="mt-0.5 text-[22px] font-bold">
          {franchisee.name} 원장님, 환영합니다
        </h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          개업까지 체크해야 할 모든 항목을 단계별로 관리하세요. 본사 담당자와
          실시간으로 진행 상황이 공유됩니다.
        </p>
      </div>

      <ChecklistClient
        items={items}
        infoDisclosureReceivedAt={
          franchisee.infoDisclosureReceivedAt?.toISOString() ?? null
        }
        targetOpenDate={franchisee.targetOpenDate?.toISOString() ?? null}
      />
    </div>
  );
}
