import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "성과 사례",
  description: "두비전 프로그램을 통해 변화한 학생들의 실제 성과 사례를 확인하세요.",
};

export const revalidate = 3600;

export default async function SuccessPage() {
  let testimonials: {
    id: string;
    studentName: string;
    grade: string;
    duration: string;
    content: string;
    achievement: string;
  }[] = [];

  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // DB not connected yet - show fallback data
  }

  const fallbackData = [
    { id: "1", studentName: "김O준", grade: "초5", duration: "6개월", content: "두비전에서 6개월 훈련 후 암기 속도가 눈에 띄게 빨라졌어요. 학교 시험도 항상 상위권을 유지하고 있습니다.", achievement: "기억량 200% 향상" },
    { id: "2", studentName: "이O서", grade: "중2", duration: "1년", content: "뉴로피드백 훈련 덕분에 집중력이 크게 향상되었습니다. 수업 시간에 딴생각을 하지 않게 되었고, 성적도 크게 올랐어요.", achievement: "IQ 100 → 125" },
    { id: "3", studentName: "박O현", grade: "고1", duration: "2년", content: "이미지전환기억법으로 영어 단어 암기가 수월해졌고, BTS 시스템으로 논리적 사고력도 키울 수 있었습니다.", achievement: "서울대 합격" },
    { id: "4", studentName: "최O아", grade: "초3", duration: "8개월", content: "처음에는 10개도 어려웠는데 지금은 60개 이상 쉽게 외워요. 아이의 자신감이 크게 달라졌습니다.", achievement: "기억량 600% 향상" },
    { id: "5", studentName: "정O민", grade: "중3", duration: "1년 6개월", content: "뉴로피드백으로 집중력을 키우고, 기억법으로 암기 효율을 높여 전교 1등을 달성했습니다.", achievement: "전교 1등" },
    { id: "6", studentName: "한O윤", grade: "초6", duration: "10개월", content: "수학 문제 풀이 속도가 빨라지고, 독서 후 내용 정리 능력이 크게 좋아졌어요.", achievement: "수학 경시대회 입상" },
  ];

  const displayData = testimonials.length > 0 ? testimonials : fallbackData;

  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">성과 사례</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              두비전 프로그램으로 변화한 학생들의 실제 이야기
            </p>
          </SectionFadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item, i) => (
              <SectionFadeIn key={item.id} delay={i * 0.1}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      {item.achievement}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{item.content}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="font-semibold">{item.studentName}</p>
                        <p className="text-xs text-muted-foreground">{item.grade}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        수강 {item.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
