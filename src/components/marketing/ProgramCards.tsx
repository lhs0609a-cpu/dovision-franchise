"use client";

import { motion } from "framer-motion";
import { Brain, Zap, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    icon: Brain,
    badge: "DOVISION MEMORY",
    title: "이미지전환기억법",
    subtitle: "특허 등록 기술",
    description:
      "숫자, 단어, 이미지를 연결하여 장기기억으로 전환하는 독자적 기억법. 48주 커리큘럼으로 기억력 최대 600% 향상.",
    bgClass:
      "bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.18_290),oklch(0.18_0.08_290))]",
  },
  {
    icon: Zap,
    badge: "DOVISION NEURO",
    title: "뉴로피드백 트레이닝",
    subtitle: "뇌파 기반 과학 훈련",
    description:
      "뇌파 측정 장비를 활용한 실시간 바이오피드백 훈련. 목적별 맞춤 훈련으로 두뇌 잠재력을 깨웁니다.",
    bgClass:
      "bg-[radial-gradient(circle_at_70%_30%,oklch(0.32_0.06_260),oklch(0.14_0.02_260))]",
  },
  {
    icon: BookOpen,
    badge: "DOVISION BTS",
    title: "BTS 시스템",
    subtitle: "Brain Training Skill",
    description:
      "9가지 모듈로 구성된 종합 두뇌 훈련 시스템. 집중력, 기억력, 창의력을 체계적으로 발달시킵니다.",
    bgClass:
      "bg-[radial-gradient(circle_at_50%_80%,oklch(0.38_0.14_280),oklch(0.15_0.04_280))]",
  },
];

export default function ProgramCards() {
  return (
    <section className="snap-section relative bg-background py-20">
      <div className="container-responsive">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <h2 className="font-bold leading-[1.15] tracking-[-0.02em] text-[32px] sm:text-[44px] lg:text-[56px]">
            창의융합 뇌교육 플랫폼,
            <br />
            <span className="text-primary">두비전</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium text-muted-foreground sm:text-[17px]">
            과학적으로 검증된 3대 핵심 프로그램
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              className={`group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[20px] ${program.bgClass} p-8 text-white transition-all hover:scale-[1.01] sm:p-10 xl:min-h-[480px]`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
            >
              {/* Noise/texture overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.06),transparent_60%)]" />

              {/* Top — badge + icon */}
              <div className="relative flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                  {program.badge}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <program.icon className="h-5 w-5" />
                </div>
              </div>

              {/* Bottom — title, desc, CTA */}
              <div className="relative mt-auto">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">
                  {program.subtitle}
                </p>
                <h3 className="mt-2 text-[24px] font-black leading-tight sm:text-[28px]">
                  {program.title}
                </h3>
                <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.65] text-white/75 sm:text-[14px]">
                  {program.description}
                </p>
                <Link
                  href="/program"
                  className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-foreground transition-transform hover:translate-x-0.5 sm:text-[14px]"
                >
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
