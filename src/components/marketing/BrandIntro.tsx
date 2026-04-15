"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Award, Brain, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "25년 뇌교육 노하우",
    description: "2001년부터 축적된 뇌교육 연구와 교육 경험",
  },
  {
    icon: Shield,
    title: "특허 보유 기술",
    description: "이미지전환기억법 특허 등록, 독점적 커리큘럼",
  },
  {
    icon: Award,
    title: "검증된 성과",
    description: "서울대 합격생 배출, 기억량 600% 향상 실증",
  },
  {
    icon: Lightbulb,
    title: "뉴로피드백",
    description: "뇌파 측정 기반 과학적 집중력·기억력 훈련",
  },
];

export default function BrandIntro() {
  return (
    <section className="snap-section relative overflow-hidden bg-[oklch(0.97_0.005_290)] py-20">
      <div className="container-responsive">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — big headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 className="font-medium leading-[1.1] tracking-[-0.02em] break-keep text-[36px] sm:text-[48px] lg:text-[64px]">
              우리는
              <br />
              <span className="font-black text-primary">뇌교육 전문가</span>
              <span className="font-black">입니다.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] font-medium leading-[1.7] text-muted-foreground break-keep sm:text-[17px]">
              단순 주입식 교육이 아닌, 25년간 축적된
              <br className="hidden sm:inline" />
              과학적 뇌교육으로 학생 한 명 한 명의
              <br className="hidden sm:inline" />
              잠재력을 깨우는 일을 합니다.
            </p>
          </motion.div>

          {/* RIGHT — 뇌 그래픽 이미지 + 퍼플 프레임 장식 */}
          <div className="relative hidden h-[520px] lg:block">
            <motion.div
              aria-hidden
              className="absolute right-10 top-8 h-[460px] w-[340px] border-[10px] border-primary"
              initial={{ opacity: 0, rotate: -6, scale: 0.95 }}
              whileInView={{ opacity: 1, rotate: -3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <motion.div
              className="absolute right-0 top-0 h-[480px] w-[380px] overflow-hidden rounded-[14px] shadow-2xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <Image
                src="/images/dovision/image_01.png"
                alt="이미지전환기억법 뇌 그래픽"
                fill
                sizes="380px"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Feature cards — below the split */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-all hover:shadow-lg hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-[16px] font-bold sm:text-[18px]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
