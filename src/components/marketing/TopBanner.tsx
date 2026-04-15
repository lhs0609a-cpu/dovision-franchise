import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TopBanner() {
  return (
    <Link
      href="/contact"
      className="group block w-full bg-primary text-primary-foreground transition-colors hover:bg-[oklch(0.38_0.18_290)]"
    >
      <div className="container-responsive flex h-11 items-center justify-center gap-2 text-[13px] font-semibold sm:text-sm">
        <span>지금 상담 신청하고 개업 지원금 받기</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
