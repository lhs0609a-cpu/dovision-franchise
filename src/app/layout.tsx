import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "두비전(DOVISION) 가맹 안내 | 창의융합 뇌교육 프랜차이즈",
    template: "%s | 두비전 가맹",
  },
  description:
    "두비전 창의융합 뇌교육 프로그램 가맹점 모집. 특허 보유 이미지전환기억법, 뉴로피드백 트레이닝, BTS 시스템. 소자본 창업, 높은 수익률.",
  keywords: [
    "두비전",
    "DOVISION",
    "뇌교육",
    "가맹",
    "프랜차이즈",
    "창의융합",
    "이미지전환기억법",
    "뉴로피드백",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "두비전 가맹 안내",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
