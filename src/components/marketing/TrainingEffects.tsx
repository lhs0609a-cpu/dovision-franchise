"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TrainingEffects() {
  return (
    <section className="snap-section relative bg-background py-20">
      <div className="container-responsive">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
            TRAINING EFFECTS
          </p>
          <h2 className="mt-4 font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            트레이닝 <span className="text-primary">전/후</span> 비교
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
            실제 학년별 기억량 향상 데이터로 검증된 결과
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-[480px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-[20px] border border-border/50 bg-card shadow-xl">
            <Image
              src="/images/dovision/image_04_02.png"
              alt="트레이닝 전/후 기억량 비교 차트"
              width={680}
              height={1480}
              sizes="(max-width: 768px) 100vw, 480px"
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
