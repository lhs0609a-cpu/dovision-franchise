"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Crosshair, MapPin } from "lucide-react";

// ============================================================
// 입지 선택 지도 (Kakao Maps JavaScript SDK)
// ============================================================
// 키: NEXT_PUBLIC_KAKAO_JS_KEY (Kakao Developers > 앱 > JavaScript 키)
// Kakao Developers 콘솔에서 플랫폼 > Web 도메인 등록 필수
// ============================================================

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
const KAKAO_SCRIPT_ID = "kakao-maps-sdk";
// 서울 시청 기본 중심
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const DEFAULT_LEVEL = 5; // Kakao는 level이 낮을수록 확대 (3~6 권장)

// ----------------------------------------------------------
// Kakao Maps 최소 타입
// ----------------------------------------------------------
type KLatLng = {
  getLat: () => number;
  getLng: () => number;
};
type KMap = {
  setCenter: (latlng: KLatLng) => void;
  setLevel: (level: number) => void;
  panTo: (latlng: KLatLng) => void;
};
type KMarker = {
  setPosition: (latlng: KLatLng) => void;
  setMap: (map: KMap | null) => void;
};
type KCircle = {
  setPosition: (latlng: KLatLng) => void;
  setRadius: (radius: number) => void;
  setMap: (map: KMap | null) => void;
};
type KAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
};
type KRoadAddress = {
  address_name: string;
  building_name?: string;
} | null;
type KCoord2AddrResult = {
  address: KAddress;
  road_address: KRoadAddress;
};
type KAddrSearchResult = {
  address_name: string;
  x: string; // lng
  y: string; // lat
  road_address: KRoadAddress;
};
type KStatus = "OK" | "ZERO_RESULT" | "ERROR";
type KGeocoder = {
  coord2Address: (
    lng: number,
    lat: number,
    cb: (result: KCoord2AddrResult[], status: KStatus) => void
  ) => void;
  addressSearch: (
    query: string,
    cb: (result: KAddrSearchResult[], status: KStatus) => void
  ) => void;
};
type KPlaceSearchResult = {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string; // lng
  y: string; // lat
};
type KPlaces = {
  keywordSearch: (
    query: string,
    cb: (result: KPlaceSearchResult[], status: KStatus) => void
  ) => void;
};
type KakaoMaps = {
  LatLng: new (lat: number, lng: number) => KLatLng;
  Map: new (el: HTMLElement, opts: { center: KLatLng; level: number }) => KMap;
  Marker: new (opts: {
    position: KLatLng;
    map?: KMap;
    title?: string;
    image?: unknown;
  }) => KMarker;
  MarkerImage: new (
    src: string,
    size: unknown,
    opts?: { offset?: unknown }
  ) => unknown;
  Size: new (w: number, h: number) => unknown;
  Point: new (x: number, y: number) => unknown;
  Circle: new (opts: {
    center: KLatLng;
    radius: number;
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    fillColor?: string;
    fillOpacity?: number;
    map?: KMap;
  }) => KCircle;
  event: {
    addListener: (
      target: unknown,
      event: string,
      handler: (e: { latLng: KLatLng }) => void
    ) => void;
  };
  services: {
    Geocoder: new () => KGeocoder;
    Places: new () => KPlaces;
    Status: { OK: "OK"; ZERO_RESULT: "ZERO_RESULT"; ERROR: "ERROR" };
  };
  load: (cb: () => void) => void;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let kakaoLoadPromise: Promise<KakaoMaps> | null = null;

function loadKakaoMaps(): Promise<KakaoMaps> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.kakao?.maps?.LatLng) return Promise.resolve(window.kakao.maps);
  if (kakaoLoadPromise) return kakaoLoadPromise;

  kakaoLoadPromise = new Promise<KakaoMaps>((resolve, reject) => {
    if (!KAKAO_JS_KEY) {
      reject(new Error("NEXT_PUBLIC_KAKAO_JS_KEY not set"));
      return;
    }
    const done = () => {
      const maps = window.kakao?.maps;
      if (!maps) {
        reject(new Error("Kakao Maps failed to initialize"));
        return;
      }
      maps.load(() => resolve(maps));
    };
    const existing = document.getElementById(KAKAO_SCRIPT_ID);
    if (existing) {
      if (window.kakao?.maps) done();
      else existing.addEventListener("load", done, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = done;
    script.onerror = () =>
      reject(new Error("Failed to load Kakao Maps script"));
    document.head.appendChild(script);
  });
  return kakaoLoadPromise;
}

// ----------------------------------------------------------
// 좌표 → 한국 주소 (Kakao Geocoder)
// ----------------------------------------------------------
async function reverseGeocode(
  kmaps: KakaoMaps,
  lat: number,
  lng: number
): Promise<string> {
  return new Promise((resolve) => {
    const geo = new kmaps.services.Geocoder();
    geo.coord2Address(lng, lat, (result, status) => {
      if (status !== "OK" || !result || !result.length) {
        resolve(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        return;
      }
      const r = result[0];
      // 도로명 주소 우선, 없으면 지번 주소
      const addr =
        r.road_address?.address_name ||
        r.address?.address_name ||
        `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      resolve(addr);
    });
  });
}

// ----------------------------------------------------------
// 주소/지역명 → 좌표 (주소 검색 실패 시 키워드 검색 폴백)
// ----------------------------------------------------------
async function forwardGeocode(
  kmaps: KakaoMaps,
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  // 1차: 정식 주소 검색
  const addrResult = await new Promise<KAddrSearchResult[] | null>((resolve) => {
    const geo = new kmaps.services.Geocoder();
    geo.addressSearch(query, (result, status) => {
      resolve(status === "OK" && result?.length ? result : null);
    });
  });
  if (addrResult) {
    const r = addrResult[0];
    return {
      lat: Number(r.y),
      lng: Number(r.x),
      displayName: r.road_address?.address_name || r.address_name,
    };
  }
  // 2차 폴백: 키워드 검색 (지역명, 랜드마크 등)
  return new Promise((resolve) => {
    const places = new kmaps.services.Places();
    places.keywordSearch(query, (result, status) => {
      if (status !== "OK" || !result?.length) {
        resolve(null);
        return;
      }
      const r = result[0];
      resolve({
        lat: Number(r.y),
        lng: Number(r.x),
        displayName: r.road_address_name || r.address_name || r.place_name,
      });
    });
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
  const mapRef = useRef<KMap | null>(null);
  const markerRef = useRef<KMarker | null>(null);
  const circleRef = useRef<KCircle | null>(null);
  const kmapsRef = useRef<KakaoMaps | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hint, setHint] = useState<string>("지도에서 후보 지점을 클릭하세요");
  const [isResolving, setIsResolving] = useState(false);

  // 지도 초기화
  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kmaps) => {
        if (cancelled || !containerRef.current) return;
        kmapsRef.current = kmaps;

        const map = new kmaps.Map(containerRef.current, {
          center: new kmaps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: DEFAULT_LEVEL,
        });

        kmaps.event.addListener(map, "click", async (e: { latLng: KLatLng }) => {
          const lat = e.latLng.getLat();
          const lng = e.latLng.getLng();
          placeMarker(lat, lng);
          setIsResolving(true);
          setHint("주소를 가져오는 중...");
          const addr = await reverseGeocode(kmaps, lat, lng);
          setIsResolving(false);
          setHint(addr ? `선택된 위치: ${addr}` : "주소를 찾을 수 없습니다");
          onSelect({ lat, lng, address: addr });
        });

        mapRef.current = map;
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(
          err?.message?.includes("NEXT_PUBLIC_KAKAO_JS_KEY")
            ? "Kakao Maps JavaScript 키가 설정되지 않았습니다."
            : "지도를 불러올 수 없습니다. Kakao Developers 콘솔에서 JavaScript 키와 사이트 도메인 등록을 확인해주세요."
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
    const kmaps = kmapsRef.current;
    const map = mapRef.current;
    if (!kmaps || !map) return;
    let cancelled = false;
    setIsResolving(true);
    setHint(`"${searchTrigger.query}" 검색 중...`);
    forwardGeocode(kmaps, searchTrigger.query).then((res) => {
      if (cancelled) return;
      setIsResolving(false);
      if (res) {
        const latlng = new kmaps.LatLng(res.lat, res.lng);
        map.panTo(latlng);
        map.setLevel(4);
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
    const kmaps = kmapsRef.current;
    const map = mapRef.current;
    if (!kmaps || !map) return;
    const latlng = new kmaps.LatLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.setPosition(latlng);
    } else {
      markerRef.current = new kmaps.Marker({
        position: latlng,
        map,
        title: "후보 지점",
      });
    }

    if (circleRef.current) {
      circleRef.current.setPosition(latlng);
      circleRef.current.setRadius(radiusKm * 1000);
    } else {
      circleRef.current = new kmaps.Circle({
        center: latlng,
        radius: radiusKm * 1000,
        strokeWeight: 2,
        strokeColor: "#7c3aed",
        strokeOpacity: 0.65,
        strokeStyle: "solid",
        fillColor: "#7c3aed",
        fillOpacity: 0.08,
        map,
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
                Kakao Maps를 불러오는 중...
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
        지도 및 장소 검색: Kakao Maps · 주소 검색: Kakao Geocoding
      </p>
    </div>
  );
}
