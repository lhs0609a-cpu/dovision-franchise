"use client";

import { useTransition } from "react";
import { setTicketStatus } from "../actions";

const STATUSES = [
  { value: "OPEN", label: "접수" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "WAITING", label: "회신 대기" },
  { value: "RESOLVED", label: "해결됨" },
  { value: "CLOSED", label: "종료" },
] as const;

export default function AdminTicketStatus({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
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
            setTicketStatus(
              ticketId,
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
