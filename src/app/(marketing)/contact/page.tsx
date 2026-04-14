import { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";
import SectionFadeIn from "@/components/marketing/SectionFadeIn";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "상담 신청",
  description: "두비전 가맹 상담을 신청하세요. 전문 상담사가 친절하게 안내해 드립니다.",
};

export default function ContactPage() {
  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionFadeIn>
            <h1 className="text-4xl font-extrabold sm:text-5xl">가맹 상담 신청</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              아래 정보를 작성해 주시면 전문 상담사가 빠르게 연락드리겠습니다
            </p>
          </SectionFadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <SectionFadeIn delay={0.2}>
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">다른 방법으로 문의하기</h3>
                  <div className="space-y-4">
                    <a href="tel:02-558-2733" className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">전화 상담</p>
                        <p className="text-sm text-muted-foreground">02-558-2733</p>
                      </div>
                    </a>
                    <a href="tel:031-758-2758" className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">대표 전화</p>
                        <p className="text-sm text-muted-foreground">031-758-2758</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">이메일</p>
                        <p className="text-sm text-muted-foreground">info@dovision.kr</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">직영 센터</p>
                        <p className="text-sm text-muted-foreground">강남점 / 반포점 / 위례점</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">상담 가능 시간</p>
                        <p className="text-sm text-muted-foreground">평일 09:00 ~ 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionFadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
