"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PatentBadge() {
  return (
    <section className="snap-section relative overflow-hidden bg-[oklch(0.97_0.005_290)] py-20">
      <div className="container-responsive">
        <div className="grid items-center gap-12 lg:grid-cols-[3fr_4fr] lg:gap-16">
          {/* LEFT — patent certificate image */}
          <motion.div
            className="relative mx-auto aspect-[5/6] w-full max-w-[420px] overflow-hidden rounded-[18px] border border-border/50 bg-background shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/dovision/image_03.png"
              alt="두비전 이미지전환기억법 특허증"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-contain"
            />
          </motion.div>

          {/* RIGHT — explanation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeInOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[12px] font-bold text-primary sm:text-[13px]">
              <ShieldCheck className="h-4 w-4" />
              특허청 등록 완료
            </div>
            <h2 className="mt-5 font-medium leading-[1.1] tracking-[-0.02em] break-keep text-[34px] sm:text-[46px] lg:text-[58px]">
              경쟁사 진입 불가,
              <br />
              <span className="font-black text-primary">독점적 교육권</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] font-medium leading-[1.7] text-muted-foreground break-keep sm:text-[17px]">
              두비전의 이미지전환기억법은 대한민국 특허청에 정식 등록된
              독자 기술입니다. 동일 기술 기반 경쟁 프랜차이즈 진입이
              법적으로 차단되어, 가맹점주는 <strong className="text-foreground">지역 독점권</strong>과
              함께 안정적인 영업권을 확보할 수 있습니다.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <p className="text-[12px] font-semibold text-muted-foreground">등록 기관</p>
                <p className="mt-1 text-[15px] font-bold">대한민국 특허청</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <p className="text-[12px] font-semibold text-muted-foreground">보호 범위</p>
                <p className="mt-1 text-[15px] font-bold">이미지 전환 기억법</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <p className="text-[12px] font-semibold text-muted-foreground">지역 독점</p>
                <p className="mt-1 text-[15px] font-bold">가맹점별 영업권</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
