"use client";

import { useTransition } from "react";
import { ShieldCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleAdminVerified } from "../actions";

export default function VerifyButton({
  franchiseeId,
  templateId,
  verified,
}: {
  franchiseeId: string;
  templateId: string;
  verified: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => toggleAdminVerified(franchiseeId, templateId))
      }
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[10.5px] font-semibold transition-colors",
        verified
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-border bg-background text-muted-foreground hover:bg-accent"
      )}
    >
      {verified ? (
        <>
          <ShieldCheck className="h-3 w-3" />
          검증됨
        </>
      ) : (
        <>
          <Shield className="h-3 w-3" />
          검증
        </>
      )}
    </button>
  );
}
