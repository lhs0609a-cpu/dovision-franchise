"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/brand", label: "브랜드 소개" },
  { href: "/group", label: "그룹" },
  { href: "/program", label: "프로그램" },
  { href: "/success", label: "성과 사례" },
  { href: "/franchise", label: "가맹 안내" },
  { href: "/simulator", label: "수익 시뮬레이터" },
  { href: "/faq", label: "FAQ" },
  { href: "/notice", label: "공지사항" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-responsive flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* 모바일 로고 */}
          <Image
            src="/images/dovision/mobile_top_logo.png"
            alt="DOVISION 두비전"
            width={120}
            height={36}
            priority
            className="h-8 w-auto sm:hidden"
          />
          {/* 데스크톱 로고 */}
          <Image
            src="/images/dovision/top_logo.png"
            alt="DOVISION 두비전"
            width={160}
            height={40}
            priority
            className="hidden h-10 w-auto sm:block"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3.5 py-2 text-[14px] font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:0507-1434-3226" className="hidden sm:block">
            <button className="flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:border-foreground">
              <Phone className="h-3.5 w-3.5" />
              전화 상담
            </button>
          </a>
          <Link href="/contact" className="hidden sm:block">
            <button className="rounded-[8px] bg-foreground px-5 py-2 text-[13px] font-semibold text-background transition-colors hover:bg-primary">
              문의하기
            </button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={<Button variant="ghost" size="icon" />}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 space-y-2 px-4">
                  <a href="tel:0507-1434-3226" className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      전화 상담
                    </Button>
                  </a>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    <button className="w-full rounded-[10px] bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary">
                      문의하기
                    </button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
