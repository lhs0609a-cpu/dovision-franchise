import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContractAgreeForm from "./ContractAgreeForm";

export const dynamic = "force-dynamic";

export default async function ContractPortalPage() {
  const session = await auth();
  if (!session || session.user.userType !== "franchisee") {
    redirect("/portal/login");
  }

  const active = await prisma.contractTemplate.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!active) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              가맹계약서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                현재 본사가 배포 중인 계약서 버전이 없습니다. 본사 담당자에게
                문의해주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const signature = await prisma.contractSignature.findUnique({
    where: {
      franchiseeId_templateId: {
        franchiseeId: session.user.id,
        templateId: active.id,
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">가맹계약서</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          본사가 배포하는 현재 활성 계약서입니다. 다운로드 후 내용을 확인하시고
          하단의 동의 버튼을 눌러주세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            {active.title}
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold">
              {active.version}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/30 p-3 text-[12px] leading-[1.7]">
            <p>
              <strong>파일:</strong> {active.hwpFileName} (
              {(active.hwpFileSize / 1024).toFixed(0)}KB)
            </p>
            {active.effectiveFrom && (
              <p className="mt-1">
                <strong>적용 시작일:</strong>{" "}
                {new Date(active.effectiveFrom).toLocaleDateString("ko-KR")}
              </p>
            )}
            {active.note && (
              <p className="mt-1">
                <strong>개정 사유:</strong> {active.note}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11.5px] text-amber-900">
            💡 HWP 파일은 브라우저에서 바로 열 수 없습니다. 다운로드 후{" "}
            <strong>한글(HWP)·한컴 오피스</strong> 또는 무료{" "}
            <strong>한컴뷰어</strong>로 열어주세요.
          </div>

          <ContractAgreeForm
            templateId={active.id}
            hwpFileUrl={active.hwpFileUrl}
            hwpFileName={active.hwpFileName}
            viewedAt={signature?.viewedAt?.toISOString() ?? null}
            downloadedAt={signature?.downloadedAt?.toISOString() ?? null}
            agreedAt={signature?.agreedAt?.toISOString() ?? null}
          />
        </CardContent>
      </Card>

      {signature?.agreedAt && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[12px] text-emerald-900">
          <p className="font-bold">✅ 계약서 동의가 완료되었습니다</p>
          <p className="mt-1">
            동의 시각:{" "}
            {new Date(signature.agreedAt).toLocaleString("ko-KR")}
            {signature.agreementIp && ` · IP ${signature.agreementIp}`}
          </p>
          <p className="mt-1 text-[11px] text-emerald-800/80">
            본 동의 기록은 감사 로그로 보관되며 본사와 공유됩니다. 계약서 본문
            (HWP)은 법적 효력을 갖는 서류이며 실제 계약 체결은 본사 담당자와의
            별도 서명 절차에서 이뤄집니다.
          </p>
        </div>
      )}
    </div>
  );
}
