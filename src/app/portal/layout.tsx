import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // 포털 레이아웃은 middleware로도 보호되지만 안전상 한 번 더 확인
  if (session && session.user.userType !== "franchisee") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-white">
        <div className="container-responsive max-w-6xl flex h-14 items-center justify-between">
          <Link href="/portal" className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-primary">DOVISION</span>
            <span className="text-[12px] text-muted-foreground">
              가맹점주 포털
            </span>
          </Link>
          {session && (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/portal/login" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="text-[12px]">{session.user.name} 로그아웃</span>
              </Button>
            </form>
          )}
        </div>
      </header>
      <main className="container-responsive max-w-6xl py-6">{children}</main>
    </div>
  );
}
