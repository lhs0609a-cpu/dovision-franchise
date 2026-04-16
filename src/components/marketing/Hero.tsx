"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="snap-section relative overflow-hidden bg-[oklch(0.97_0.005_290)]">
      {/* Background gradient + subtle radial */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.45_0.18_290_/_0.08),transparent_55%)]" />

      {/* Decorative purple frame — AssistFit-style */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] -z-0 hidden -translate-x-1/2 -translate-y-1/2 border-[10px] border-primary lg:block"
        style={{ width: "min(960px, 78vw)", height: "min(600px, 66vh)" }}
        initial={{ opacity: 0, rotate: -2, scale: 0.95 }}
        animate={{ opacity: 1, rotate: -1.5, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] -z-0 hidden -translate-x-[48%] -translate-y-1/2 border-[10px] border-primary/50 lg:block"
        style={{ width: "min(920px, 74vw)", height: "min(580px, 64vh)" }}
        initial={{ opacity: 0, rotate: 3, scale: 0.95 }}
        animate={{ opacity: 1, rotate: 2, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
      />

      <div className="container-responsive relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[13px] font-semibold tracking-wide text-primary sm:text-sm">
            창의융합 뇌교육 플랫폼
          </span>
          <Link
            href="/group"
            className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-[12px] font-semibold tracking-wide text-foreground/80 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:text-[13px]"
          >
            ㈜키네스 그룹 · 프랜차이즈 27년
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>

        <motion.h1
          className="mt-7 font-medium leading-[1.08] tracking-[-0.02em] break-keep text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[84px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
        >
          뇌교육 프랜차이즈,
          <br />
          <span className="font-black text-primary">두비전</span>
          <span className="font-black">입니다.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-[1.65] text-muted-foreground break-keep sm:text-[17px] lg:text-[19px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
        >
          교육 비즈니스를 성공으로 이끌기 위해
          <br className="hidden sm:inline" />
          검증된 서비스를 제공합니다.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
        >
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-[8px] bg-foreground px-7 py-3.5 text-[14px] font-semibold text-background transition-colors hover:bg-primary sm:px-8 sm:text-[15px]"
          >
            무료 상담 신청
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/franchise"
            className="flex items-center gap-2 rounded-[8px] border border-border bg-white px-7 py-3.5 text-[14px] font-semibold transition-colors hover:border-foreground sm:px-8 sm:text-[15px]"
          >
            가맹 안내 보기
          </Link>
        </motion.div>

        {/* Trust badges — 프레임 밖 하단 */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-6 rounded-full bg-white/70 px-6 py-3 text-[13px] text-muted-foreground shadow-sm backdrop-blur sm:mt-24 sm:gap-10 sm:text-sm lg:mt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            ㈜키네스 그룹 · 27년
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            직영 3개 센터
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            특허 보유 기술
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            BEP 3~6개월
          </div>
        </motion.div>
      </div>
    </section>
  );
}
