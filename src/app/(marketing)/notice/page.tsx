import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Badge } from "@/components/ui/badge";
import { Pin } from "lucide-react";

export const metadata: Metadata = {
  title: "공지사항",
  description: "두비전 가맹 관련 공지사항을 확인하세요.",
};

export const revalidate = 3600;

const fallbackNotices = [
  { id: "1", title: "두비전 가맹점 모집을 시작합니다", content: "", isPinned: true, createdAt: new Date("2024-12-01") },
  { id: "2", title: "2025년 1분기 사업 설명회 일정 안내", content: "", isPinned: true, createdAt: new Date("2024-11-15") },
  { id: "3", title: "가맹 문의 접수 방법 안내", content: "", isPinned: false, createdAt: new Date("2024-11-01") },
  { id: "4", title: "두비전 프로그램 업데이트 안내", content: "", isPinned: false, createdAt: new Date("2024-10-20") },
];

export default async function NoticePage() {
  let notices: { id: string; title: string; isPinned: boolean; createdAt: Date }[] = [];

  try {
    notices = await prisma.notice.findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      select: { id: true, title: true, isPinned: true, createdAt: true },
    });
  } catch {
    // DB not connected
  }

  const displayData = notices.length > 0 ? notices : fallbackNotices;

  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">공지사항</h1>
          </SectionFadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            {displayData.map((notice, i) => (
              <SectionFadeIn key={notice.id} delay={i * 0.05}>
                <Link
                  href={`/notice/${notice.id}`}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    {notice.isPinned && (
                      <Badge variant="secondary" className="shrink-0">
                        <Pin className="mr-1 h-3 w-3" />
                        고정
                      </Badge>
                    )}
                    <span className="text-sm font-medium">{notice.title}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </Link>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
