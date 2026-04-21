// ============================================================
// Kakao Maps SDK 공용 로더
// ============================================================
// LocationPickerMap (입지 선택)과 ResultMap (결과 시각화)가
// 동일한 SDK 인스턴스를 공유하도록 단일 모듈로 관리.
// ============================================================

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
const KAKAO_SCRIPT_ID = "kakao-maps-sdk";

export type KLatLng = {
  getLat: () => number;
  getLng: () => number;
};
export type KMap = {
  setCenter: (latlng: KLatLng) => void;
  setLevel: (level: number) => void;
  panTo: (latlng: KLatLng) => void;
  getBounds?: () => unknown;
  setBounds?: (b: unknown) => void;
};
export type KMarker = {
  setPosition: (latlng: KLatLng) => void;
  setMap: (map: KMap | null) => void;
};
export type KCircle = {
  setPosition: (latlng: KLatLng) => void;
  setRadius: (radius: number) => void;
  setMap: (map: KMap | null) => void;
};
export type KCustomOverlay = {
  setPosition: (latlng: KLatLng) => void;
  setMap: (map: KMap | null) => void;
};
export type KInfoWindow = {
  open: (map: KMap, marker: KMarker) => void;
  close: () => void;
  setContent: (html: string) => void;
};
export type KBounds = {
  extend: (latlng: KLatLng) => void;
  isEmpty: () => boolean;
};
export type KakaoMaps = {
  LatLng: new (lat: number, lng: number) => KLatLng;
  LatLngBounds: new () => KBounds;
  Map: new (
    el: HTMLElement,
    opts: { center: KLatLng; level: number; draggable?: boolean }
  ) => KMap;
  Marker: new (opts: {
    position: KLatLng;
    map?: KMap;
    title?: string;
    image?: unknown;
    clickable?: boolean;
    zIndex?: number;
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
  CustomOverlay: new (opts: {
    position: KLatLng;
    content: string | HTMLElement;
    map?: KMap;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }) => KCustomOverlay;
  InfoWindow: new (opts: {
    content: string;
    removable?: boolean;
    zIndex?: number;
  }) => KInfoWindow;
  event: {
    addListener: (
      target: unknown,
      event: string,
      handler: (e: { latLng: KLatLng }) => void
    ) => void;
  };
  services: {
    Geocoder: new () => {
      coord2Address: (
        lng: number,
        lat: number,
        cb: (
          result: Array<{
            address: { address_name: string };
            road_address: { address_name: string } | null;
          }>,
          status: "OK" | "ZERO_RESULT" | "ERROR"
        ) => void
      ) => void;
      addressSearch: (
        query: string,
        cb: (
          result: Array<{
            address_name: string;
            x: string;
            y: string;
            road_address: { address_name: string } | null;
          }>,
          status: "OK" | "ZERO_RESULT" | "ERROR"
        ) => void
      ) => void;
    };
    Places: new () => {
      keywordSearch: (
        query: string,
        cb: (
          result: Array<{
            place_name: string;
            address_name: string;
            road_address_name: string;
            x: string;
            y: string;
          }>,
          status: "OK" | "ZERO_RESULT" | "ERROR"
        ) => void
      ) => void;
    };
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

export function loadKakaoMaps(): Promise<KakaoMaps> {
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
