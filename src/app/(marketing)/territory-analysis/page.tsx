import { Metadata } from "next";
import TerritoryClient from "./TerritoryClient";

export const metadata: Metadata = {
  title: "AI 상권분석 | 두비전 가맹",
  description:
    "두비전에 최적화된 AI 상권분석 — 후보 지점의 학교·학원·아파트·인구 데이터를 종합 분석하고 예상 수익까지 미리 시뮬레이션합니다.",
};

export default function TerritoryAnalysisPage() {
  return <TerritoryClient />;
}
