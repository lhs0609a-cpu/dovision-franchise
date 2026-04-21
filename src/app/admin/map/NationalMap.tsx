"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, MapPin, X } from "lucide-react";
import {
  loadKakaoMaps,
  type KakaoMaps,
  type KMap,
  type KCustomOverlay,
} from "@/lib/kakao-maps-loader";

export type Pin = {
  id: string;
  kind: "franchisee" | "inquiry";
  name: string;
  region: string;
  status: string;
  lat: number;
  lng: number;
  centerName?: string | null;
  phone?: string;
};

type Filter = {
  franchisee: boolean;
  inquiry: boolean;
  operating: boolean;
  onboarding: boolean;
  terminated: boolean;
};

const PIN_COLORS: Record<string, string> = {
  OPERATING: "#10b981",
  ONBOARDING: "#8b5cf6",
  SUSPENDED: "#64748b",
  TERMINATED: "#94a3b8",
  NEW: "#f59e0b",
  CONTACTED: "#fb923c",
  CONSULTING: "#ea580c",
  VISITED: "#ec4899",
};

export default function NationalMap({ pins }: { pins: Pin[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KMap | null>(null);
  const overlaysRef = useRef<KCustomOverlay[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [selected, setSelected] = useState<Pin | null>(null);
  const [filter, setFilter] = useState<Filter>({
    franchisee: true,
    inquiry: true,
    operating: true,
    onboarding: true,
    terminated: false,
  });

  const filteredPins = useMemo(() => {
    return pins.filter((p) => {
      if (p.kind === "franchisee" && !filter.franchisee) return false;
      if (p.kind === "inquiry" && !filter.inquiry) return false;
      if (p.kind === "franchisee") {
        if (p.status === "OPERATING" && !filter.operating) return false;
        if (p.status === "ONBOARDING" && !filter.onboarding) return false;
        if (p.status === "TERMINATED" && !filter.terminated) return false;
      }
      return true;
    });
  }, [pins, filter]);

  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kmaps) => {
        if (cancelled || !containerRef.current) return;
        const center = new kmaps.LatLng(36.5, 127.8); // 대한민국 중심
        const map = new kmaps.Map(containerRef.current, {
          center,
          level: 13,
        });
        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  // 핀 렌더 (필터 변경 시 재렌더)
  useEffect(() => {
    if (status !== "ready") return;
    const kmaps = window.kakao?.maps;
    const map = mapRef.current;
    if (!kmaps || !map) return;

    // 기존 오버레이 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    for (const pin of filteredPins) {
      const ov = new kmaps.CustomOverlay({
        position: new kmaps.LatLng(pin.lat, pin.lng),
        content: pinHTML(pin),
        xAnchor: 0.5,
        yAnchor: 0.5,
        clickable: true,
        zIndex: pin.kind === "franchisee" ? 10 : 5,
      });
      ov.setMap(map);
      // click via DOM event — not directly supported; use setContent's onclick
      overlaysRef.current.push(ov);
    }

    // 클릭 위임 — 컨테이너 전체에서 data-pin-id 클릭 감지
    const el = containerRef.current;
    if (!el) return;
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const pinEl = target.closest<HTMLElement>("[data-pin-id]");
      if (!pinEl) return;
      const id = pinEl.dataset.pinId;
      const kind = pinEl.dataset.pinKind;
      const found = filteredPins.find(
        (p) => p.id === id && p.kind === kind
      );
      if (found) setSelected(found);
    }
    el.addEventListener("click", handler);
    return () => {
      el.removeEventListener("click", handler);
    };
  }, [filteredPins, status]);

  const counts = useMemo(() => {
    const franchiseeCount = pins.filter((p) => p.kind === "franchisee").length;
    const inquiryCount = pins.filter((p) => p.kind === "inquiry").length;
    const operatingCount = pins.filter(
      (p) => p.kind === "franchisee" && p.status === "OPERATING"
    ).length;
    const onboardingCount = pins.filter(
      (p) => p.kind === "franchisee" && p.status === "ONBOARDING"
    ).length;
    return { franchiseeCount, inquiryCount, operatingCount, onboardingCount };
  }, [pins]);

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div ref={containerRef} className="h-[640px] w-full bg-muted/20" />

      {/* 필터 */}
      {status === "ready" && (
        <div className="absolute left-4 top-4 w-[220px] rounded-xl border bg-white/95 p-3 text-[11.5px] shadow-md backdrop-blur">
          <p className="mb-2 text-[10px] font-bold tracking-[0.15em] text-muted-foreground">
            FILTER
          </p>
          <div className="space-y-1.5">
            <FilterRow
              checked={filter.franchisee}
              onChange={(v) => setFilter({ ...filter, franchisee: v })}
              label={`가맹점 (${counts.franchiseeCount})`}
            />
            <div className="ml-4 space-y-1">
              <FilterRow
                checked={filter.operating}
                onChange={(v) => setFilter({ ...filter, operating: v })}
                label={`운영 중 ${counts.operatingCount}`}
                dot="#10b981"
                compact
              />
              <FilterRow
                checked={filter.onboarding}
                onChange={(v) => setFilter({ ...filter, onboarding: v })}
                label={`준비 중 ${counts.onboardingCount}`}
                dot="#8b5cf6"
                compact
              />
              <FilterRow
                checked={filter.terminated}
                onChange={(v) => setFilter({ ...filter, terminated: v })}
                label="해지 포함"
                dot="#94a3b8"
                compact
              />
            </div>
            <FilterRow
              checked={filter.inquiry}
              onChange={(v) => setFilter({ ...filter, inquiry: v })}
              label={`진행 중 문의 (${counts.inquiryCount})`}
              dot="#f59e0b"
            />
          </div>
        </div>
      )}

      {/* 로딩/에러 */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-[12px] font-semibold">지도 로딩 중...</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-6">
          <div className="text-center text-[12px]">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-rose-500" />
            <p className="font-bold">지도를 불러올 수 없습니다</p>
            <p className="mt-1 max-w-[320px] text-muted-foreground">
              Kakao Maps JS 키·도메인 등록 확인
            </p>
          </div>
        </div>
      )}

      {/* 상세 사이드시트 */}
      {selected && (
        <div className="absolute right-4 top-4 w-[300px] rounded-xl border bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[9.5px] font-bold uppercase">
                {selected.kind === "franchisee" ? "가맹점" : "문의"}
              </span>
              <p className="mt-1.5 text-[15px] font-bold">{selected.name}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {selected.region}
                {selected.centerName && ` · ${selected.centerName}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-md p-1 hover:bg-muted"
              aria-label="닫기"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 space-y-1 text-[11.5px]">
            <p>
              <span className="text-muted-foreground">상태:</span>{" "}
              <span className="font-semibold">
                {statusLabel(selected.status)}
              </span>
            </p>
            {selected.phone && (
              <p>
                <span className="text-muted-foreground">연락처:</span>{" "}
                <a
                  href={`tel:${selected.phone}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {selected.phone}
                </a>
              </p>
            )}
          </div>
          <Link
            href={
              selected.kind === "franchisee"
                ? `/admin/franchisees/${selected.id}`
                : `/admin/inquiries/${selected.id}`
            }
            className="mt-3 inline-block w-full rounded-md bg-primary px-3 py-1.5 text-center text-[12px] font-semibold text-white hover:bg-primary/90"
          >
            상세 페이지 열기 →
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  checked,
  onChange,
  label,
  dot,
  compact,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  dot?: string;
  compact?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3 w-3"
      />
      {dot && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: dot }}
        />
      )}
      <span className={compact ? "text-[10.5px]" : ""}>{label}</span>
    </label>
  );
}

function statusLabel(s: string): string {
  switch (s) {
    case "OPERATING":
      return "운영 중";
    case "ONBOARDING":
      return "개업 준비 중";
    case "SUSPENDED":
      return "휴업";
    case "TERMINATED":
      return "해지";
    case "NEW":
      return "신규 문의";
    case "CONTACTED":
      return "연락 완료";
    case "CONSULTING":
      return "상담 중";
    case "VISITED":
      return "방문 완료";
    default:
      return s;
  }
}

function pinHTML(pin: Pin): string {
  const color =
    PIN_COLORS[pin.status] ?? (pin.kind === "franchisee" ? "#10b981" : "#f59e0b");
  const size = pin.kind === "franchisee" ? 16 : 12;
  const ring = pin.kind === "franchisee" ? 4 : 3;
  return `
    <div data-pin-id="${escapeAttr(pin.id)}" data-pin-kind="${pin.kind}" style="
      cursor:pointer;
      width:${size}px;height:${size}px;
      border-radius:9999px;
      background:${color};
      border:2px solid white;
      box-shadow:0 0 0 ${ring}px ${color}33,0 2px 6px rgba(0,0,0,0.2);
    " title="${escapeAttr(pin.name)}"></div>
  `;
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
