"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Crosshair, MapPin } from "lucide-react";

// ============================================================
// 입지 선택 지도
// ============================================================
// Leaflet을 CDN에서 동적 로드 → npm 의존성 0
// 클릭 → 좌표 → Nominatim 역지오코딩으로 한국어 주소 자동 반환
// 향후 카카오맵 SDK 어댑터로 교체 가능 (props 인터페이스 유지)
// ============================================================

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

// 서울 시청 (기본 중심점)
const DEFAULT_CENTER: [number, number] = [37.5665, 126.978];
const DEFAULT_ZOOM = 12;

// minimal Leaflet types (CDN 로드라 @types/leaflet 의존 없이 정의)
type LMap = {
  setView: (latlng: [number, number], zoom?: number) => LMap;
  on: (evt: string, fn: (e: { latlng: { lat: number; lng: number } }) => void) => void;
  removeLayer: (layer: unknown) => void;
  invalidateSize: () => void;
  remove: () => void;
};
type LMarker = { addTo: (m: LMap) => LMarker; setLatLng: (latlng: [number, number]) => LMarker };
type LCircle = { addTo: (m: LMap) => LCircle; setLatLng: (latlng: [number, number]) => LCircle; setRadius: (r: number) => LCircle };
type LeafletGlobal = {
  map: (el: HTMLElement) => LMap;
  tileLayer: (url: string, opts?: Record<string, unknown>) => { addTo: (m: LMap) => unknown };
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => LMarker;
  circle: (latlng: [number, number], opts?: Record<string, unknown>) => LCircle;
  divIcon: (opts: Record<string, unknown>) => unknown;
};

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

let leafletLoadPromise: Promise<LeafletGlobal> | null = null;

function loadLeaflet(): Promise<LeafletGlobal> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise<LeafletGlobal>((resolve, reject) => {
    // CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS_URL;
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
    // JS
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () =>
        window.L ? resolve(window.L) : reject(new Error("Leaflet not loaded"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS_URL;
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = true;
    script.onload = () =>
      window.L ? resolve(window.L) : reject(new Error("Leaflet not loaded"));
    script.onerror = () => reject(new Error("Failed to load Leaflet from CDN"));
    document.head.appendChild(script);
  });
  return leafletLoadPromise;
}

// ----------------------------------------------------------
// 역지오코딩 (Nominatim)
// ----------------------------------------------------------
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ko`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "ko" },
    });
    if (!res.ok) throw new Error("nominatim error");
    const data: {
      display_name?: string;
      address?: Record<string, string>;
    } = await res.json();
    // 한국어 주소 조립 (도/시 + 시/군/구 + 동/읍/면 + 도로명)
    if (data.address) {
      const a = data.address;
      const parts = [
        a.state || a.province,
        a.city || a.town || a.county,
        a.borough || a.city_district || a.suburb,
        a.neighbourhood || a.quarter,
        a.road,
      ].filter(Boolean);
      if (parts.length >= 2) return parts.join(" ");
    }
    return data.display_name?.split(",").slice(0, 4).reverse().join(" ") || "";
  } catch {
    return `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}

// ----------------------------------------------------------
// 정지오코딩 (Nominatim) - 주소 → 좌표
// ----------------------------------------------------------
async function forwardGeocode(
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=kr&limit=1&accept-language=ko`;
    const res = await fetch(url, { headers: { "Accept-Language": "ko" } });
    if (!res.ok) return null;
    const arr: Array<{ lat: string; lon: string; display_name: string }> =
      await res.json();
    if (!arr.length) return null;
    return {
      lat: parseFloat(arr[0].lat),
      lng: parseFloat(arr[0].lon),
      displayName: arr[0].display_name,
    };
  } catch {
    return null;
  }
}

// ============================================================
// Component
// ============================================================

export type LocationPickerProps = {
  onSelect: (info: { lat: number; lng: number; address: string }) => void;
  /** 분석 반경 (km) - 지도에 원으로 표시 */
  radiusKm?: number;
  /** 외부에서 주소 입력 시 지도 이동 트리거용 */
  searchTrigger?: { query: string; nonce: number } | null;
};

export default function LocationPickerMap({
  onSelect,
  radiusKm = 2,
  searchTrigger,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const markerRef = useRef<LMarker | null>(null);
  const circleRef = useRef<LCircle | null>(null);
  const leafletRef = useRef<LeafletGlobal | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [hint, setHint] = useState<string>("지도에서 후보 지점을 클릭하세요");
  const [isResolving, setIsResolving] = useState(false);

  // 지도 초기화
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        leafletRef.current = L;
        const map = L.map(containerRef.current).setView(
          DEFAULT_CENTER,
          DEFAULT_ZOOM
        );
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        map.on("click", async (e) => {
          const { lat, lng } = e.latlng;
          placeMarker(lat, lng);
          setIsResolving(true);
          setHint("주소를 가져오는 중...");
          const addr = await reverseGeocode(lat, lng);
          setIsResolving(false);
          setHint(addr ? `선택된 위치: ${addr}` : "주소를 찾을 수 없습니다");
          onSelect({ lat, lng, address: addr });
        });

        mapRef.current = map;
        setStatus("ready");
        // 컨테이너 크기 보정
        setTimeout(() => map.invalidateSize(), 100);
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부 검색 트리거 → 정지오코딩 → 지도 이동
  useEffect(() => {
    if (!searchTrigger || !searchTrigger.query.trim()) return;
    if (!mapRef.current || !leafletRef.current) return;
    let cancelled = false;
    setIsResolving(true);
    setHint(`"${searchTrigger.query}" 검색 중...`);
    forwardGeocode(searchTrigger.query).then((res) => {
      if (cancelled) return;
      setIsResolving(false);
      if (res) {
        mapRef.current?.setView([res.lat, res.lng], 14);
        placeMarker(res.lat, res.lng);
        setHint(
          `검색 결과: ${res.displayName.split(",").slice(0, 4).reverse().join(" ")}`
        );
        onSelect({
          lat: res.lat,
          lng: res.lng,
          address: searchTrigger.query,
        });
      } else {
        setHint(
          `"${searchTrigger.query}" 검색 결과가 없습니다. 지도에서 직접 클릭해주세요.`
        );
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger?.nonce]);

  // 반경 변경 시 원 갱신
  useEffect(() => {
    if (circleRef.current && radiusKm > 0) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  function placeMarker(lat: number, lng: number) {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const icon = L.divIcon({
        className: "dovision-pin",
        html: `<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:oklch(0.45 0.18 290);color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,0.35);border:2px solid white;"><span style="transform:rotate(45deg);font-weight:900;font-size:14px;">★</span></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 32],
      });
      markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
    }

    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(radiusKm * 1000);
    } else {
      circleRef.current = L.circle([lat, lng], {
        radius: radiusKm * 1000,
        color: "oklch(0.45 0.18 290)",
        weight: 2,
        opacity: 0.6,
        fillColor: "oklch(0.45 0.18 290)",
        fillOpacity: 0.08,
      }).addTo(map);
    }
  }

  return (
    <div className="relative">
      {/* 안내 바 */}
      <div className="mb-2 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[12px]">
        {isResolving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        ) : (
          <Crosshair className="h-3.5 w-3.5 text-primary" />
        )}
        <span className="font-medium text-foreground/80">{hint}</span>
      </div>

      {/* 지도 컨테이너 */}
      <div className="relative overflow-hidden rounded-xl border border-border/60">
        <div
          ref={containerRef}
          className="h-[420px] w-full bg-muted/20"
          style={{ touchAction: "manipulation" }}
        />

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-[12px] font-semibold">
                지도를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95">
            <div className="text-center text-[12px]">
              <MapPin className="mx-auto mb-2 h-6 w-6 text-rose-500" />
              <p className="font-bold">지도를 불러올 수 없습니다</p>
              <p className="mt-1 text-muted-foreground">
                네트워크 상태를 확인하거나 주소를 직접 입력해주세요.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-[10.5px] text-muted-foreground">
        지도 데이터: © OpenStreetMap · 주소 검색: Nominatim · 향후 카카오맵 SDK
        교체 예정
      </p>
    </div>
  );
}
