"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/brand", label: "브랜드 소개" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-primary">DOVISION</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            두비전 가맹
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:02-558-2733" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <Phone className="mr-1 h-4 w-4" />
              02-558-2733
            </Button>
          </a>
          <Link href="/contact">
            <Button size="sm" className="hidden sm:inline-flex">
              상담 신청
            </Button>
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
                    className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 space-y-2 px-4">
                  <a href="tel:02-558-2733" className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      전화 상담
                    </Button>
                  </a>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    <Button className="w-full">상담 신청</Button>
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
