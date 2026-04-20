"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { updateInquiryStatus, updateInquiryNote } from "@/actions/inquiry";
import { createFranchiseeFromInquiry } from "@/app/admin/franchisees/actions";
import { INQUIRY_STATUS_LABELS } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";

interface InquiryDetail {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  region: string;
  budget: string | null;
  experience: string | null;
  message: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/inquiries/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setInquiry(data);
        setNote(data.adminNote || "");
      })
      .catch(() => toast.error("문의 정보를 불러올 수 없습니다."));
  }, [params.id]);

  if (!inquiry) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  async function handleStatusChange(value: string | null) {
    if (!value) return;
    const result = await updateInquiryStatus(inquiry!.id, value);
    if (result.success) {
      setInquiry((prev) => (prev ? { ...prev, status: value } : null));
      toast.success("상태가 변경되었습니다.");
    }
  }

  async function handleSaveNote() {
    setSaving(true);
    const result = await updateInquiryNote(inquiry!.id, note);
    if (result.success) {
      toast.success("메모가 저장되었습니다.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inquiries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{inquiry.name}님 문의 상세</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>문의 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">이름</p>
                <p className="font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">연락처</p>
                <p className="font-medium">{inquiry.phone}</p>
              </div>
              {inquiry.email && (
                <div>
                  <p className="text-muted-foreground">이메일</p>
                  <p className="font-medium">{inquiry.email}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">희망 지역</p>
                <p className="font-medium">{inquiry.region}</p>
              </div>
              {inquiry.budget && (
                <div>
                  <p className="text-muted-foreground">투자 예산</p>
                  <p className="font-medium">{inquiry.budget}</p>
                </div>
              )}
              {inquiry.experience && (
                <div>
                  <p className="text-muted-foreground">교육업 경험</p>
                  <p className="font-medium">{inquiry.experience}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-muted-foreground">접수일</p>
                <p className="font-medium">
                  {new Date(inquiry.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
            {inquiry.message && (
              <div>
                <p className="text-sm text-muted-foreground">문의 내용</p>
                <p className="mt-1 rounded-md bg-muted p-3 text-sm">
                  {inquiry.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>상태 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={inquiry.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>관리자 메모</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="메모를 작성하세요..."
                rows={5}
              />
              <Button onClick={handleSaveNote} disabled={saving}>
                {saving ? "저장 중..." : "메모 저장"}
              </Button>
            </CardContent>
          </Card>

          {inquiry.status === "CONTRACTED" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  가맹점주 포털 계정 생성
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-[11.5px] text-muted-foreground">
                  계약 체결 완료 후 가맹점주 포털 로그인 계정을 생성하세요.
                  생성 시 개업 체크리스트가 자동 연결됩니다.
                </p>
                <form action={createFranchiseeFromInquiry} className="space-y-2">
                  <input type="hidden" name="inquiryId" value={inquiry.id} />
                  <Input
                    name="email"
                    type="email"
                    placeholder="가맹점주 로그인 이메일"
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="임시 비밀번호 (8자 이상)"
                    minLength={8}
                    required
                  />
                  <Input
                    name="centerName"
                    placeholder="센터명 (예: 두비전 분당정자점)"
                  />
                  <Input name="targetOpenDate" type="date" />
                  <Button type="submit" className="w-full">
                    포털 계정 생성
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
