"use client";

import { useEffect, useState, useTransition } from "react";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markViewed, markDownloaded, agreeToContract } from "./actions";

type Props = {
  templateId: string;
  hwpFileUrl: string;
  hwpFileName: string;
  viewedAt: string | null;
  downloadedAt: string | null;
  agreedAt: string | null;
};

export default function ContractAgreeForm({
  templateId,
  hwpFileUrl,
  hwpFileName,
  viewedAt,
  downloadedAt,
  agreedAt,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [readConfirm, setReadConfirm] = useState(false);

  // 페이지 진입 시 최초 열람 기록
  useEffect(() => {
    if (!viewedAt) {
      startTransition(() => markViewed(templateId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    startTransition(() => markDownloaded(templateId));
    // 실제 다운로드는 브라우저 네이티브 (같은 탭 이동 방지 → 새 창)
    window.open(hwpFileUrl, "_blank", "noopener,noreferrer");
  }

  function handleAgree() {
    if (!readConfirm) return;
    startTransition(() => agreeToContract(templateId));
  }

  const alreadyAgreed = !!agreedAt;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleDownload}
          disabled={pending}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          HWP 다운로드
        </Button>
        <span className="flex items-center text-[11px] text-muted-foreground">
          파일: {hwpFileName}
        </span>
      </div>

      {downloadedAt && !alreadyAgreed && (
        <p className="text-[11px] text-muted-foreground">
          최근 다운로드: {new Date(downloadedAt).toLocaleString("ko-KR")}
        </p>
      )}

      {!alreadyAgreed && (
        <>
          <div className="rounded-lg border bg-white p-3">
            <label className="flex items-start gap-2 text-[12.5px]">
              <input
                type="checkbox"
                checked={readConfirm}
                onChange={(e) => setReadConfirm(e.target.checked)}
                className="mt-0.5 h-4 w-4"
                disabled={pending}
              />
              <span>
                위 계약서(HWP)의 모든 조항을 <strong>읽고 이해했으며</strong>{" "}
                본 계약서의 내용에 동의합니다. (본 동의는 감사 로그 목적이며,
                실제 계약 체결은 본사 담당자와의 별도 서명 절차에서
                이뤄집니다.)
              </span>
            </label>
          </div>

          <Button
            type="button"
            onClick={handleAgree}
            disabled={!readConfirm || pending}
            className="w-full gap-1.5"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 처리 중...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                동의하고 본사에 알림
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
