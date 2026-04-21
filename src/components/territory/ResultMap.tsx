"use client";

// ============================================================
// AI 상권분석 결과 지도 (Kakao Maps 기반)
// ============================================================
// 실제 좌표로 학교·경쟁학원·일반학원·아파트를 지도 위에 시각화.
// 후보지 중심으로 반경 원 3겹 · fitBounds로 자동 줌.
// 하위 호환: input.lat/lng가 없으면(mock 데이터) null 반환 → 호출부에서 SVG 폴백.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import {
  loadKakaoMaps,
  type KakaoMaps,
  type KMap,
  type KCircle,
  type KCustomOverlay,
} from "@/lib/kakao-maps-loader";
import type { TerritoryAnalysis } from "@/lib/territory/types";

type Props = {
  analysis: TerritoryAnalysis;
};

export default function ResultMap({ analysis }: Props) {
  const { input, schools, academies, apartments } = analysis;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KMap | null>(null);
  const overlaysRef = useRef<Array<KCustomOverlay | KCircle>>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (input.lat == null || input.lng == null) {
      setStatus("error");
      setErrorMsg("좌표 정보가 없어 지도를 표시할 수 없습니다.");
      return;
    }

    loadKakaoMaps()
      .then((kmaps) => {
        if (cancelled || !containerRef.current) return;
        renderMap(kmaps, containerRef.current);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(
          err?.message?.includes("NEXT_PUBLIC_KAKAO_JS_KEY")
            ? "Kakao Maps 키가 설정되지 않았습니다."
            : "지도를 불러올 수 없습니다."
        );
      });

    function renderMap(kmaps: KakaoMaps, el: HTMLDivElement) {
      const center = new kmaps.LatLng(input.lat!, input.lng!);
      const map = new kmaps.Map(el, {
        center,
        level: radiusKmToLevel(input.radiusKm),
      });
      mapRef.current = map;

      // 반경 원 3겹 (구심감)
      const radii = [
        input.radiusKm * 1000 * 0.33,
        input.radiusKm * 1000 * 0.67,
        input.radiusKm * 1000,
      ];
      radii.forEach((r, i) => {
        const c = new kmaps.Circle({
          center,
          radius: r,
          strokeWeight: 1.2,
          strokeColor: "#7c3aed",
          strokeOpacity: 0.18 + i * 0.1,
          strokeStyle: "shortdash",
          fillColor: i === radii.length - 1 ? "#7c3aed" : "transparent",
          fillOpacity: i === radii.length - 1 ? 0.04 : 0,
          map,
        });
        overlaysRef.current.push(c);
      });

      // 후보지 (중심) — 펄스 효과
      const centerOverlay = new kmaps.CustomOverlay({
        position: center,
        content: centerMarkerHTML(input.address),
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 10,
      });
      centerOverlay.setMap(map);
      overlaysRef.current.push(centerOverlay);

      // 학교
      schools.forEach((s) => {
        if (s.lat == null || s.lng == null) return;
        const ov = new kmaps.CustomOverlay({
          position: new kmaps.LatLng(s.lat, s.lng),
          content: schoolMarkerHTML(s.name, s.level, s.placeUrl),
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 5,
          clickable: true,
        });
        ov.setMap(map);
        overlaysRef.current.push(ov);
      });

      // 경쟁 학원
      academies
        .filter((a) => a.isCompetitor)
        .forEach((a) => {
          if (a.lat == null || a.lng == null) return;
          const ov = new kmaps.CustomOverlay({
            position: new kmaps.LatLng(a.lat, a.lng),
            content: academyMarkerHTML(a.name, true, a.placeUrl),
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 4,
            clickable: true,
          });
          ov.setMap(map);
          overlaysRef.current.push(ov);
        });

      // 일반 학원 (숫자 많아 작게)
      academies
        .filter((a) => !a.isCompetitor)
        .forEach((a) => {
          if (a.lat == null || a.lng == null) return;
          const ov = new kmaps.CustomOverlay({
            position: new kmaps.LatLng(a.lat, a.lng),
            content: academyMarkerHTML(a.name, false, a.placeUrl),
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 3,
            clickable: true,
          });
          ov.setMap(map);
          overlaysRef.current.push(ov);
        });

      // 아파트 (가장 작은 회색 점)
      apartments.forEach((p) => {
        if (p.lat == null || p.lng == null) return;
        const ov = new kmaps.CustomOverlay({
          position: new kmaps.LatLng(p.lat, p.lng),
          content: apartmentMarkerHTML(p.name),
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 2,
        });
        ov.setMap(map);
        overlaysRef.current.push(ov);
      });
    }

    return () => {
      cancelled = true;
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.lat, input.lng, input.radiusKm]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div
        ref={containerRef}
        className="h-[460px] w-full bg-muted/20"
        style={{ touchAction: "manipulation" }}
      />

      {/* 범례 (오른쪽 상단 고급스럽게) */}
      {status === "ready" && (
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 rounded-xl border border-border/40 bg-white/95 p-3 shadow-md backdrop-blur">
          <p className="mb-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
            LEGEND
          </p>
          <LegendRow
            dotClass="bg-gradient-to-br from-purple-500 to-purple-700 shadow-[0_0_0_4px_rgba(124,58,237,0.18)]"
            label={`후보지 · 반경 ${input.radiusKm}km`}
            bold
          />
          <LegendRow
            dotClass="bg-blue-500"
            label={`학교 (${schools.length})`}
            shape="rounded"
          />
          <LegendRow
            dotClass="bg-rose-500"
            label={`경쟁 학원 (${academies.filter((a) => a.isCompetitor).length})`}
            shape="diamond"
          />
          <LegendRow
            dotClass="bg-amber-500"
            label={`일반 학원 (${academies.filter((a) => !a.isCompetitor).length})`}
            shape="diamond"
          />
          <LegendRow
            dotClass="bg-slate-400"
            label={`아파트 (${apartments.length})`}
            shape="round"
          />
        </div>
      )}

      {/* 데이터 출처 (오른쪽 하단) */}
      {status === "ready" && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[9.5px] text-muted-foreground backdrop-blur">
          지도: Kakao Maps · 장소: Kakao 로컬 API
        </div>
      )}

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-[12px] font-semibold">지도 생성 중...</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-6">
          <div className="text-center text-[12px]">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-rose-500" />
            <p className="font-bold">지도를 표시할 수 없습니다</p>
            <p className="mt-1 max-w-[320px] text-muted-foreground">
              {errorMsg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------
// 범례 로우
// ----------------------------------------------------------

function LegendRow({
  dotClass,
  label,
  shape = "round",
  bold = false,
}: {
  dotClass: string;
  label: string;
  shape?: "round" | "rounded" | "diamond";
  bold?: boolean;
}) {
  const base =
    shape === "round"
      ? "h-2.5 w-2.5 rounded-full"
      : shape === "rounded"
        ? "h-2.5 w-2.5 rounded-[3px]"
        : "h-2 w-2 rotate-45 rounded-[1.5px]";
  return (
    <div className="flex items-center gap-2 text-[10.5px]">
      <span className={`${base} ${dotClass}`} />
      <span
        className={
          bold ? "font-semibold text-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------
// HTML 마커 템플릿
// ----------------------------------------------------------

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function centerMarkerHTML(address: string): string {
  return `
    <div style="
      position:relative;
      pointer-events:none;
      display:flex;
      flex-direction:column;
      align-items:center;
    ">
      <div style="
        position:absolute;
        bottom:26px;
        white-space:nowrap;
        background:linear-gradient(135deg,#7c3aed,#5b21b6);
        color:white;
        font-size:11px;
        font-weight:700;
        padding:4px 10px;
        border-radius:9999px;
        box-shadow:0 4px 12px rgba(124,58,237,0.35);
        letter-spacing:-0.01em;
      ">★ 후보지${address ? ` · ${escape(address.split(" ").slice(-2).join(" "))}` : ""}</div>
      <div style="
        position:relative;
        width:18px;height:18px;
        border-radius:9999px;
        background:linear-gradient(135deg,#8b5cf6,#6d28d9);
        box-shadow:0 0 0 6px rgba(124,58,237,0.18),0 0 0 12px rgba(124,58,237,0.08);
      "></div>
    </div>
  `;
}

function schoolMarkerHTML(
  name: string,
  level: "초등" | "중학교" | "고등학교",
  placeUrl?: string
): string {
  const levelColor =
    level === "초등"
      ? "#0ea5e9"
      : level === "중학교"
        ? "#2563eb"
        : "#1e40af";
  const safeUrl = placeUrl ? escape(placeUrl) : "";
  const inner = `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:white;
        border:1.5px solid ${levelColor};
        color:${levelColor};
        font-size:10px;
        font-weight:700;
        padding:2px 6px;
        border-radius:6px;
        margin-bottom:3px;
        white-space:nowrap;
        box-shadow:0 2px 6px rgba(0,0,0,0.08);
        letter-spacing:-0.02em;
      ">${escape(name)}</div>
      <div style="
        width:12px;height:12px;
        border-radius:4px;
        background:${levelColor};
        box-shadow:0 0 0 2px white,0 2px 6px rgba(0,0,0,0.2);
      "></div>
    </div>
  `;
  return safeUrl
    ? `<a href="${safeUrl}" target="_blank" rel="noreferrer" style="text-decoration:none;">${inner}</a>`
    : inner;
}

function academyMarkerHTML(
  name: string,
  isCompetitor: boolean,
  placeUrl?: string
): string {
  const color = isCompetitor ? "#e11d48" : "#f59e0b";
  const ring = isCompetitor ? "rgba(225,29,72,0.25)" : "rgba(245,158,11,0.2)";
  const safeUrl = placeUrl ? escape(placeUrl) : "";
  const inner = `
    <div style="
      position:relative;
      width:12px;height:12px;
      transform:rotate(45deg);
      background:${color};
      border:1px solid white;
      box-shadow:0 0 0 2px ${ring},0 2px 4px rgba(0,0,0,0.2);
    " title="${escape(name)}"></div>
  `;
  return safeUrl
    ? `<a href="${safeUrl}" target="_blank" rel="noreferrer" style="text-decoration:none;">${inner}</a>`
    : inner;
}

function apartmentMarkerHTML(name: string): string {
  return `
    <div style="
      width:7px;height:7px;
      border-radius:9999px;
      background:#94a3b8;
      opacity:0.7;
      border:1px solid white;
      box-shadow:0 1px 2px rgba(0,0,0,0.15);
    " title="${escape(name)}"></div>
  `;
}

// ----------------------------------------------------------
// 반경에 맞는 초기 줌 레벨 산출 (Kakao: level 낮을수록 확대)
// ----------------------------------------------------------

function radiusKmToLevel(km: number): number {
  if (km <= 1) return 4;
  if (km <= 2) return 5;
  if (km <= 3) return 6;
  if (km <= 5) return 7;
  return 8;
}
