import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied({
  feature,
  role,
}: {
  feature: string;
  role?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
          <ShieldAlert className="h-6 w-6 text-rose-600" />
        </div>
        <h1 className="mt-4 text-[18px] font-bold">접근 권한 없음</h1>
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          <strong>{feature}</strong> 메뉴는 현재 역할({role ?? "미지정"})로
          접근할 수 없습니다. 필요 시 슈퍼관리자에게 권한을 요청하세요.
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-1.5 text-[12.5px] font-semibold text-white hover:bg-primary/90"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
