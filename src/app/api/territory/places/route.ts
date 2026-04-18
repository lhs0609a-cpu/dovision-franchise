import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Kakao 로컬 API 프록시 — 학교/학원/아파트 검색
// ============================================================
// REST 키는 서버 환경변수(KAKAO_REST_API_KEY)에 보관.
// 클라이언트는 이 endpoint만 호출 → 키 노출 없음.
//
// 카카오 카테고리 그룹 코드:
//   SC4  학교
//   AC5  학원
//   AP5  (없음 — 아파트는 키워드 검색 사용)
// ============================================================

const KAKAO_BASE = "https://dapi.kakao.com/v2/local/search";

type KakaoPlace = {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // lng
  y: string; // lat
  place_url: string;
  distance: string; // meters (x,y 좌표 기준 호출 시)
};

type KakaoResponse = {
  documents: KakaoPlace[];
  meta: { total_count: number; pageable_count: number; is_end: boolean };
};

async function kakaoCategory(
  code: string,
  lat: number,
  lng: number,
  radiusM: number,
  key: string
): Promise<KakaoPlace[]> {
  const all: KakaoPlace[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= 3; page++) {
    const url = `${KAKAO_BASE}/category.json?category_group_code=${code}&x=${lng}&y=${lat}&radius=${Math.min(radiusM, 20000)}&page=${page}&size=15&sort=distance`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const data: KakaoResponse = await res.json();
    for (const p of data.documents) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        all.push(p);
      }
    }
    if (data.meta.is_end) break;
  }
  return all;
}

async function kakaoKeyword(
  query: string,
  lat: number,
  lng: number,
  radiusM: number,
  key: string
): Promise<KakaoPlace[]> {
  const all: KakaoPlace[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= 3; page++) {
    const url = `${KAKAO_BASE}/keyword.json?query=${encodeURIComponent(query)}&x=${lng}&y=${lat}&radius=${Math.min(radiusM, 20000)}&page=${page}&size=15&sort=distance`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const data: KakaoResponse = await res.json();
    for (const p of data.documents) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        all.push(p);
      }
    }
    if (data.meta.is_end) break;
  }
  return all;
}

// ----------------------------------------------------------
// 학교 이름 → level 추정
// ----------------------------------------------------------
function classifySchool(
  name: string,
  category: string
): "초등" | "중학교" | "고등학교" | null {
  const fulltext = `${name} ${category}`;
  if (/초등|초교|\bELEMENTARY\b/i.test(fulltext)) return "초등";
  if (/고등|고교|\bHIGH SCHOOL\b/i.test(fulltext)) return "고등학교";
  if (/중학|중교|\bMIDDLE\b/i.test(fulltext)) return "중학교";
  // 유치원, 특수, 기타 학교 제외
  return null;
}

// ----------------------------------------------------------
// 학원 분류 (경쟁/일반)
// ----------------------------------------------------------
function classifyAcademy(
  name: string,
  category: string
): {
  category: "교과" | "외국어" | "예체능" | "사고력·뇌교육";
  isCompetitor: boolean;
} {
  const fulltext = `${name} ${category}`;
  // 두비전 직접 경쟁: 사고력/뇌교육/기억력/뉴로피드백 관련
  if (
    /뇌|사고력|기억력|뉴로|집중력|영재|창의|두뇌|영어두뇌|인지/.test(
      fulltext
    )
  ) {
    return { category: "사고력·뇌교육", isCompetitor: true };
  }
  if (/영어|ENGLISH|회화|토익|TOEFL/i.test(fulltext)) {
    return { category: "외국어", isCompetitor: false };
  }
  if (/미술|피아노|음악|태권도|합기도|체육|축구|수영|무용/.test(fulltext)) {
    return { category: "예체능", isCompetitor: false };
  }
  return { category: "교과", isCompetitor: false };
}

// ============================================================
// Handler
// ============================================================

export async function GET(req: NextRequest) {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "KAKAO_REST_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radiusKm = Number(searchParams.get("radiusKm") || "2");
  if (!lat || !lng || Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "lat, lng required" },
      { status: 400 }
    );
  }
  const radiusM = Math.min(Math.max(radiusKm * 1000, 500), 20000);

  try {
    const [schoolsRaw, academiesRaw, apartmentsRaw] = await Promise.all([
      kakaoCategory("SC4", lat, lng, radiusM, key), // 학교
      kakaoCategory("AC5", lat, lng, radiusM, key), // 학원
      kakaoKeyword("아파트", lat, lng, radiusM, key), // 아파트 (카테고리 없음)
    ]);

    const schools = schoolsRaw
      .map((p) => {
        const level = classifySchool(p.place_name, p.category_name);
        if (!level) return null;
        return {
          name: p.place_name,
          level,
          // Kakao는 학생수를 제공 안 함 — 추정치 (NEIS 연동 전까지)
          studentCount:
            level === "초등" ? 650 : level === "중학교" ? 550 : 500,
          distanceM: Number(p.distance) || 0,
          address: p.road_address_name || p.address_name,
          placeUrl: p.place_url,
          estimated: true, // 학생수는 추정값임을 표시
        };
      })
      .filter(Boolean) as Array<{
      name: string;
      level: "초등" | "중학교" | "고등학교";
      studentCount: number;
      distanceM: number;
      address: string;
      placeUrl: string;
      estimated: boolean;
    }>;

    const academies = academiesRaw
      .slice(0, 30) // 너무 많으면 cap
      .map((p) => {
        const cls = classifyAcademy(p.place_name, p.category_name);
        return {
          name: p.place_name,
          category: cls.category,
          isCompetitor: cls.isCompetitor,
          distanceM: Number(p.distance) || 0,
          address: p.road_address_name || p.address_name,
          placeUrl: p.place_url,
        };
      });

    const apartments = apartmentsRaw
      .slice(0, 20)
      .filter((p) => /아파트|단지|APT/.test(p.place_name))
      .map((p) => ({
        name: p.place_name,
        // Kakao는 가구수/시세 제공 안 함 → 시세는 별도 국토부 API 필요 (추후)
        households: 0,
        avgPriceMillion: 0,
        avgPyeong: 0,
        distanceM: Number(p.distance) || 0,
        address: p.road_address_name || p.address_name,
        placeUrl: p.place_url,
        estimated: true,
      }));

    return NextResponse.json({
      source: "kakao-local-api",
      counts: {
        schools: schools.length,
        academies: academies.length,
        apartments: apartments.length,
      },
      schools: schools.sort((a, b) => a.distanceM - b.distanceM),
      academies: academies.sort((a, b) => a.distanceM - b.distanceM),
      apartments: apartments.sort((a, b) => a.distanceM - b.distanceM),
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Kakao API request failed",
        detail: e instanceof Error ? e.message : "unknown",
      },
      { status: 502 }
    );
  }
}
