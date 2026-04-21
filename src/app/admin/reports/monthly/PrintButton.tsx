"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <div className="no-print sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          PRINT PREVIEW
        </p>
        <p className="text-[11px] text-muted-foreground">
          Ctrl+P (Cmd+P) 또는 우측 버튼 → "PDF로 저장"
        </p>
      </div>
      <Button onClick={() => window.print()} className="gap-1.5">
        <Printer className="h-3.5 w-3.5" />
        PDF 저장 / 인쇄
      </Button>
    </div>
  );
}
