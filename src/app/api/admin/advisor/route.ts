import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import {
  ADVISOR_SYSTEM_PROMPT,
  collectBusinessContext,
} from "@/lib/admin/advisor-context";

export const runtime = "nodejs";
export const maxDuration = 60;

// ============================================================
// POST /api/admin/advisor — Claude API 스트리밍
// ============================================================
// - 모델: claude-opus-4-7 + adaptive thinking
// - 시스템 프롬프트 + 본사 데이터 스냅샷에 prompt caching (5분 TTL)
// - SSE 스트림으로 응답 반환
// ============================================================

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), {
      status: 401,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY 미설정. Vercel env에 키 등록 후 재배포 필요.",
      }),
      { status: 500 }
    );
  }

  const body = (await req.json()) as { messages: IncomingMessage[] };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
    });
  }

  const context = await collectBusinessContext();
  const client = new Anthropic({ apiKey });

  const apiMessages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // SSE 스트림 리턴
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const msgStream = client.messages.stream({
          model: "claude-opus-4-7",
          max_tokens: 16000,
          thinking: { type: "adaptive" },
          system: [
            {
              type: "text",
              text: ADVISOR_SYSTEM_PROMPT,
            },
            {
              type: "text",
              text: context,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: apiMessages,
        });

        for await (const event of msgStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`
              )
            );
          } else if (event.type === "message_start") {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "start" })}\n\n`
              )
            );
          }
        }

        const finalMessage = await msgStream.finalMessage();
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              usage: {
                input_tokens: finalMessage.usage.input_tokens,
                output_tokens: finalMessage.usage.output_tokens,
                cache_read_input_tokens:
                  finalMessage.usage.cache_read_input_tokens ?? 0,
                cache_creation_input_tokens:
                  finalMessage.usage.cache_creation_input_tokens ?? 0,
              },
            })}\n\n`
          )
        );
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "unknown error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", error: msg })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
