import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin1234!", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@dovision.kr" },
    update: {},
    create: {
      email: "admin@dovision.kr",
      password: hashedPassword,
      name: "관리자",
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user created: admin@dovision.kr / admin1234!");

  // Sample FAQs
  const faqs = [
    { question: "교육업 경험이 없어도 가맹이 가능한가요?", answer: "네, 가능합니다. 본사에서 실장·교사 3개월 집중 교육 연수를 제공하며(교육비 1,500만원 포함), 오픈 후에도 슈퍼바이저가 정기적으로 방문하여 운영을 지원합니다.", category: "general", order: 1 },
    { question: "초기 투자비는 얼마나 드나요?", answer: "30~35평 기준 총 1억원입니다. 가입비 1,000만원 · 인테리어 2,500~3,000만원 · 강의시설/장비 1,500만원 · 교육비(3개월) 1,500만원. 임대보증금 2,500~3,000만원은 별도이며, 월 운영비는 1,300~1,800만원(본사 공급원가 22.5% 포함)입니다.", category: "investment", order: 2 },
    { question: "손익분기점(BEP)은 언제 도달하나요?", answer: "월 신규등록 3~4명이 BEP 지점입니다(월 지출 1,800만원 · 본사 공급원가 22.5% 포함, 6개월 선불 480만원 기준). 5명 시 월 순이익 600만원, 7명 시 1,560만원, 10명 시 3,000만원 구간입니다.", category: "investment", order: 3 },
    { question: "본사에 지급하는 비용(로열티·앱교재비)은 얼마인가요?", answer: "본사 공급원가는 매출액의 22.5%입니다 — 매출 연동 로열티 10%(신규 프로그램·교재 업데이트, SV 컨설팅 포함, 하한선 월 250만원) + 앱 교재비 12.5%(회원 1인 6개월 60만원). 음식점의 재료비에 해당하며, 매출의 77.5%가 가맹점주에게 남습니다.", category: "investment", order: 4 },
    { question: "이미지전환기억법은 무엇인가요?", answer: "숫자, 단어, 개념 등을 시각적 이미지로 전환하여 장기기억으로 저장하는 두비전만의 독자적인 기억법입니다. 특허 등록된 기술입니다.", category: "program", order: 5 },
    { question: "뉴로피드백 장비는 어떻게 관리하나요?", answer: "본사에서 장비 납품 및 초기 세팅, A/S를 모두 지원합니다.", category: "operation", order: 6 },
    { question: "본사에서 어떤 마케팅을 지원하나요?", answer: "온라인(블로그, SNS, 검색광고) 및 오프라인(전단지, 학교 연계) 마케팅을 지원합니다.", category: "operation", order: 7 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`${faqs.length} FAQs created`);

  // Sample Testimonials
  const testimonials = [
    { studentName: "김O준", grade: "초등학교 5학년", duration: "6개월", content: "두비전에서 6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요.", achievement: "기억량 200% 향상", order: 1 },
    { studentName: "이O서", grade: "중학교 2학년", duration: "1년", content: "뉴로피드백 훈련 덕분에 집중력이 크게 향상되었습니다.", achievement: "IQ 100 → 125", order: 2 },
    { studentName: "박O현", grade: "고등학교 1학년", duration: "2년", content: "이미지전환기억법으로 영어 단어 암기가 수월해졌습니다.", achievement: "서울대 합격", order: 3 },
    { studentName: "최O아", grade: "초등학교 3학년", duration: "8개월", content: "처음에는 10개도 어려웠는데 지금은 60개 이상 쉽게 외워요.", achievement: "기억량 600% 향상", order: 4 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`${testimonials.length} testimonials created`);

  // Sample Notices
  const notices = [
    { title: "두비전 가맹점 모집을 시작합니다", content: "두비전 창의융합 뇌교육 프로그램의 가맹점 모집을 공식적으로 시작합니다.\n\n관심 있으신 분들은 상담 신청을 통해 문의해 주세요.\n\n감사합니다.", isPinned: true },
    { title: "2025년 1분기 사업 설명회 일정 안내", content: "2025년 1분기 사업 설명회 일정을 안내드립니다.\n\n일시: 매주 수요일 14:00\n장소: 강남 직영 센터\n\n사전 예약 필수입니다.", isPinned: true },
    { title: "가맹 문의 접수 방법 안내", content: "홈페이지 상담 신청, 전화(02-558-2733), 카카오톡 1:1 상담을 통해 문의하실 수 있습니다.", isPinned: false },
  ];

  for (const n of notices) {
    await prisma.notice.create({ data: n });
  }
  console.log(`${notices.length} notices created`);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
