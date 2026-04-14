import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;

  let notice: { id: string; title: string; content: string; createdAt: Date } | null = null;

  try {
    notice = await prisma.notice.findUnique({
      where: { id, isPublished: true },
    });
  } catch {
    // DB not connected - show fallback
    notice = {
      id,
      title: "공지사항 상세",
      content: "데이터베이스가 연결되면 공지사항 내용이 표시됩니다.",
      createdAt: new Date(),
    };
  }

  if (!notice) notFound();

  return (
    <div className="pb-20">
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/notice">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{notice.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-8 whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {notice.content}
          </div>
        </div>
      </section>
    </div>
  );
}
