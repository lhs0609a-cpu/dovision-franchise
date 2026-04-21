"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "./actions";

export default function NewTicketForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const id = await createTicket(fd);
        router.push(`/portal/tickets/${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "등록 실패");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="subject">제목</Label>
        <Input
          id="subject"
          name="subject"
          required
          placeholder="예: 뉴로피드백 장비 1대 간헐적 오류"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category">분류</Label>
          <select
            id="category"
            name="category"
            className="w-full rounded-md border bg-background px-2 py-1.5 text-[13px]"
          >
            <option value="OPERATIONS">운영·관리</option>
            <option value="SYSTEM">시스템·장비</option>
            <option value="EDUCATION">교육·커리큘럼</option>
            <option value="MARKETING">마케팅·홍보</option>
            <option value="FINANCE">수납·정산</option>
            <option value="OTHER">기타</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">긴급도</Label>
          <select
            id="priority"
            name="priority"
            className="w-full rounded-md border bg-background px-2 py-1.5 text-[13px]"
            defaultValue="NORMAL"
          >
            <option value="LOW">낮음</option>
            <option value="NORMAL">보통</option>
            <option value="HIGH">높음 (업무 영향 있음)</option>
            <option value="URGENT">긴급 (즉시 대응 필요)</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">상세 내용</Label>
        <Textarea
          id="body"
          name="body"
          rows={5}
          required
          placeholder="현상·재현 방법·이미 시도한 내용 등을 자세히 적어주세요."
        />
      </div>
      {error && (
        <p className="rounded-md bg-rose-50 p-2 text-[11.5px] text-rose-800">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "접수 중..." : "티켓 접수"}
      </Button>
    </form>
  );
}
