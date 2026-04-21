import { prisma } from "@/lib/prisma";
import PipelineBoard from "./PipelineBoard";

export const dynamic = "force-dynamic";

export type PipelineItem = {
  id: string;
  name: string;
  region: string;
  phone: string;
  budget: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  ageDays: number;
};

export default async function PipelinePage() {
  let inquiries: PipelineItem[] = [];
  try {
    const list = await prisma.inquiry.findMany({
      where: { status: { not: "REJECTED" } },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    const now = Date.now();
    inquiries = list.map((i) => ({
      id: i.id,
      name: i.name,
      region: i.region,
      phone: i.phone,
      budget: i.budget,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      ageDays: Math.floor(
        (now - i.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));
  } catch {
    // DB 미연결
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          PIPELINE
        </p>
        <h1 className="mt-0.5 text-[22px] font-bold">가맹 파이프라인</h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          문의 → 상담 → 계약 단계별 칸반 · 카드 드래그로 상태 이동 · SLA 24h
          초과 시 빨간 배지
        </p>
      </div>
      <PipelineBoard items={inquiries} />
    </div>
  );
}
