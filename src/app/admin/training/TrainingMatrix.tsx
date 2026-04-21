"use client";

import { useMemo, useTransition } from "react";
import { CheckCircle2, Circle, ShieldCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleCompletion, toggleVerify } from "./actions";

type Franchisee = {
  id: string;
  name: string;
  centerName: string | null;
  region: string;
};
type Curriculum = {
  id: string;
  code: string;
  title: string;
  category: string;
  order: number;
  isRequired: boolean;
};
type Completion = {
  franchiseeId: string;
  curriculumId: string;
  completedAt: Date;
  verifiedAt: Date | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  원장: "bg-purple-50 text-purple-700 border-purple-200",
  강사: "bg-blue-50 text-blue-700 border-blue-200",
  행정: "bg-slate-50 text-slate-700 border-slate-200",
  법정: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function TrainingMatrix({
  franchisees,
  curricula,
  completions,
}: {
  franchisees: Franchisee[];
  curricula: Curriculum[];
  completions: Completion[];
}) {
  const [pending, startTransition] = useTransition();

  // map[franchiseeId][curriculumId] = completion
  const map = useMemo(() => {
    const m = new Map<string, Map<string, Completion>>();
    for (const c of completions) {
      if (!m.has(c.franchiseeId)) m.set(c.franchiseeId, new Map());
      m.get(c.franchiseeId)!.set(c.curriculumId, c);
    }
    return m;
  }, [completions]);

  const groupedCurricula = useMemo(() => {
    const groups = new Map<string, Curriculum[]>();
    for (const c of curricula) {
      if (!groups.has(c.category)) groups.set(c.category, []);
      groups.get(c.category)!.push(c);
    }
    return Array.from(groups.entries());
  }, [curricula]);

  if (franchisees.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-[12.5px] text-muted-foreground">
        등록된 가맹점이 없습니다.
      </div>
    );
  }
  if (curricula.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-[12.5px] text-muted-foreground">
        커리큘럼 시드가 주입되지 않았습니다. <code>npm run db:seed</code>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-[11px]">
        <thead className="bg-muted/40 sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 z-20 min-w-[180px] border-r bg-muted/40 px-3 py-2 text-left font-semibold">
              가맹점
            </th>
            {groupedCurricula.map(([cat, items]) => (
              <th
                key={cat}
                colSpan={items.length}
                className={cn(
                  "border-l px-2 py-1.5 text-center text-[10px] font-bold",
                  CATEGORY_COLORS[cat] ?? ""
                )}
              >
                {cat}
              </th>
            ))}
          </tr>
          <tr>
            <th className="sticky left-0 z-20 border-r bg-muted/40 px-3 py-2" />
            {groupedCurricula.flatMap(([, items]) =>
              items.map((c) => (
                <th
                  key={c.id}
                  className="min-w-[80px] border-l bg-white px-1.5 py-2 text-center text-[9.5px] font-normal text-muted-foreground"
                  title={c.title}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {c.isRequired && (
                      <span className="text-[9px] font-bold text-rose-600">
                        ●
                      </span>
                    )}
                    <span className="line-clamp-2 leading-tight">
                      {c.title}
                    </span>
                  </div>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {franchisees.map((f) => {
            const row = map.get(f.id);
            const completedCount = row?.size ?? 0;
            const total = curricula.length;
            return (
              <tr key={f.id} className="border-t hover:bg-muted/10">
                <td className="sticky left-0 z-10 border-r bg-white px-3 py-2">
                  <p className="text-[12px] font-semibold">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {f.centerName ?? f.region}
                  </p>
                  <p className="mt-0.5 text-[10px] text-primary">
                    {completedCount}/{total}
                  </p>
                </td>
                {groupedCurricula.flatMap(([, items]) =>
                  items.map((c) => {
                    const comp = row?.get(c.id);
                    const done = !!comp;
                    const verified = !!comp?.verifiedAt;
                    return (
                      <td
                        key={c.id}
                        className="border-l px-1 py-1 text-center"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              startTransition(() =>
                                toggleCompletion(f.id, c.id)
                              )
                            }
                            className="transition-transform hover:scale-110 active:scale-90"
                            title={done ? "이수 취소" : "이수 등록"}
                          >
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/40" />
                            )}
                          </button>
                          {done && (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                startTransition(() =>
                                  toggleVerify(f.id, c.id)
                                )
                              }
                              title={verified ? "검증 취소" : "본사 검증"}
                              className="transition-transform hover:scale-110"
                            >
                              {verified ? (
                                <ShieldCheck className="h-3 w-3 text-blue-600" />
                              ) : (
                                <Shield className="h-3 w-3 text-muted-foreground/40" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="border-t bg-muted/20 px-3 py-2 text-[10.5px] text-muted-foreground">
        <span className="mr-3">
          <CheckCircle2 className="inline h-3 w-3 text-emerald-500" /> 이수
        </span>
        <span className="mr-3">
          <ShieldCheck className="inline h-3 w-3 text-blue-600" /> 본사 검증
        </span>
        <span className="text-rose-600">● 필수</span>
      </div>
    </div>
  );
}
