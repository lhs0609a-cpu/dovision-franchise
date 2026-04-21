// ============================================================
// Audit Log — 중요 액션 기록 유틸
// ============================================================

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type AuditAction =
  // 계약서
  | "contract.create"
  | "contract.activate"
  | "contract.deactivate"
  | "contract.delete"
  | "contract.agree"
  // 가맹점
  | "franchisee.create"
  | "franchisee.status.change"
  // 문의
  | "inquiry.status.change"
  // 본사 SV
  | "visit.create"
  | "visit.complete"
  // 교육
  | "training.complete"
  | "training.verify"
  // 사용자
  | "admin.role.change";

type WriteAuditParams = {
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  meta?: unknown;
};

/** 서버 액션·API 라우트에서 호출. 현재 세션 기준 자동 작성. */
export async function writeAudit(params: WriteAuditParams): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return;

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0].trim() ||
      h.get("x-real-ip") ||
      null;

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        actorType: session.user.userType,
        actorName: session.user.name,
        action: params.action,
        entityType: params.entityType ?? null,
        entityId: params.entityId ?? null,
        meta: (params.meta as never) ?? undefined,
        ip,
      },
    });
  } catch {
    // 감사 로그 실패는 본 액션을 막지 않음
  }
}

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "contract.create": "계약서 생성",
  "contract.activate": "계약서 활성화",
  "contract.deactivate": "계약서 비활성화",
  "contract.delete": "계약서 삭제",
  "contract.agree": "계약서 동의",
  "franchisee.create": "가맹점 계정 생성",
  "franchisee.status.change": "가맹점 상태 변경",
  "inquiry.status.change": "문의 상태 변경",
  "visit.create": "SV 방문 일정 생성",
  "visit.complete": "SV 방문 완료",
  "training.complete": "교육 이수 등록",
  "training.verify": "교육 이수 본사 검증",
  "admin.role.change": "관리자 권한 변경",
};
