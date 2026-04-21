"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Power, PowerOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  activateContract,
  deactivateContract,
  deleteContract,
} from "../actions";

export default function ContractActionButtons({
  templateId,
  isActive,
  signatureCount,
}: {
  templateId: string;
  isActive: boolean;
  signatureCount: number;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {isActive ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(() => deactivateContract(templateId))
          }
          className="gap-1.5"
        >
          <PowerOff className="h-3.5 w-3.5" />
          비활성화
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => startTransition(() => activateContract(templateId))}
          className="gap-1.5"
        >
          <Power className="h-3.5 w-3.5" />
          이 버전으로 활성화
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending || signatureCount > 0}
        onClick={() => {
          if (
            !confirm(
              "정말 삭제하시겠습니까? Blob 파일도 같이 삭제됩니다. (서명 기록 있는 버전은 삭제 불가)"
            )
          )
            return;
          startTransition(async () => {
            await deleteContract(templateId);
            router.push("/admin/contracts");
          });
        }}
        className="gap-1.5 text-rose-600"
        title={
          signatureCount > 0
            ? "서명 기록이 있어 삭제 불가 (비활성화만 가능)"
            : undefined
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
        삭제
      </Button>
    </div>
  );
}
