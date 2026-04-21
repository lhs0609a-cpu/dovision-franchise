"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UploadForm() {
  const router = useRouter();
  const [version, setVersion] = useState(defaultVersion());
  const [title, setTitle] = useState("두비전 가맹계약서");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [note, setNote] = useState("");
  const [setActive, setSetActive] = useState(true);
  const [uploading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("HWP 파일을 선택해주세요.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".hwp")) {
      setError("HWP 파일만 업로드 가능합니다.");
      return;
    }
    if (!version.trim()) {
      setError("버전을 입력해주세요.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("version", version.trim());
    fd.append("title", title.trim());
    fd.append("effectiveFrom", effectiveFrom);
    fd.append("note", note);
    fd.append("setActive", String(setActive));

    startTransition(async () => {
      const res = await fetch("/api/admin/contracts/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `업로드 실패 (${res.status})`);
        return;
      }
      router.refresh();
      // reset form
      if (fileRef.current) fileRef.current.value = "";
      setVersion(defaultVersion());
      setNote("");
      setEffectiveFrom("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-version">버전</Label>
          <Input
            id="ct-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v2026.04.21"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-title">제목</Label>
          <Input
            id="ct-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-effective">적용 시작일 (선택)</Label>
          <Input
            id="ct-effective"
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-file">HWP 파일</Label>
          <Input
            id="ct-file"
            ref={fileRef}
            type="file"
            accept=".hwp"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ct-note">개정 사유 메모 (선택)</Label>
        <Textarea
          id="ct-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="예: 본사 공급원가 조항 개정, 수수료 구조 변경"
        />
      </div>

      <label className="flex items-center gap-2 text-[12.5px]">
        <input
          type="checkbox"
          checked={setActive}
          onChange={(e) => setSetActive(e.target.checked)}
          className="h-3.5 w-3.5"
        />
        업로드 즉시 활성 버전으로 지정 (기존 활성본은 자동 비활성화)
      </label>

      {error && (
        <p className="rounded-md bg-rose-50 p-2 text-[12px] text-rose-700">
          {error}
        </p>
      )}

      <Button type="submit" disabled={uploading} className="gap-2">
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> 업로드 중...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> 업로드
          </>
        )}
      </Button>
    </form>
  );
}

function defaultVersion(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `v${y}.${mm}.${dd}`;
}
