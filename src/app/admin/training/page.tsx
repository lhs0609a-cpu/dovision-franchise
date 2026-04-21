import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { GraduationCap } from "lucide-react";
import TrainingMatrix from "./TrainingMatrix";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("training", role)) {
    return <AccessDenied feature="교육 이수" role={role} />;
  }

  let franchisees: Array<{
    id: string;
    name: string;
    centerName: string | null;
    region: string;
  }> = [];
  let curricula: Array<{
    id: string;
    code: string;
    title: string;
    category: string;
    order: number;
    isRequired: boolean;
  }> = [];
  let completions: Array<{
    franchiseeId: string;
    curriculumId: string;
    completedAt: Date;
    verifiedAt: Date | null;
  }> = [];

  try {
    const [f, c, co] = await Promise.all([
      prisma.franchisee.findMany({
        where: { status: { in: ["ONBOARDING", "OPERATING"] } },
        select: {
          id: true,
          name: true,
          centerName: true,
          region: true,
        },
        orderBy: { name: "asc" },
      }),
      prisma.trainingCurriculum.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      }),
      prisma.trainingCompletion.findMany({
        select: {
          franchiseeId: true,
          curriculumId: true,
          completedAt: true,
          verifiedAt: true,
        },
      }),
    ]);
    franchisees = f;
    curricula = c;
    completions = co;
  } catch {
    // DB 미연결
  }

  // 완료율 집계
  const totalRequired = curricula.filter((c) => c.isRequired).length;
  const totalCells = franchisees.length * totalRequired;
  const completedCells = completions.filter((co) =>
    curricula.find((c) => c.id === co.curriculumId && c.isRequired)
  ).length;
  const completionRate =
    totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          OPERATIONS · TRAINING
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <GraduationCap className="h-5 w-5 text-primary" />
          교육 이수 매트릭스
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          가맹점 × 교육 과정 그리드로 한눈에 이수 현황 확인. 법정 필수 항목
          (개인정보·아동학대·성희롱) 포함.
        </p>
      </div>

      {/* 상단 집계 */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="가맹점" value={franchisees.length} />
        <Stat label="필수 과정" value={totalRequired} />
        <Stat
          label="필수 이수 완료"
          value={completedCells}
          sub={`전체 ${totalCells}셀`}
        />
        <Stat
          label="필수 이수율"
          value={`${completionRate}%`}
          tone={completionRate >= 80 ? "success" : "warning"}
        />
      </div>

      <TrainingMatrix
        franchisees={franchisees}
        curricula={curricula}
        completions={completions}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "success" | "warning";
}) {
  const color =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : "text-foreground";
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-[22px] font-black leading-none ${color}`}>
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[10.5px] text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}
