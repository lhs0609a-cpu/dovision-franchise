import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  PenLine,
} from "lucide-react";
import ContractActionButtons from "./ContractActionButtons";

export const dynamic = "force-dynamic";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await prisma.contractTemplate.findUnique({
    where: { id },
    include: {
      signatures: {
        include: {
          franchisee: {
            select: { id: true, name: true, region: true, centerName: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!template) notFound();

  const totalFranchisees = await prisma.franchisee.count();
  const agreedCount = template.signatures.filter((s) => s.agreedAt).length;
  const viewedCount = template.signatures.filter((s) => s.viewedAt).length;
  const downloadedCount = template.signatures.filter((s) => s.downloadedAt)
    .length;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/contracts"
        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        계약서 목록
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold">
              {template.version}
            </span>
            {template.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> 현재 활성 버전
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            업로드{" "}
            {new Date(template.createdAt).toLocaleString("ko-KR")}
            {template.effectiveFrom && (
              <>
                {" "}
                · 적용일{" "}
                {new Date(template.effectiveFrom).toLocaleDateString("ko-KR")}
              </>
            )}
            {" · "}
            {template.hwpFileName} ({(template.hwpFileSize / 1024).toFixed(0)}KB)
          </p>
          {template.note && (
            <p className="mt-2 text-[12px] text-muted-foreground">
              개정 사유: {template.note}
            </p>
          )}
          <a
            href={template.hwpFileUrl}
            target="_blank"
            rel="noreferrer"
            download={template.hwpFileName}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-[12px] font-semibold hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" /> HWP 다운로드
          </a>
        </div>
        <ContractActionButtons
          templateId={template.id}
          isActive={template.isActive}
          signatureCount={template.signatures.length}
        />
      </div>

      {/* 집계 */}
      <div className="grid gap-3 sm:grid-cols-4">
        <StatBox label="전체 가맹점" value={totalFranchisees} />
        <StatBox
          label="열람"
          value={viewedCount}
          sub={`${percent(viewedCount, totalFranchisees)}%`}
        />
        <StatBox
          label="다운로드"
          value={downloadedCount}
          sub={`${percent(downloadedCount, totalFranchisees)}%`}
        />
        <StatBox
          label="동의 완료"
          value={agreedCount}
          sub={`${percent(agreedCount, totalFranchisees)}%`}
          highlight
        />
      </div>

      {/* 서명 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">가맹점주별 상태</CardTitle>
        </CardHeader>
        <CardContent>
          {template.signatures.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 열람한 가맹점주가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {template.signatures.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-[12.5px]"
                >
                  <div>
                    <p className="font-semibold">{s.franchisee.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.franchisee.region} ·{" "}
                      {s.franchisee.centerName ?? "센터명 미정"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <StatusBadge
                      icon={<Eye className="h-3 w-3" />}
                      label="열람"
                      when={s.viewedAt}
                    />
                    <StatusBadge
                      icon={<Download className="h-3 w-3" />}
                      label="다운로드"
                      when={s.downloadedAt}
                    />
                    <StatusBadge
                      icon={<PenLine className="h-3 w-3" />}
                      label="동의"
                      when={s.agreedAt}
                      highlight
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-emerald-200 bg-emerald-50" : "bg-white"}`}
    >
      <p className="text-[11.5px] text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-[22px] font-bold ${highlight ? "text-emerald-700" : "text-foreground"}`}
      >
        {value}
        {sub && (
          <span className="ml-1 text-[11px] font-normal text-muted-foreground">
            ({sub})
          </span>
        )}
      </p>
    </div>
  );
}

function StatusBadge({
  icon,
  label,
  when,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  when: Date | null;
  highlight?: boolean;
}) {
  if (!when) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-muted-foreground/70">
        {icon}
        {label} 미완료
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${highlight ? "bg-emerald-100 text-emerald-700" : "bg-muted"}`}
    >
      {icon}
      {label} {new Date(when).toLocaleDateString("ko-KR")}
    </span>
  );
}

function percent(n: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((n / total) * 100);
}
