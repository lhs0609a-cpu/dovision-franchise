"use client";

import { useRef, useTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToTicket } from "../actions";

export default function AdminTicketReply({ ticketId }: { ticketId: string }) {
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement | null>(null);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await replyToTicket(ticketId, fd);
      ref.current?.reset();
    });
  }
  return (
    <form ref={ref} onSubmit={submit} className="space-y-2">
      <Textarea
        name="body"
        rows={4}
        required
        placeholder="본사 답변을 작성하세요..."
      />
      <Button type="submit" disabled={pending} className="gap-1.5">
        <Send className="h-3.5 w-3.5" />
        {pending ? "전송 중..." : "답변 전송"}
      </Button>
    </form>
  );
}
