"use client";

import SectionFadeIn from "./SectionFadeIn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const items = [
  { category: "가맹비", standard: "500만원", premium: "500만원" },
  { category: "교육비", standard: "300만원", premium: "300만원" },
  { category: "인테리어 (15평 기준)", standard: "1,500만원", premium: "2,500만원" },
  { category: "장비 (뉴로피드백 등)", standard: "1,000만원", premium: "2,000만원" },
  { category: "초기 교재/물품", standard: "300만원", premium: "500만원" },
  { category: "보증금", standard: "200만원", premium: "500만원" },
];

export default function InvestmentTable() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionFadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">투자비 안내</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              합리적인 투자비로 검증된 교육 사업을 시작하세요
            </p>
          </div>
        </SectionFadeIn>

        <SectionFadeIn delay={0.2}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">항목</TableHead>
                  <TableHead className="text-center">스탠다드 (15평)</TableHead>
                  <TableHead className="text-center">프리미엄 (25평+)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-center">{item.standard}</TableCell>
                    <TableCell className="text-center">{item.premium}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-primary/5 font-bold">
                  <TableCell>합계</TableCell>
                  <TableCell className="text-center text-primary">
                    약 3,800만원
                  </TableCell>
                  <TableCell className="text-center text-primary">
                    약 6,300만원
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </SectionFadeIn>

        <SectionFadeIn delay={0.3}>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            * 점포 임대료 별도 / 상기 금액은 기준이며 변동될 수 있습니다
          </p>
        </SectionFadeIn>
      </div>
    </section>
  );
}
