import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">DOVISION</h3>
            <p className="mt-2 text-sm text-background/70">
              창의융합 뇌교육 프로그램
            </p>
            <p className="mt-1 text-sm text-background/70">
              운영법인: ㈜키네스 | 대표: 김양수
            </p>
            <p className="mt-1 text-sm text-background/70">
              사업자등록번호: 000-00-00000
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">연락처</h4>
            <div className="space-y-2 text-sm text-background/70">
              <a href="tel:02-558-2733" className="flex items-center gap-2 hover:text-background">
                <Phone className="h-4 w-4" />
                02-558-2733
              </a>
              <a href="tel:031-758-2758" className="flex items-center gap-2 hover:text-background">
                <Phone className="h-4 w-4" />
                031-758-2758
              </a>
              <a href="mailto:info@dovision.kr" className="flex items-center gap-2 hover:text-background">
                <Mail className="h-4 w-4" />
                info@dovision.kr
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>강남점 / 반포점 / 위례점</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">바로가기</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <Link href="/brand" className="hover:text-background">브랜드 소개</Link>
              <Link href="/program" className="hover:text-background">프로그램</Link>
              <Link href="/franchise" className="hover:text-background">가맹 안내</Link>
              <Link href="/contact" className="hover:text-background">상담 신청</Link>
              <a href="https://dovision.kr" target="_blank" rel="noopener noreferrer" className="hover:text-background">
                두비전 홈페이지
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-background/20 pt-8 text-center text-xs text-background/50">
          <p>&copy; {new Date().getFullYear()} DOVISION. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
