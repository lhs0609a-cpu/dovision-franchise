"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Crosshair, MapPin } from "lucide-react";

// ============================================================
// 입지 선택 지도 (Google Maps JavaScript API)
// ============================================================
// API 키: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (HTTP referer 제한 필수)
// 클릭 → 좌표 + Geocoding으로 한국어 주소 자동 반환
// 외부 검색 trigger → Geocoding으로 좌표 이동 + 반경 원 렌더
// ============================================================

const GMAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const GMAPS_SCRIPT_ID = "google-maps-js";
// 서울 시청 기본 중심
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const DEFAULT_ZOOM = 12;

// 최소 Google Maps 타입
type LatLng = { lat: number; lng: number };
type GMap = {
  setCenter: (c: LatLng) => void;
  setZoom: (z: number) => void;
  panTo: (c: LatLng) => void;
  addListener: (evt: string, fn: (e: { latLng: GLatLng }) => void) => void;
  fitBounds: (b: unknown) => void;
};
type GLatLng = {
  lat: () => number;
  lng: () => number;
  toJSON: () => LatLng;
};
type GMarker = {
  setPosition: (c: LatLng) => void;
  setMap: (m: GMap | null) => void;
};
type GCircle = {
  setCenter: (c: LatLng) => void;
  setRadius: (r: number) => void;
  setMap: (m: GMap | null) => void;
};
type GGeocoderResult = {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: { location: GLatLng };
};
type GGeocoderStatus = "OK" | "ZERO_RESULTS" | "ERROR" | string;
type GGeocoder = {
  geocode: (
    req: { location?: LatLng; address?: string; region?: string; language?: string },
    cb: (results: GGeocoderResult[] | null, status: GGeocoderStatus) => void
  ) => void;
};
type GoogleMaps = {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap;
  Marker: new (opts: Record<string, unknown>) => GMarker;
  Circle: new (opts: Record<string, unknown>) => GCircle;
  Geocoder: new () => GGeocoder;
  SymbolPath: { CIRCLE: number };
  Animation: { DROP: number };
  event: { addListenerOnce: (m: unknown, e: string, fn: () => void) => void };
};

declare global {
  interface Window {
    google?: { maps: GoogleMaps };
    __initDovisionGmap?: () => void;
  }
}

let gmapLoadPromise: Promise<GoogleMaps> | null = null;

function loadGoogleMaps(): Promise<GoogleMaps> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (gmapLoadPromise) return gmapLoadPromise;

  gmapLoadPromise = new Promise<GoogleMaps>((resolve, reject) => {
    if (!GMAPS_API_KEY) {
      reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set"));
      return;
    }
    const existing = document.getElementById(GMAPS_SCRIPT_ID);
    if (existing) {
      const check = () => {
        if (window.google?.maps) resolve(window.google.maps);
        else setTimeout(check, 80);
      };
      check();
      return;
    }
    window.__initDovisionGmap = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("Google Maps failed to initialize"));
    };
    const script = document.createElement("script");
    script.id = GMAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}&language=ko&region=KR&libraries=places&callback=__initDovisionGmap`;
    script.async = true;
    script.defer = true;
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
  return gmapLoadPromise;
}

// ----------------------------------------------------------
// 좌표 → 한국 주소 (Geocoder)
// ----------------------------------------------------------
async function reverseGeocode(
  gmaps: GoogleMaps,
  lat: number,
  lng: number
): Promise<string> {
  return new Promise((resolve) => {
    const geo = new gmaps.Geocoder();
    geo.geocode(
      { location: { lat, lng }, language: "ko", region: "KR" },
      (results, status) => {
        if (status !== "OK" || !results || !results.length) {
          resolve(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          return;
        }
        // 한국 주소 우선: 도로명 주소 포함된 결과, 없으면 formatted_address
        const best =
          results.find((r) =>
            r.address_components.some((c) => c.types.includes("premise"))
          ) || results[0];
        // "대한민국" 제거, 앞 4조각 추출
        const cleaned = best.formatted_address
          .replace(/^대한민국\s*/, "")
          .replace(/\s*,\s*/g, " ")
          .trim();
        resolve(cleaned);
      }
    );
  });
}

// ----------------------------------------------------------
// 주소 → 좌표 (Geocoder)
// ----------------------------------------------------------
async function forwardGeocode(
  gmaps: GoogleMaps,
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  return new Promise((resolve) => {
    const geo = new gmaps.Geocoder();
    geo.geocode(
      { address: query, language: "ko", region: "KR" },
      (results, status) => {
        if (status !== "OK" || !results || !results.length) {
          resolve(null);
          return;
        }
        const r = results[0];
        resolve({
          lat: r.geometry.location.lat(),
          lng: r.geometry.location.lng(),
          displayName: r.formatted_address.replace(/^대한민국\s*/, ""),
        });
      }
    );
  });
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
  const mapRef = useRef<GMap | null>(null);
  const markerRef = useRef<GMarker | null>(null);
  const circleRef = useRef<GCircle | null>(null);
  const gmapsRef = useRef<GoogleMaps | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hint, setHint] = useState<string>("지도에서 후보 지점을 클릭하세요");
  const [isResolving, setIsResolving] = useState(false);

  // 지도 초기화
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((gmaps) => {
        if (cancelled || !containerRef.current) return;
        gmapsRef.current = gmaps;

        const map = new gmaps.Map(containerRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "simplified" }],
            },
          ],
        });

        map.addListener("click", async (e: { latLng: GLatLng }) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          placeMarker(lat, lng);
          setIsResolving(true);
          setHint("주소를 가져오는 중...");
          const addr = await reverseGeocode(gmaps, lat, lng);
          setIsResolving(false);
          setHint(addr ? `선택된 위치: ${addr}` : "주소를 찾을 수 없습니다");
          onSelect({ lat, lng, address: addr });
        });

        mapRef.current = map;
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(
          err?.message?.includes("API_KEY")
            ? "Google Maps API 키가 설정되지 않았습니다."
            : "지도를 불러올 수 없습니다. API 키의 HTTP referer 제한과 결제 설정을 확인해주세요."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
      if (markerRef.current) markerRef.current.setMap(null);
      if (circleRef.current) circleRef.current.setMap(null);
      markerRef.current = null;
      circleRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부 검색 트리거
  useEffect(() => {
    if (!searchTrigger || !searchTrigger.query.trim()) return;
    const gmaps = gmapsRef.current;
    const map = mapRef.current;
    if (!gmaps || !map) return;
    let cancelled = false;
    setIsResolving(true);
    setHint(`"${searchTrigger.query}" 검색 중...`);
    forwardGeocode(gmaps, searchTrigger.query).then((res) => {
      if (cancelled) return;
      setIsResolving(false);
      if (res) {
        map.panTo({ lat: res.lat, lng: res.lng });
        map.setZoom(15);
        placeMarker(res.lat, res.lng);
        setHint(`검색 결과: ${res.displayName}`);
        onSelect({
          lat: res.lat,
          lng: res.lng,
          address: res.displayName,
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

  // 반경 변경 반영
  useEffect(() => {
    if (circleRef.current && radiusKm > 0) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  function placeMarker(lat: number, lng: number) {
    const gmaps = gmapsRef.current;
    const map = mapRef.current;
    if (!gmaps || !map) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new gmaps.Marker({
        position: { lat, lng },
        map,
        title: "후보 지점",
        animation: gmaps.Animation.DROP,
        icon: {
          path: gmaps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#7c3aed",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });
    }

    if (circleRef.current) {
      circleRef.current.setCenter({ lat, lng });
      circleRef.current.setRadius(radiusKm * 1000);
    } else {
      circleRef.current = new gmaps.Circle({
        center: { lat, lng },
        radius: radiusKm * 1000,
        map,
        strokeColor: "#7c3aed",
        strokeOpacity: 0.65,
        strokeWeight: 2,
        fillColor: "#7c3aed",
        fillOpacity: 0.08,
        clickable: false,
      });
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
          <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-[12px] font-semibold">
                Google Maps를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-6">
            <div className="text-center text-[12px]">
              <MapPin className="mx-auto mb-2 h-6 w-6 text-rose-500" />
              <p className="font-bold">지도를 불러올 수 없습니다</p>
              <p className="mt-1 max-w-[320px] text-muted-foreground">
                {errorMsg}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-[10.5px] text-muted-foreground">
        지도: Google Maps · 장소 검색: Kakao 로컬 API · 주소 검색: Google
        Geocoding
      </p>
    </div>
  );
}
