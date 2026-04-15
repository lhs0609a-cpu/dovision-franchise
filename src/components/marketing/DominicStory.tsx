"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DominicStory() {
  return (
    <section className="snap-section relative bg-background py-20">
      <div className="container-responsive">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — story headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <p className="text-[13px] font-semibold tracking-[0.2em] text-primary sm:text-[14px]">
              MEMORY GENIUS STORY
            </p>
            <h2 className="mt-4 font-medium leading-[1.1] tracking-[-0.02em] break-keep text-[34px] sm:text-[46px] lg:text-[58px]">
              기억력은 <span className="font-black text-primary">타고나는 것</span>이 아니라
              <br />
              <span className="font-black">누구나 연습하면 되는 것.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] font-medium leading-[1.7] text-muted-foreground break-keep sm:text-[17px]">
              학창 시절 난독증으로 16세에 학교를 그만뒀던 도미닉 오브라이언은
              &ldquo;정보의 이미지화&rdquo; 훈련만으로 세계 기억력 선수권에서
              8번이나 우승했습니다. 두비전은 그의 핵심 원리를 체계화한
              프로그램입니다.
            </p>
          </motion.div>

          {/* RIGHT — dominic image + frame */}
          <div className="relative hidden h-[540px] lg:block">
            <motion.div
              aria-hidden
              className="absolute left-4 top-4 h-[500px] w-[420px] border-[10px] border-primary"
              initial={{ opacity: 0, rotate: 4, scale: 0.95 }}
              whileInView={{ opacity: 1, rotate: 2, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-0 top-0 h-[520px] w-[440px] overflow-hidden rounded-[14px] bg-white shadow-2xl"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <Image
                src="/images/dovision/image_02.png"
                alt="도미닉 오브라이언 세계 기억력 챔피언 스토리"
                fill
                sizes="440px"
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
