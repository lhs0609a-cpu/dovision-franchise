"use client";

import { useTransition } from "react";
import { setFranchiseeStatus } from "../actions";

const STATUSES = [
  { value: "ONBOARDING", label: "개업 준비 중" },
  { value: "OPERATING", label: "운영 중" },
  { value: "SUSPENDED", label: "휴업" },
  { value: "TERMINATED", label: "해지" },
] as const;

export default function StatusForm({
  franchiseeId,
  currentStatus,
}: {
  franchiseeId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11.5px] text-muted-foreground">상태</label>
      <select
        value={currentStatus}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            setFranchiseeStatus(
              franchiseeId,
              e.target.value as (typeof STATUSES)[number]["value"]
            )
          )
        }
        className="rounded-md border bg-background px-2 py-1 text-[12px]"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
