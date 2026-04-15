"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LearningProcess() {
  return (
    <section className="snap-section relative bg-[oklch(0.97_0.005_290)] py-20">
      <div className="container-responsive">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
            LEARNING PROCESS
          </p>
          <h2 className="mt-4 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            4단계 학습 프로세스
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
            키워드 정리부터 문제 풀이까지, 단계별로 체화되는 학습 흐름
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-[760px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-[20px] border border-border/50 bg-card shadow-xl">
            <Image
              src="/images/dovision/image_06_02.png"
              alt="4단계 학습 적용 프로세스"
              width={960}
              height={1520}
              sizes="(max-width: 768px) 100vw, 760px"
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
