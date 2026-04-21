"use client";

import { useTransition, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postTicketReply } from "../actions";

export default function ReplyForm({ ticketId }: { ticketId: string }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await postTicketReply(ticketId, fd);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        name="body"
        rows={3}
        required
        placeholder="추가 정보나 답변을 작성하세요..."
      />
      <Button type="submit" disabled={pending} className="gap-1.5">
        <Send className="h-3.5 w-3.5" />
        {pending ? "전송 중..." : "답글 전송"}
      </Button>
    </form>
  );
}
