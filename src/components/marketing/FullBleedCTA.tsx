"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

const subBadges = ["MEMORY", "NEUROFEEDBACK", "BTS", "FRANCHISE"];

export default function FullBleedCTA() {
  return (
    <section className="snap-section relative overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_90%,rgba(0,0,0,0.15),transparent_60%)]" />

      <div className="container-responsive relative z-10 flex flex-col items-center justify-center text-center">
        <motion.p
          className="text-[13px] font-semibold tracking-[0.2em] text-white/80 sm:text-[14px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          창의융합 뇌교육의 모든 것
        </motion.p>

        <motion.h2
          className="mt-5 font-black leading-[0.95] tracking-[-0.03em] text-[44px] sm:text-[72px] lg:text-[96px] xl:text-[120px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
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
          transition={{ duration: 0.6, delay: 0.4 }}
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
          transition={{ duration: 0.6, delay: 0.55 }}
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
