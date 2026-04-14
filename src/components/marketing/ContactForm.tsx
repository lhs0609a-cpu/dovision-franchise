"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { REGIONS, BUDGET_OPTIONS } from "@/types";
import { submitInquiry } from "@/actions/inquiry";
import { toast } from "sonner";
import SectionFadeIn from "./SectionFadeIn";

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await submitInquiry(formData);
      if (result.success) {
        setSubmitted(true);
        toast.success("상담 신청이 접수되었습니다!");
      } else {
        toast.error(result.error || "접수 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold">상담 신청 완료!</h3>
        <p className="mt-2 text-muted-foreground">
          빠른 시간 내에 담당자가 연락 드리겠습니다.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          전화: 02-558-2733 | 카카오톡 상담 가능
        </p>
      </div>
    );
  }

  return (
    <SectionFadeIn>
      <form action={handleSubmit} className="rounded-xl border bg-card p-6 sm:p-8">
        {!compact && (
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold">무료 상담 신청</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              아래 정보를 남겨주시면 빠르게 연락드리겠습니다
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input id="name" name="name" placeholder="홍길동" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">연락처 *</Label>
            <Input id="phone" name="phone" placeholder="010-0000-0000" required />
          </div>
          {!compact && (
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="region">희망 지역 *</Label>
            <Select name="region" required>
              <SelectTrigger>
                <SelectValue placeholder="지역 선택" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!compact && (
            <>
              <div className="space-y-2">
                <Label htmlFor="budget">투자 예산</Label>
                <Select name="budget">
                  <SelectTrigger>
                    <SelectValue placeholder="예산 범위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">교육업 경험</Label>
                <Select name="experience">
                  <SelectTrigger>
                    <SelectValue placeholder="경험 여부 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="있음">있음</SelectItem>
                    <SelectItem value="없음">없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {!compact && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="message">추가 문의사항</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="궁금한 점을 자유롭게 적어주세요"
              rows={3}
            />
          </div>
        )}

        <div className="mt-4 flex items-start gap-2">
          <Checkbox id="privacy" name="privacy" required />
          <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
            개인정보 수집 및 이용에 동의합니다. (이름, 연락처, 이메일 등을 상담 목적으로 수집합니다)
          </Label>
        </div>

        <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
          {pending ? "접수 중..." : "상담 신청하기"}
        </Button>
      </form>
    </SectionFadeIn>
  );
}
