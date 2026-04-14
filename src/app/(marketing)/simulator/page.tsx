import { Metadata } from "next";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import ROICalculator from "@/components/marketing/ROICalculator";

export const metadata: Metadata = {
  title: "수익 시뮬레이터",
  description: "두비전 가맹점 예상 수익을 직접 시뮬레이션해 보세요. 회원 수, 수강료, 임대료를 조정하여 BEP와 수익을 확인하세요.",
};

export default function SimulatorPage() {
  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              ROI 수익 시뮬레이터
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              조건을 조정하여 예상 수익을 직접 확인해 보세요
            </p>
          </SectionFadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ROICalculator />
        </div>
      </section>
    </div>
  );
}
