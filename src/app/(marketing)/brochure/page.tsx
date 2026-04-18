import { Metadata } from "next";
import BrochureClient from "./BrochureClient";

export const metadata: Metadata = {
  title: "두비전 회사소개서",
  description:
    "두비전(DOVISION) 공식 회사소개서 — ㈜키네스 그룹 27년 노하우, 이미지전환기억법 특허, 뉴로피드백·BTS 프로그램, 가맹 투자 구조 및 본사 지원 체계.",
};

export default function BrochurePage() {
  return <BrochureClient />;
}
