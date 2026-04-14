"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createTestimonial } from "@/actions/testimonial";
import { toast } from "sonner";
import Link from "next/link";

export default function NewTestimonialPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await createTestimonial(formData);
    if (result.success) {
      toast.success("성과사례가 등록되었습니다.");
      router.push("/admin/testimonials");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">새 성과사례</h1>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>성과사례 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentName">학생 이름</Label>
                <Input id="studentName" name="studentName" placeholder="김O준" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">학년</Label>
                <Input id="grade" name="grade" placeholder="초등학교 5학년" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">수강 기간</Label>
                <Input id="duration" name="duration" placeholder="6개월" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievement">핵심 성과</Label>
                <Input id="achievement" name="achievement" placeholder="기억량 600% 향상" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">후기 내용</Label>
              <Textarea id="content" name="content" rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">이미지 URL (선택)</Label>
              <Input id="imageUrl" name="imageUrl" />
            </div>
            <Button type="submit" className="w-full">
              등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
