"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "이번 달 가맹 문의 전환율이 어떻게 돼?",
  "해지 위험이 높은 가맹점이 있어?",
  "강남 지역 경쟁 상황 분석해줘",
  "다음 분기 신규 가맹 몇 곳 열릴 것 같아?",
  "SV 방문 이슈 중 가장 심각한 게 뭐야?",
  "이번 달 본사 수입이 예상보다 낮은 이유는?",
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string>("");
  const [usage, setUsage] = useState<{
    inputTokens: number;
    outputTokens: number;
    cacheHit: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  async function send(prompt?: string) {
    const userMessage = (prompt ?? input).trim();
    if (!userMessage || streaming) return;
    setError("");
    setInput("");

    const next: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ];
    setMessages(next);
    setStreaming(true);

    try {
      const resp = await fetch("/api/admin/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .slice(0, -1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!resp.ok || !resp.body) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.error ?? `서버 오류 ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data:")) continue;
          const jsonStr = chunk.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const event = JSON.parse(jsonStr);
            if (event.type === "text") {
              assistantText += event.text;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return copy;
              });
            } else if (event.type === "done") {
              setUsage({
                inputTokens: event.usage.input_tokens,
                outputTokens: event.usage.output_tokens,
                cacheHit: event.usage.cache_read_input_tokens,
              });
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          } catch {
            // JSON parse fail 무시
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // 마지막 빈 assistant 제거
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col">
      {/* 헤더 */}
      <div className="mb-4">
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          SYSTEM · AI
        </p>
        <h1 className="mt-0.5 flex items-center gap-2 text-[22px] font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 가맹 어드바이저
        </h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Claude Opus 4.7 + 본사 실시간 데이터 스냅샷. 가맹 운영·해지 위험·
          수익 분석 등 물어보세요.
        </p>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex h-full flex-col">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5"
          >
            {messages.length === 0 ? (
              <EmptyState onPick={send} />
            ) : (
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    role={m.role}
                    content={m.content}
                    streaming={
                      streaming &&
                      i === messages.length - 1 &&
                      m.role === "assistant"
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* 입력창 */}
          <div className="border-t bg-muted/10 p-4">
            {error && (
              <div className="mb-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-[11.5px] text-rose-800">
                ⚠️ {error}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  streaming
                    ? "응답 생성 중..."
                    : "가맹 운영에 대해 무엇이든 물어보세요..."
                }
                disabled={streaming}
                className="flex-1 rounded-md border bg-white px-3 py-2 text-[13px] outline-none focus:border-primary"
              />
              <Button
                type="submit"
                disabled={streaming || !input.trim()}
                className="gap-1.5"
              >
                {streaming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                보내기
              </Button>
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={streaming}
                  onClick={() => {
                    setMessages([]);
                    setUsage(null);
                    setError("");
                  }}
                  title="대화 초기화"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </form>
            {usage && (
              <p className="mt-1.5 text-[9.5px] text-muted-foreground">
                마지막 응답 · input {usage.inputTokens}t / output{" "}
                {usage.outputTokens}t · 캐시 hit {usage.cacheHit}t
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <h2 className="mt-3 text-[16px] font-bold">무엇을 도와드릴까요?</h2>
      <p className="mt-1 text-[12px] text-muted-foreground">
        본사 데이터 스냅샷을 기반으로 답변합니다. 예시 질문을 눌러 시작하세요.
      </p>
      <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-lg border bg-white p-2.5 text-left text-[11.5px] font-medium hover:border-primary hover:bg-primary/5"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
}) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-white"
            : "bg-gradient-to-br from-purple-500 to-purple-700 text-white"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-[1.65]",
          isUser
            ? "bg-primary text-white"
            : "bg-muted/50"
        )}
      >
        {content ? (
          <pre className="whitespace-pre-wrap font-[inherit] text-[13px] leading-[1.65]">
            {content}
          </pre>
        ) : streaming ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            생각 중...
          </span>
        ) : null}
        {streaming && content && (
          <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-muted-foreground/60 align-middle" />
        )}
      </div>
    </div>
  );
}
