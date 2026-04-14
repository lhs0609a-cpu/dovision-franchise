"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { createFAQ, deleteFAQ, toggleFAQPublish } from "@/actions/faq";
import { FAQ_CATEGORIES } from "@/types";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then(setFaqs)
      .catch(() => {});
  }, []);

  async function handleCreate(formData: FormData) {
    const result = await createFAQ(formData);
    if (result.success) {
      toast.success("FAQ가 등록되었습니다.");
      setShowForm(false);
      // Refresh
      fetch("/api/admin/faq").then((r) => r.json()).then(setFaqs);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteFAQ(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success("삭제되었습니다.");
  }

  async function handleToggle(id: string, isPublished: boolean) {
    await toggleFAQPublish(id, !isPublished);
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isPublished: !isPublished } : f))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQ 관리</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          새 FAQ
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 FAQ 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select name="category" defaultValue="general">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FAQ_CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>질문</Label>
                <Input name="question" required />
              </div>
              <div className="space-y-2">
                <Label>답변</Label>
                <Textarea name="answer" rows={3} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit">등록</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {FAQ_CATEGORIES[faq.category] || faq.category}
                    </Badge>
                    <Badge variant={faq.isPublished ? "default" : "secondary"}>
                      {faq.isPublished ? "공개" : "비공개"}
                    </Badge>
                  </div>
                  <p className="mt-2 font-medium">Q. {faq.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">A. {faq.answer}</p>
                </div>
                <div className="ml-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(faq.id, faq.isPublished)}
                  >
                    {faq.isPublished ? "비공개" : "공개"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
