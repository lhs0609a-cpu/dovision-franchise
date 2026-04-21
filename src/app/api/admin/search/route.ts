import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// ============================================================
// 전역 검색 — 가맹점·문의·계약서에서 키워드 검색
// ============================================================

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ hits: [] });

  const limit = 8;
  const [franchisees, inquiries, contracts] = await Promise.all([
    prisma.franchisee.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { centerName: { contains: q, mode: "insensitive" } },
          { region: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.inquiry.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { region: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contractTemplate.findMany({
      where: {
        OR: [
          { version: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const hits = [
    ...franchisees.map((f) => ({
      type: "franchisee" as const,
      id: f.id,
      title: `${f.name} · ${f.centerName ?? "센터명 미정"}`,
      sub: `${f.region} · ${f.phone}`,
      href: `/admin/franchisees/${f.id}`,
    })),
    ...inquiries.map((i) => ({
      type: "inquiry" as const,
      id: i.id,
      title: i.name,
      sub: `${i.region} · ${i.phone} · ${statusLabel(i.status)}`,
      href: `/admin/inquiries/${i.id}`,
    })),
    ...contracts.map((c) => ({
      type: "contract" as const,
      id: c.id,
      title: c.title,
      sub: `${c.version} · ${c.isActive ? "활성" : "비활성"}`,
      href: `/admin/contracts/${c.id}`,
    })),
  ];

  return NextResponse.json({ hits });
}

function statusLabel(s: string): string {
  switch (s) {
    case "NEW":
      return "신규";
    case "CONTACTED":
      return "연락완료";
    case "CONSULTING":
      return "상담중";
    case "VISITED":
      return "방문완료";
    case "CONTRACTED":
      return "계약완료";
    case "REJECTED":
      return "거절";
    default:
      return s;
  }
}
