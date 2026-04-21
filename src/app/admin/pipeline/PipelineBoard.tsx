"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateInquiryStatus } from "@/actions/inquiry";
import type { PipelineItem } from "./page";

const COLUMNS: Array<{
  status: string;
  label: string;
  color: string;
  sla?: number;
}> = [
  { status: "NEW", label: "신규 문의", color: "#64748b", sla: 1 },
  { status: "CONTACTED", label: "1차 상담", color: "#3b82f6", sla: 3 },
  { status: "CONSULTING", label: "상담 진행", color: "#8b5cf6", sla: 14 },
  { status: "VISITED", label: "현장 실사", color: "#f59e0b", sla: 21 },
  { status: "CONTRACTED", label: "계약 체결", color: "#10b981" },
];

export default function PipelineBoard({ items }: { items: PipelineItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<string | null>(null);

  const byStatus = new Map<string, PipelineItem[]>();
  for (const col of COLUMNS) byStatus.set(col.status, []);
  for (const it of items) {
    if (byStatus.has(it.status)) byStatus.get(it.status)!.push(it);
  }

  function handleDrop(targetStatus: string) {
    if (!draggingId) return;
    const item = items.find((i) => i.id === draggingId);
    setDraggingId(null);
    setHoverCol(null);
    if (!item || item.status === targetStatus) return;
    startTransition(async () => {
      await updateInquiryStatus(item.id, targetStatus);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {COLUMNS.map((col) => {
        const list = byStatus.get(col.status) ?? [];
        const isHover = hoverCol === col.status;
        return (
          <div
            key={col.status}
            onDragOver={(e) => {
              e.preventDefault();
              setHoverCol(col.status);
            }}
            onDragLeave={() => setHoverCol(null)}
            onDrop={() => handleDrop(col.status)}
            className={cn(
              "flex w-[280px] shrink-0 flex-col rounded-xl border bg-muted/20 p-2 transition-colors",
              isHover && "ring-2 ring-primary/30 bg-primary/5"
            )}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: col.color }}
                />
                <p className="text-[12.5px] font-bold">{col.label}</p>
                <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {list.length}
                </span>
              </div>
              {col.sla && (
                <span className="text-[9.5px] text-muted-foreground">
                  SLA {col.sla}d
                </span>
              )}
            </div>
            <div className="flex-1 space-y-1.5 min-h-[200px]">
              {list.length === 0 ? (
                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed text-[10.5px] text-muted-foreground/60">
                  비어 있음
                </div>
              ) : (
                list.map((item) => (
                  <PipelineCard
                    key={item.id}
                    item={item}
                    sla={col.sla}
                    onDragStart={() => setDraggingId(item.id)}
                    disabled={pending}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PipelineCard({
  item,
  sla,
  onDragStart,
  disabled,
}: {
  item: PipelineItem;
  sla?: number;
  onDragStart: () => void;
  disabled: boolean;
}) {
  const isOverdue = sla ? item.ageDays > sla : false;

  return (
    <Link
      href={`/admin/inquiries/${item.id}`}
      draggable={!disabled}
      onDragStart={onDragStart}
      className={cn(
        "block cursor-grab select-none rounded-lg border bg-white p-2.5 shadow-sm hover:shadow-md active:cursor-grabbing",
        isOverdue && "border-l-[3px] border-l-rose-500",
        disabled && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold">{item.name}</p>
          <p className="mt-0.5 text-[10.5px] text-muted-foreground">
            {item.region}
          </p>
        </div>
        {isOverdue && (
          <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-100 px-1 py-0.5 text-[9px] font-bold text-rose-700">
            <AlertTriangle className="h-2.5 w-2.5" />
            지연
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-0.5">
          <Phone className="h-2.5 w-2.5" />
          {item.phone}
        </span>
        <span>{item.ageDays}일째</span>
      </div>
      {item.budget && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          예산: {item.budget}
        </p>
      )}
    </Link>
  );
}
