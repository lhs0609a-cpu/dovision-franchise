"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, AlertTriangle, ChevronDown, Calendar, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toggleChecklistItem,
  saveChecklistNote,
  setInfoDisclosureDate,
  setTargetOpenDate,
} from "./actions";
import { PHASE_META } from "@/lib/checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ChecklistItemView = {
  templateId: string;
  phase: number;
  order: number;
  title: string;
  description: string | null;
  isLegalRequired: boolean;
  defaultOffsetDays: number | null;
  isChecked: boolean;
  note: string | null;
  adminVerifiedAt: string | null;
};

type Props = {
  items: ChecklistItemView[];
  infoDisclosureReceivedAt: string | null;
  targetOpenDate: string | null;
};

function diffDays(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ChecklistClient({
  items,
  infoDisclosureReceivedAt,
  targetOpenDate,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [openPhase, setOpenPhase] = useState<number | null>(0);
  const [infoDate, setInfoDate] = useState(
    infoDisclosureReceivedAt ? infoDisclosureReceivedAt.slice(0, 10) : ""
  );
  const [targetDate, setTargetDate] = useState(
    targetOpenDate ? targetOpenDate.slice(0, 10) : ""
  );

  const total = items.length;
  const completed = items.filter((i) => i.isChecked).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 법정 14일 숙고기간 계산
  const cooldownInfo = (() => {
    if (!infoDisclosureReceivedAt) return null;
    const start = new Date(infoDisclosureReceivedAt);
    const end = new Date(start);
    end.setDate(end.getDate() + 14);
    const now = new Date();
    const remain = diffDays(now, end);
    return { start, end, remain };
  })();

  const byPhase = new Map<number, ChecklistItemView[]>();
  for (const it of items) {
    if (!byPhase.has(it.phase)) byPhase.set(it.phase, []);
    byPhase.get(it.phase)!.push(it);
  }

  return (
    <div className="space-y-5">
      {/* 진행률 */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11.5px] font-medium text-muted-foreground">
              전체 진행률
            </p>
            <p className="mt-0.5 text-[22px] font-bold">
              {completed} <span className="text-muted-foreground">/ {total}</span>
              <span className="ml-2 text-[14px] font-semibold text-primary">
                ({percent}%)
              </span>
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 주요 일자 설정 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* 정보공개서 수령일 + 14일 카운트다운 */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold">
            <Calendar className="h-4 w-4 text-primary" />
            정보공개서 수령일 (법정 14일 숙고기간)
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              type="date"
              value={infoDate}
              onChange={(e) => setInfoDate(e.target.value)}
              className="text-[13px]"
            />
            <Button
              size="sm"
              disabled={!infoDate || pending}
              onClick={() =>
                startTransition(() => setInfoDisclosureDate(infoDate))
              }
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
          </div>
          {cooldownInfo && (
            <div
              className={cn(
                "mt-3 flex items-start gap-2 rounded-lg border p-2.5 text-[11.5px]",
                cooldownInfo.remain > 0
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-emerald-300 bg-emerald-50 text-emerald-900"
              )}
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="leading-[1.55]">
                {cooldownInfo.remain > 0 ? (
                  <>
                    <strong>숙고기간 {cooldownInfo.remain}일 남음</strong> —
                    가맹사업법 §7에 따라 수령 후 14일 경과 전 가맹비 납부·계약
                    금지.
                    <br />
                    만료일: {cooldownInfo.end.toISOString().slice(0, 10)}
                  </>
                ) : (
                  <>
                    <strong>숙고기간 경과 완료</strong> — 계약 체결 가능.
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 개업 희망일 */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold">
            <Calendar className="h-4 w-4 text-primary" />
            개업 희망일 (D-Day)
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="text-[13px]"
            />
            <Button
              size="sm"
              disabled={!targetDate || pending}
              onClick={() =>
                startTransition(() => setTargetOpenDate(targetDate))
              }
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
          </div>
          {targetDate && (
            <p className="mt-3 text-[11.5px] text-muted-foreground">
              각 Phase 권장 시점이 D-Day 기준으로 자동 계산됩니다.
            </p>
          )}
        </div>
      </div>

      {/* 12 Phase 아코디언 */}
      <div className="space-y-2">
        {Array.from(byPhase.keys())
          .sort((a, b) => a - b)
          .map((phase) => {
            const list = byPhase.get(phase)!;
            const done = list.filter((i) => i.isChecked).length;
            const meta = PHASE_META[phase];
            const isOpen = openPhase === phase;
            return (
              <div
                key={phase}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenPhase(isOpen ? null : phase)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11.5px] font-bold text-white">
                      {phase}
                    </span>
                    <div>
                      <p className="text-[14px] font-bold">
                        Phase {phase}. {meta?.name ?? ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {meta?.window} · {done}/{list.length} 완료
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="divide-y border-t bg-muted/10">
                    {list.map((item) => (
                      <ChecklistRow
                        key={item.templateId}
                        item={item}
                        targetOpenDate={targetOpenDate}
                        pending={pending}
                        onToggle={() =>
                          startTransition(() =>
                            toggleChecklistItem(item.templateId)
                          )
                        }
                        onSaveNote={(note) =>
                          startTransition(() =>
                            saveChecklistNote(item.templateId, note)
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function ChecklistRow({
  item,
  targetOpenDate,
  pending,
  onToggle,
  onSaveNote,
}: {
  item: ChecklistItemView;
  targetOpenDate: string | null;
  pending: boolean;
  onToggle: () => void;
  onSaveNote: (note: string) => void;
}) {
  const [note, setNote] = useState(item.note ?? "");
  const [noteOpen, setNoteOpen] = useState(false);

  const recommendedDate = (() => {
    if (!targetOpenDate || item.defaultOffsetDays == null) return null;
    const d = new Date(targetOpenDate);
    d.setDate(d.getDate() + item.defaultOffsetDays);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={pending}
          className="mt-0.5 shrink-0 transition-transform active:scale-90"
        >
          {item.isChecked ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p
              className={cn(
                "text-[13px] font-semibold",
                item.isChecked && "text-muted-foreground line-through"
              )}
            >
              {item.title}
            </p>
            {item.isLegalRequired && (
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9.5px] font-bold text-rose-700">
                법정 필수
              </span>
            )}
            {item.adminVerifiedAt && (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700">
                본사 검증
              </span>
            )}
            {recommendedDate && !item.isChecked && (
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9.5px] font-medium text-blue-700">
                권장일 {recommendedDate}
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-0.5 text-[11.5px] leading-[1.5] text-muted-foreground">
              {item.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => setNoteOpen((v) => !v)}
            className="mt-1 text-[10.5px] text-primary hover:underline"
          >
            {noteOpen ? "메모 닫기" : item.note ? "메모 보기/수정" : "메모 추가"}
          </button>
          {noteOpen && (
            <div className="mt-2 flex gap-2">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="진행 메모, 담당자, 관련 링크 등"
                className="text-[12px]"
              />
              <Button
                size="sm"
                disabled={pending}
                onClick={() => onSaveNote(note)}
              >
                저장
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
