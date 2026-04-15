"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TrainingEffects() {
  return (
    <section className="snap-section relative bg-background py-20">
      <div className="container-responsive">
        {/* Header — 원본 "트레이닝 효과" 타이틀 이미지 */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="relative mx-auto aspect-[16/3] w-full max-w-[640px]">
            <Image
              src="/images/dovision/image_04_01.png"
              alt="이미지 전환 기억법 트레이닝 효과"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-contain"
            />
          </div>
        </motion.div>

        <motion.p
          className="mx-auto max-w-xl text-center text-[15px] font-medium text-muted-foreground sm:text-[17px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          실제 학년별 기억량 향상 데이터로 검증된 결과
        </motion.p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
          {/* LEFT — 전/후 비교 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[20px] border border-border/50 bg-card shadow-xl">
              <Image
                src="/images/dovision/image_04_02.png"
                alt="트레이닝 전/후 기억량 비교 차트"
                width={680}
                height={1480}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>

          {/* RIGHT — 스트레스 최소화 / 자신감 결과 이미지 */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div className="relative aspect-[7/3] w-full overflow-hidden rounded-[20px] border border-border/50 bg-[oklch(0.97_0.005_290)] shadow-lg">
                <Image
                  src="/images/dovision/image_07.png"
                  alt="암기와 공부에 대한 자신감을 심어줍니다"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              className="rounded-[20px] border border-border/50 bg-card p-8 sm:p-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h3 className="font-bold leading-[1.2] tracking-[-0.02em] text-[22px] sm:text-[28px] lg:text-[32px]">
                <span className="text-primary">학년별 평균 200~600%</span>
                <br />
                기억량 향상
              </h3>
              <ul className="mt-5 space-y-3 text-[14px] leading-[1.7] text-muted-foreground sm:text-[15px]">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  초등학교 1학년: 8개 → 50개 (625% 증가)
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  초등 5·6학년: 12개 → 50개 (416% 증가)
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  중학교 3학년: 8개 → 30개 (375% 증가)
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  고등·대학생: 평균 200~270% 증가
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
