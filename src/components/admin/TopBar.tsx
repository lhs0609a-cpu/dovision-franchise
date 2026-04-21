"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Search,
  Bell,
  LogOut,
  Building2,
  MessageSquare,
  FileText,
  CircleUser,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SearchHit = {
  type: "franchisee" | "inquiry" | "contract";
  id: string;
  title: string;
  sub?: string;
  href: string;
};

type Alert = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body: string;
  href?: string;
  when: string;
};

type Props = {
  userName: string;
  userEmail: string;
  roleLabel?: string;
  alerts: Alert[];
};

export default function TopBar({ userName, userEmail, roleLabel, alerts }: Props) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ⌘K / Ctrl+K 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => searchInputRef.current?.focus(), 10);
  }, [searchOpen]);

  // 검색 (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setHits(data.hits || []);
        }
      } finally {
        setSearching(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const totalAlerts = alerts.length;

  return (
    <>
      <header className="flex h-14 items-center justify-between gap-4 border-b bg-white px-5">
        {/* 검색 버튼 */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-w-[280px] flex-1 items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-muted/70 sm:max-w-md"
        >
          <Search className="h-3.5 w-3.5" />
          <span>가맹점·문의·계약 검색</span>
          <span className="ml-auto rounded border bg-white px-1.5 py-0.5 text-[10px] font-semibold">
            ⌘ K
          </span>
        </button>

        {/* 우측: 알림 + 프로필 */}
        <div className="flex items-center gap-2">
          {/* 알림 벨 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative rounded-md p-1.5 hover:bg-muted"
              aria-label="알림"
            >
              <Bell className="h-4 w-4" />
              {totalAlerts > 0 && (
                <span
                  className={cn(
                    "absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white",
                    criticalCount > 0 ? "bg-rose-500" : "bg-amber-500"
                  )}
                >
                  {totalAlerts > 9 ? "9+" : totalAlerts}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-40 mt-1 w-80 rounded-lg border bg-white shadow-lg">
                <div className="border-b px-3 py-2">
                  <p className="text-[12px] font-bold">알림</p>
                  <p className="text-[10.5px] text-muted-foreground">
                    긴급 {criticalCount} · 주의 {warningCount} · 일반{" "}
                    {totalAlerts - criticalCount - warningCount}
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="p-6 text-center text-[11.5px] text-muted-foreground">
                      새 알림이 없습니다.
                    </p>
                  ) : (
                    alerts.map((a) => (
                      <NotifItem
                        key={a.id}
                        alert={a}
                        onClick={() => {
                          if (a.href) router.push(a.href);
                          setNotifOpen(false);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 프로필 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] hover:bg-muted"
            >
              <CircleUser className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[120px] truncate font-medium">
                {userName}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-lg border bg-white shadow-lg">
                <div className="border-b p-3">
                  <p className="text-[12.5px] font-bold">{userName}</p>
                  <p className="text-[10.5px] text-muted-foreground">
                    {userEmail}
                  </p>
                  {roleLabel && (
                    <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[9.5px] font-bold text-primary">
                      {roleLabel}
                    </span>
                  )}
                </div>
                <div className="p-1">
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] hover:bg-muted"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 커맨드 팔레트 (⌘K) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="가맹점명·이름·전화·이메일·문의 내용 검색"
                className="flex-1 bg-transparent text-[13.5px] outline-none"
              />
              <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                ESC
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="p-6 text-center text-[11.5px] text-muted-foreground">
                  검색어를 입력하세요 — 가맹점·문의·계약서 전체에서 조회
                </div>
              )}
              {query && searching && (
                <div className="p-4 text-center text-[11.5px] text-muted-foreground">
                  검색 중...
                </div>
              )}
              {query && !searching && hits.length === 0 && (
                <div className="p-4 text-center text-[11.5px] text-muted-foreground">
                  결과 없음
                </div>
              )}
              {hits.map((hit) => (
                <Link
                  key={`${hit.type}-${hit.id}`}
                  href={hit.href}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-start gap-3 border-b border-border/50 px-4 py-2.5 last:border-b-0 hover:bg-muted"
                >
                  <HitIcon type={hit.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold">{hit.title}</p>
                    {hit.sub && (
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {hit.sub}
                      </p>
                    )}
                  </div>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-muted-foreground">
                    {HIT_LABEL[hit.type]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const HIT_LABEL: Record<SearchHit["type"], string> = {
  franchisee: "가맹점",
  inquiry: "문의",
  contract: "계약",
};

function HitIcon({ type }: { type: SearchHit["type"] }) {
  const Icon =
    type === "franchisee"
      ? Building2
      : type === "inquiry"
        ? MessageSquare
        : FileText;
  return (
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
  );
}

function NotifItem({
  alert,
  onClick,
}: {
  alert: Alert;
  onClick: () => void;
}) {
  const color =
    alert.severity === "critical"
      ? "border-l-rose-500 bg-rose-50/50"
      : alert.severity === "warning"
        ? "border-l-amber-500 bg-amber-50/50"
        : "border-l-slate-300";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2 border-b border-border/50 border-l-2 px-3 py-2 text-left last:border-b-0 hover:bg-muted/50",
        color
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-semibold">{alert.title}</p>
        <p className="mt-0.5 text-[10.5px] text-muted-foreground">
          {alert.body}
        </p>
      </div>
      <span className="shrink-0 text-[9.5px] text-muted-foreground">
        {alert.when}
      </span>
    </button>
  );
}
