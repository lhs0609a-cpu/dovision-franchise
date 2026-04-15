"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

const subBadges = ["MEMORY", "NEUROFEEDBACK", "BTS", "FRANCHISE"];

export default function FullBleedCTA() {
  return (
    <section className="snap-section relative overflow-hidden bg-primary text-primary-foreground">
      {/* 배경 이미지 (image_08) */}
      <Image
        src="/images/dovision/image_08.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        priority={false}
        className="absolute inset-0 object-cover opacity-30 mix-blend-overlay"
      />

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.15),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_90%,rgba(0,0,0,0.25),transparent_60%)]" />

      <div className="container-responsive relative z-10 flex flex-col items-center justify-center text-center">
        {/* 상단 cue — image_09 */}
        <motion.div
          className="relative mb-6 aspect-[16/3] w-full max-w-[520px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/dovision/image_09.png"
            alt="더 자세한 정보가 궁금하신가요?"
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="object-contain brightness-0 invert"
          />
        </motion.div>

        <motion.p
          className="text-[13px] font-semibold tracking-[0.2em] text-white/80 sm:text-[14px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          창의융합 뇌교육의 모든 것
        </motion.p>

        <motion.h2
          className="mt-5 font-black leading-[0.95] tracking-[-0.03em] text-[44px] sm:text-[72px] lg:text-[96px] xl:text-[120px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          ALL ABOUT
          <br />
          BRAIN EDUCATION
        </motion.h2>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {subBadges.map((label) => (
            <span
              key={label}
              className="rounded-md bg-white/15 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white backdrop-blur sm:text-[12px]"
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-bold text-foreground transition-transform hover:translate-y-[-2px] sm:px-8 sm:text-[15px]"
          >
            Team Dovision
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/franchise"
            className="flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-[14px] font-bold text-white backdrop-blur transition-colors hover:bg-white/15 sm:px-8 sm:text-[15px]"
          >
            회사소개서 다운로드
            <Download className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
