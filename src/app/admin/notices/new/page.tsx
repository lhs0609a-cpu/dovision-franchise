"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createNotice } from "@/actions/notice";
import { toast } from "sonner";
import Link from "next/link";

export default function NewNoticePage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await createNotice(formData);
    if (result.success) {
      toast.success("공지사항이 등록되었습니다.");
      router.push("/admin/notices");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/notices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">새 공지사항</h1>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>공지사항 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea id="content" name="content" rows={10} required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="isPinned" name="isPinned" value="true" />
              <Label htmlFor="isPinned">상단 고정</Label>
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
