import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES } from "@/types";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "두비전 가맹에 대해 자주 묻는 질문과 답변을 확인하세요.",
};

export const revalidate = 3600;

const fallbackFAQs = [
  { id: "0", question: "㈜키네스 그룹과 두비전은 어떤 관계인가요?", answer: "두비전(DOVISION)은 1999년 설립된 ㈜키네스가 직접 운영하는 뇌교육 프랜차이즈 브랜드입니다. ㈜키네스는 27년간 성장관리 브랜드 '키네스'를 전국 17개 지점·해외 1개국(베트남 하노이)으로 확장해 온 프랜차이즈 기업으로, 같은 본사·슈퍼바이저 조직·교육 R&D가 두비전 가맹점주를 그대로 지원합니다. 그룹 전체 스토리는 /group 페이지에서 확인하실 수 있습니다.", category: "general" },
  { id: "1", question: "교육업 경험이 없어도 가맹이 가능한가요?", answer: "네, 가능합니다. 본사에서 실장·교사 3개월 집중 교육 연수를 제공하며(교육비 1,500만원 포함), 오픈 후에도 슈퍼바이저가 정기 방문하여 운영을 지원합니다. 교육업 경험이 없는 분들도 성공적으로 운영하고 계십니다.", category: "general" },
  { id: "2", question: "초기 투자비는 얼마나 드나요?", answer: "30~35평 기준 총 1억원입니다. 가입비 1,000만원 · 인테리어 2,500~3,000만원 · 강의시설/장비 1,500만원 · 교육비(3개월) 1,500만원. 임대보증금 2,500~3,000만원은 별도이며, 월 운영비는 1,300~1,800만원입니다.", category: "investment" },
  { id: "3", question: "손익분기점(BEP)은 언제 도달하나요?", answer: "월 신규등록 3~4명이 BEP 지점입니다(월 지출 1,800만원, 6개월 선불 480만원 기준). 5명 시 월 순이익 600만원, 7명 시 1,560만원, 10명 시 3,000만원 구간에 진입합니다.", category: "investment" },
  { id: "4", question: "로열티는 어떻게 되나요?", answer: "매출액의 10%를 로열티로 지급하며, 기본 하한선은 월 250만원입니다. 신규 프로그램·교재 업데이트와 슈퍼바이저 방문 컨설팅이 로열티에 포함됩니다.", category: "investment" },
  { id: "5", question: "등록 방식은 어떻게 되나요?", answer: "주 2회 수업(중 교육 + 코칭/상담 + 필요시 뉴로피드백) 기준 월 80만원이며, 6개월 선불 480만원으로 등록합니다. 뇌기능 검사 및 상담은 매 3개월 재검사 시 10만원이 별도 부과됩니다.", category: "investment" },
  { id: "6", question: "이미지전환기억법은 무엇인가요?", answer: "숫자, 단어, 개념 등을 시각적 이미지로 전환하여 장기기억으로 저장하는 두비전만의 독자적인 기억법입니다. 특허 등록된 기술로, 48주 체계적 커리큘럼으로 진행됩니다.", category: "program" },
  { id: "7", question: "뉴로피드백 장비는 어떻게 관리하나요?", answer: "본사에서 장비 납품 및 초기 세팅을 담당하며, A/S도 본사에서 지원합니다. 정기적인 장비 점검과 업그레이드도 본사가 관리합니다.", category: "operation" },
  { id: "8", question: "본사에서 어떤 마케팅을 지원하나요?", answer: "온라인(블로그, SNS, 검색광고) 및 오프라인(전단지, 학교 연계) 마케팅을 지원합니다. 오픈 초기 집중 마케팅과 지속적인 공동 마케팅을 진행합니다.", category: "operation" },
  { id: "9", question: "상담은 어떻게 신청하나요?", answer: "홈페이지 상담 신청 폼, 전화(02-558-2733), 카카오톡 1:1 상담 등 다양한 채널로 신청 가능합니다. 접수 후 1영업일 이내에 연락드립니다.", category: "general" },
];

export default async function FAQPage() {
  let faqs: { id: string; question: string; answer: string; category: string }[] = [];

  try {
    faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // DB not connected - use fallback
  }

  const displayData = faqs.length > 0 ? faqs : fallbackFAQs;
  const categories = [...new Set(displayData.map((f) => f.category))];

  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">자주 묻는 질문</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              두비전 가맹에 대해 궁금한 점을 확인하세요
            </p>
          </SectionFadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <SectionFadeIn key={cat}>
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-primary">
                  {FAQ_CATEGORIES[cat] || cat}
                </h2>
                <Accordion className="space-y-2">
                  {displayData
                    .filter((f) => f.category === cat)
                    .map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        className="rounded-lg border bg-card px-4"
                      >
                        <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
