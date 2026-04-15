"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MemoryPrinciple() {
  return (
    <section className="snap-section relative overflow-hidden bg-[oklch(0.97_0.005_290)] py-20">
      <div className="container-responsive">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
            MEMORY PRINCIPLE
          </p>
          <h2 className="mt-4 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            이미지전환기억법의 <span className="text-primary">원리</span>
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* LEFT (2/5) — 헤드라인 이미지 + 원리 박스 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <motion.div
              className="relative aspect-[16/6] w-full overflow-hidden rounded-[14px] bg-background"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <Image
                src="/images/dovision/image_06_01.png"
                alt="1,000개의 정보도 동시에 기억"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain"
              />
            </motion.div>
            <motion.div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <Image
                src="/images/dovision/image_06_01_02.png"
                alt="이미지 전환 기억법의 기억 원리"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* RIGHT (3/5) — 원리 다이어그램 */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[20px] border border-border/50 bg-card shadow-xl">
              <Image
                src="/images/dovision/image_05.png"
                alt="이미지전환기억법 원리 다이어그램"
                width={960}
                height={980}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
