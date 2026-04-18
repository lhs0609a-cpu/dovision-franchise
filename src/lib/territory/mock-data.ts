// ============================================================
// Mock 상권 데이터 생성기
// ============================================================
// 입력 주소를 시드로 결정론적 가짜 데이터 생성. 같은 주소는 항상
// 같은 결과를 반환합니다. 실제 API 연동 시 이 파일의 함수
// 시그니처(generateTerritoryData)는 그대로 두고 내부만 교체합니다.
//
// 향후 교체 대상:
//   - 학교: NEIS Open API (학교알리미)
//   - 학원: 카카오 로컬 API (장소 검색)
//   - 아파트: 국토교통부 실거래가 API
//   - 인구: 통계청 SGIS API
// ============================================================

import type {
  Academy,
  ApartmentCluster,
  Demographics,
  School,
} from "./types";

// ----------------------------------------------------------
// 시드 기반 의사 난수 (mulberry32)
// ----------------------------------------------------------

function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function range(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng();
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ----------------------------------------------------------
// 지역 프로파일 (주소 키워드 → 가중치)
// ----------------------------------------------------------
// 주소에 강남/송파/분당/판교/평촌/목동/잠실 등 학원가 키워드가 포함되면
// 학생수/소득/경쟁 강도가 높게 시뮬레이션됨.
// ----------------------------------------------------------

type Profile = {
  studentMultiplier: number;
  incomeMultiplier: number;
  competitionMultiplier: number;
  apartmentPriceMultiplier: number;
};

const HOTSPOT_KEYWORDS: Array<[string, Profile]> = [
  [
    "강남",
    { studentMultiplier: 1.4, incomeMultiplier: 1.6, competitionMultiplier: 1.5, apartmentPriceMultiplier: 2.2 },
  ],
  [
    "서초",
    { studentMultiplier: 1.35, incomeMultiplier: 1.55, competitionMultiplier: 1.4, apartmentPriceMultiplier: 2.1 },
  ],
  [
    "송파",
    { studentMultiplier: 1.3, incomeMultiplier: 1.4, competitionMultiplier: 1.3, apartmentPriceMultiplier: 1.8 },
  ],
  [
    "잠실",
    { studentMultiplier: 1.3, incomeMultiplier: 1.45, competitionMultiplier: 1.35, apartmentPriceMultiplier: 1.9 },
  ],
  [
    "목동",
    { studentMultiplier: 1.4, incomeMultiplier: 1.4, competitionMultiplier: 1.55, apartmentPriceMultiplier: 1.7 },
  ],
  [
    "분당",
    { studentMultiplier: 1.35, incomeMultiplier: 1.45, competitionMultiplier: 1.35, apartmentPriceMultiplier: 1.7 },
  ],
  [
    "판교",
    { studentMultiplier: 1.3, incomeMultiplier: 1.6, competitionMultiplier: 1.25, apartmentPriceMultiplier: 1.95 },
  ],
  [
    "평촌",
    { studentMultiplier: 1.3, incomeMultiplier: 1.3, competitionMultiplier: 1.4, apartmentPriceMultiplier: 1.4 },
  ],
  [
    "일산",
    { studentMultiplier: 1.2, incomeMultiplier: 1.2, competitionMultiplier: 1.2, apartmentPriceMultiplier: 1.3 },
  ],
  [
    "동탄",
    { studentMultiplier: 1.3, incomeMultiplier: 1.3, competitionMultiplier: 1.15, apartmentPriceMultiplier: 1.4 },
  ],
  [
    "광교",
    { studentMultiplier: 1.25, incomeMultiplier: 1.4, competitionMultiplier: 1.1, apartmentPriceMultiplier: 1.5 },
  ],
  [
    "수원",
    { studentMultiplier: 1.1, incomeMultiplier: 1.1, competitionMultiplier: 1.1, apartmentPriceMultiplier: 1.2 },
  ],
  [
    "부산",
    { studentMultiplier: 1.0, incomeMultiplier: 1.0, competitionMultiplier: 1.0, apartmentPriceMultiplier: 0.9 },
  ],
  [
    "해운대",
    { studentMultiplier: 1.15, incomeMultiplier: 1.3, competitionMultiplier: 1.2, apartmentPriceMultiplier: 1.4 },
  ],
];

const DEFAULT_PROFILE: Profile = {
  studentMultiplier: 1.0,
  incomeMultiplier: 1.0,
  competitionMultiplier: 1.0,
  apartmentPriceMultiplier: 1.0,
};

function profileForAddress(address: string): Profile {
  for (const [kw, p] of HOTSPOT_KEYWORDS) {
    if (address.includes(kw)) return p;
  }
  return DEFAULT_PROFILE;
}

// ----------------------------------------------------------
// 자료 풀
// ----------------------------------------------------------

const ELEMENTARY_SUFFIX = ["초등", "초등", "초등", "초등"];
const MIDDLE_SUFFIX = ["중학교", "중", "중학교"];
const HIGH_SUFFIX = ["고등학교", "고", "고등학교"];

const SCHOOL_NAME_STEMS = [
  "한솔",
  "푸른",
  "샘말",
  "서원",
  "동산",
  "햇살",
  "예일",
  "신영",
  "백송",
  "다정",
  "은빛",
  "별빛",
  "참사랑",
  "서화",
  "명진",
  "송림",
  "남산",
  "양지",
  "일신",
  "한양",
  "신성",
];

const ACADEMY_BRANDS = [
  { name: "OO 영어학원", category: "외국어" as const, isCompetitor: false },
  { name: "OO 수학학원", category: "교과" as const, isCompetitor: false },
  { name: "에듀-OO 종합학원", category: "교과" as const, isCompetitor: false },
  { name: "OO 사고력 수학", category: "사고력·뇌교육" as const, isCompetitor: true },
  { name: "OO 두뇌개발센터", category: "사고력·뇌교육" as const, isCompetitor: true },
  { name: "OO 뉴로피드백 센터", category: "사고력·뇌교육" as const, isCompetitor: true },
  { name: "OO 기억력 트레이닝", category: "사고력·뇌교육" as const, isCompetitor: true },
  { name: "OO 미술학원", category: "예체능" as const, isCompetitor: false },
  { name: "OO 피아노학원", category: "예체능" as const, isCompetitor: false },
  { name: "OO 태권도", category: "예체능" as const, isCompetitor: false },
  { name: "OO 국어논술", category: "교과" as const, isCompetitor: false },
  { name: "OO 영어회화", category: "외국어" as const, isCompetitor: false },
];

const APT_NAME_STEMS = [
  "푸르지오",
  "래미안",
  "자이",
  "롯데캐슬",
  "더샵",
  "센트럴파크",
  "힐스테이트",
  "위브",
  "e편한세상",
  "아이파크",
  "메트로폴리스",
  "리버뷰",
];

// ----------------------------------------------------------
// 메인 생성 함수
// ----------------------------------------------------------

export type GeneratedTerritory = {
  schools: School[];
  academies: Academy[];
  apartments: ApartmentCluster[];
  demographics: Demographics;
};

export function generateTerritoryData(
  address: string,
  radiusKm: number
): GeneratedTerritory {
  const seed = hashString(address + "|" + radiusKm);
  const rng = makeRng(seed);
  const profile = profileForAddress(address);

  // ---- 학교 ----
  const numElem = Math.floor(range(rng, 2, 5) * profile.studentMultiplier);
  const numMid = Math.floor(range(rng, 1, 3) * profile.studentMultiplier);
  const numHigh = Math.floor(range(rng, 0, 2));

  const usedNames = new Set<string>();
  const makeSchool = (level: School["level"]): School => {
    let stem: string;
    do {
      stem = pick(rng, SCHOOL_NAME_STEMS);
    } while (usedNames.has(stem + level));
    usedNames.add(stem + level);
    const suffix =
      level === "초등"
        ? pick(rng, ELEMENTARY_SUFFIX)
        : level === "중학교"
          ? pick(rng, MIDDLE_SUFFIX)
          : pick(rng, HIGH_SUFFIX);
    const name =
      level === "초등" ? `${stem}초등학교` : `${stem}${suffix}`;
    const baseStudents =
      level === "초등"
        ? range(rng, 380, 950)
        : level === "중학교"
          ? range(rng, 320, 780)
          : range(rng, 280, 720);
    return {
      name,
      level,
      studentCount: Math.round(baseStudents * profile.studentMultiplier),
      distanceM: Math.round(range(rng, 200, radiusKm * 1000)),
    };
  };

  const schools: School[] = [
    ...Array.from({ length: numElem }, () => makeSchool("초등")),
    ...Array.from({ length: numMid }, () => makeSchool("중학교")),
    ...Array.from({ length: numHigh }, () => makeSchool("고등학교")),
  ].sort((a, b) => a.distanceM - b.distanceM);

  // ---- 학원 ----
  const numAcademies = Math.floor(
    range(rng, 8, 18) * profile.competitionMultiplier
  );
  const academies: Academy[] = Array.from({ length: numAcademies }, () => {
    const brand = pick(rng, ACADEMY_BRANDS);
    return {
      name: brand.name.replace("OO", pick(rng, SCHOOL_NAME_STEMS)),
      category: brand.category,
      isCompetitor: brand.isCompetitor,
      distanceM: Math.round(range(rng, 100, radiusKm * 1000)),
    };
  }).sort((a, b) => a.distanceM - b.distanceM);

  // ---- 아파트 ----
  const numApts = Math.floor(range(rng, 4, 9));
  const apartments: ApartmentCluster[] = Array.from({ length: numApts }, () => {
    const stem = pick(rng, APT_NAME_STEMS);
    const blockNo = Math.floor(range(rng, 1, 8));
    const basePrice = range(rng, 60000, 130000);
    return {
      name: `${pick(rng, SCHOOL_NAME_STEMS)} ${stem} ${blockNo}단지`,
      households: Math.round(range(rng, 280, 1500)),
      avgPriceMillion: Math.round(
        (basePrice * profile.apartmentPriceMultiplier) / 100
      ) * 100,
      avgPyeong: Math.round(range(rng, 24, 42)),
      distanceM: Math.round(range(rng, 100, radiusKm * 1000)),
    };
  }).sort((a, b) => a.distanceM - b.distanceM);

  // ---- 인구통계 ----
  const totalPopulation = Math.round(
    range(rng, 35000, 95000) * profile.studentMultiplier
  );
  const demographics: Demographics = {
    totalPopulation,
    schoolAgePopulation: Math.round(
      totalPopulation * range(rng, 0.08, 0.14)
    ),
    avgHouseholdIncome: Math.round(
      range(rng, 5500, 7500) * profile.incomeMultiplier
    ),
    privateEduRatio: Math.min(
      72,
      Math.round(range(rng, 28, 45) * profile.incomeMultiplier)
    ),
  };

  return { schools, academies, apartments, demographics };
}
