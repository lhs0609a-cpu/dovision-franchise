"use client";

import { useState, useTransition } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createVisit } from "./actions";

type FranchiseeOpt = {
  id: string;
  name: string;
  region: string;
  centerName: string | null;
};

export default function VisitForm({
  franchisees,
}: {
  franchisees: FranchiseeOpt[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createVisit(fd);
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "등록 실패");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_160px_auto]">
      <select
        name="franchiseeId"
        required
        className="rounded-md border bg-background px-2 py-1.5 text-[12.5px]"
      >
        <option value="">가맹점 선택</option>
        {franchisees.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
            {f.centerName ? ` · ${f.centerName}` : ""} ({f.region})
          </option>
        ))}
      </select>
      <input
        type="date"
        name="scheduledAt"
        required
        className="rounded-md border bg-background px-2 py-1.5 text-[12.5px]"
      />
      <Button type="submit" disabled={pending} className="gap-1.5">
        <CalendarPlus className="h-3.5 w-3.5" />
        일정 등록
      </Button>
      {error && (
        <p className="sm:col-span-3 text-[11px] text-rose-600">{error}</p>
      )}
    </form>
  );
}
