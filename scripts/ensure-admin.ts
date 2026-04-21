// 목적: 스키마 변경 없이, 프로덕션 DB에 admin 계정만 upsert.
//   실행: DATABASE_URL=... npx tsx scripts/ensure-admin.ts
//
// 안전성:
//   - adminUser.upsert로 멱등 (있으면 update:{}, 없으면 create)
//   - 다른 테이블·행은 건드리지 않음
//   - 스키마는 기존 그대로 (db push 미실행)

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 미설정");
  const adapter = new PrismaPg(url);
  const prisma = new PrismaClient({ adapter });

  const email = "admin@dovision.kr";
  const passwordRaw = "admin1234!";
  const hashed = await bcrypt.hash(passwordRaw, 12);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    // 비밀번호만 리셋 (시드 값으로 복원)
    await prisma.adminUser.update({
      where: { email },
      data: { password: hashed },
    });
    console.log(`✅ 기존 관리자 발견 → 비밀번호를 시드 값으로 리셋`);
    console.log(`   ID: ${existing.id}`);
    console.log(`   role: ${existing.role}`);
  } else {
    // 신규 생성 — role 필드 생략(Prisma default ADMIN 사용) → 기존 enum 호환
    await prisma.adminUser.create({
      data: {
        email,
        password: hashed,
        name: "관리자",
      },
    });
    console.log(`✅ 관리자 계정 신규 생성`);
  }
  console.log(``);
  console.log(`   이메일: ${email}`);
  console.log(`   비밀번호: ${passwordRaw}`);
  console.log(``);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
