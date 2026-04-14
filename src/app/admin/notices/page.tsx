import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pin } from "lucide-react";
import { deleteNotice, toggleNoticePin } from "@/actions/notice";

export default async function AdminNoticesPage() {
  let notices: {
    id: string;
    title: string;
    isPinned: boolean;
    isPublished: boolean;
    createdAt: Date;
  }[] = [];

  try {
    notices = await prisma.notice.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Link href="/admin/notices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 공지사항
          </Button>
        </Link>
      </div>

      {notices.length === 0 ? (
        <p className="text-muted-foreground">등록된 공지사항이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {notice.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={notice.isPublished ? "default" : "secondary"}>
                    {notice.isPublished ? "공개" : "비공개"}
                  </Badge>
                  <form
                    action={async () => {
                      "use server";
                      await toggleNoticePin(notice.id, !notice.isPinned);
                    }}
                  >
                    <Button variant="outline" size="sm" type="submit">
                      {notice.isPinned ? "고정 해제" : "고정"}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteNotice(notice.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      삭제
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
