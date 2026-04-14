import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InquiryStatus } from "@/types";

export default async function InquiriesPage() {
  let inquiries: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    region: string;
    status: string;
    createdAt: Date;
  }[] = [];

  try {
    inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">문의 관리</h1>

      {inquiries.length === 0 ? (
        <p className="text-muted-foreground">접수된 문의가 없습니다.</p>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>지역</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>접수일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell>
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {inq.name}
                    </Link>
                  </TableCell>
                  <TableCell>{inq.phone}</TableCell>
                  <TableCell>{inq.region}</TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inq.status as InquiryStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
