import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// ============================================================
// POST /api/admin/contracts/upload
// ============================================================
// 관리자 전용. multipart/form-data로 HWP 파일 + 메타 수신,
// Vercel Blob 업로드 후 ContractTemplate 레코드 생성.
// ============================================================

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.userType !== "admin") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const version = String(form.get("version") || "").trim();
  const title = String(form.get("title") || "두비전 가맹계약서").trim();
  const effectiveFromRaw = String(form.get("effectiveFrom") || "");
  const note = String(form.get("note") || "").trim() || null;
  const setActive = form.get("setActive") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (!version) {
    return NextResponse.json({ error: "version required" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".hwp")) {
    return NextResponse.json({ error: "HWP 파일만 업로드 가능" }, {
      status: 400,
    });
  }

  // 중복 버전 방지
  const existing = await prisma.contractTemplate.findUnique({
    where: { version },
  });
  if (existing) {
    return NextResponse.json(
      { error: `버전 ${version} 이미 존재` },
      { status: 409 }
    );
  }

  // Vercel Blob 업로드
  const blob = await put(`contracts/${version}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const template = await prisma.contractTemplate.create({
    data: {
      version,
      title,
      hwpFileUrl: blob.url,
      hwpFileName: file.name,
      hwpFileSize: file.size,
      effectiveFrom: effectiveFromRaw ? new Date(effectiveFromRaw) : null,
      note,
      isActive: false,
    },
  });

  // 활성 지정 요청 시 기존 활성 모두 해제 후 이번 건을 활성
  if (setActive) {
    await prisma.$transaction([
      prisma.contractTemplate.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      prisma.contractTemplate.update({
        where: { id: template.id },
        data: { isActive: true },
      }),
    ]);
  }

  return NextResponse.json({ id: template.id, url: blob.url });
}
