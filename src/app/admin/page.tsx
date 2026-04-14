import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import { MessageSquare, UserPlus, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { InquiryStatus } from "@/types";

export default async function AdminDashboard() {
  let stats = { total: 0, newThisMonth: 0, consulting: 0, contracted: 0 };
  let recentInquiries: { id: string; name: string; phone: string; region: string; status: string; createdAt: Date }[] = [];

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newThisMonth, consulting, contracted, recent] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.inquiry.count({ where: { status: "CONSULTING" } }),
      prisma.inquiry.count({ where: { status: "CONTRACTED" } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    stats = { total, newThisMonth, consulting, contracted };
    recentInquiries = recent;
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="총 문의" value={stats.total} icon={MessageSquare} />
        <StatsCard title="이번 달 신규" value={stats.newThisMonth} icon={UserPlus} />
        <StatsCard title="상담 중" value={stats.consulting} icon={Users} />
        <StatsCard title="계약 완료" value={stats.contracted} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 문의</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 접수된 문의가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{inq.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {inq.phone} · {inq.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <InquiryStatusBadge status={inq.status as InquiryStatus} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                    </span>
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
