import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2 } from "lucide-react";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
  let templates: Array<{
    id: string;
    version: string;
    title: string;
    hwpFileUrl: string;
    hwpFileName: string;
    hwpFileSize: number;
    isActive: boolean;
    effectiveFrom: Date | null;
    note: string | null;
    createdAt: Date;
    signatureCount: number;
  }> = [];

  try {
    const list = await prisma.contractTemplate.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      include: { _count: { select: { signatures: true } } },
    });
    templates = list.map((t) => ({
      id: t.id,
      version: t.version,
      title: t.title,
      hwpFileUrl: t.hwpFileUrl,
      hwpFileName: t.hwpFileName,
      hwpFileSize: t.hwpFileSize,
      isActive: t.isActive,
      effectiveFrom: t.effectiveFrom,
      note: t.note,
      createdAt: t.createdAt,
      signatureCount: t._count.signatures,
    }));
  } catch {
    // DB not connected / schema out of date
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">가맹계약서 관리</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          본사가 배포하는 계약서 템플릿을 관리하고, 가맹점주별 열람·동의
          현황을 추적합니다. 활성 버전은 언제나 1개 (가맹점주 포털에 노출).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">새 계약서 업로드 (HWP)</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">버전 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 등록된 계약서가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/contracts/${t.id}`}
                  className="block rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold">{t.title}</p>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-bold">
                          {t.version}
                        </span>
                        {t.isActive && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            활성
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {t.hwpFileName} ·{" "}
                        {(t.hwpFileSize / 1024).toFixed(0)}KB · 업로드{" "}
                        {new Date(t.createdAt).toLocaleDateString("ko-KR")}
                        {t.effectiveFrom && (
                          <>
                            {" "}
                            · 적용일{" "}
                            {new Date(t.effectiveFrom).toLocaleDateString(
                              "ko-KR"
                            )}
                          </>
                        )}
                      </p>
                      {t.note && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          개정 사유: {t.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-[11px]">
                      <p className="text-muted-foreground">서명</p>
                      <p className="mt-0.5 text-[16px] font-bold text-primary">
                        {t.signatureCount}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
