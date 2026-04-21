"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { completeVisit } from "./actions";

export default function CompleteForm({ visitId }: { visitId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.append("id", visitId);
    startTransition(async () => {
      await completeVisit(fd);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1 text-[11.5px] font-semibold text-white hover:bg-emerald-600"
      >
        <CheckCircle2 className="h-3 w-3" />
        방문 완료 입력
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border bg-white p-3">
      <Textarea
        name="summary"
        rows={2}
        placeholder="방문 요약 (예: 회원 수 28명 확인, 시설 양호)"
        className="text-[11.5px]"
      />
      <Textarea
        name="issues"
        rows={2}
        placeholder="발견된 이슈 (예: 뉴로피드백 장비 1대 간헐적 오류)"
        className="text-[11.5px]"
      />
      <Textarea
        name="nextAction"
        rows={2}
        placeholder="다음 액션 (예: 본사 A/S 요청, 2주 뒤 재방문)"
        className="text-[11.5px]"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending} size="sm" className="gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          완료 저장
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(false)}
          disabled={pending}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
