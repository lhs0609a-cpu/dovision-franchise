// ============================================================
// 카카오 로컬 API 호출 (서버 /api/territory/places 프록시)
// ============================================================

import type {
  Academy,
  ApartmentCluster,
  Demographics,
  School,
} from "./types";

export type RealPlacesResponse = {
  source: "kakao-local-api";
  counts: { schools: number; academies: number; apartments: number };
  schools: School[];
  academies: Academy[];
  apartments: ApartmentCluster[];
};

export async function fetchRealPlaces(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<RealPlacesResponse> {
  const res = await fetch(
    `/api/territory/places?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err.error || "Places API 호출 실패");
  }
  return res.json();
}

// ----------------------------------------------------------
// 지역 기반 인구 추정 (카카오 장소 밀도로 근사)
// ----------------------------------------------------------
// 반경 내 학교·아파트 수 기준으로 인구/소득을 추정.
// 정확한 값은 통계청 SGIS API 연동 후 교체.
// ----------------------------------------------------------

export function estimateDemographicsFromPlaces(
  schools: School[],
  apartments: ApartmentCluster[],
  radiusKm: number
): Demographics {
  const totalStudents = schools.reduce((sum, s) => sum + s.studentCount, 0);
  const schoolPopulationEstimate = totalStudents;
  // 학령인구 ≈ 전체 학생수 (초·중·고 합), 일반적으로 전체의 10~12%
  const schoolAgeRatio = 0.11;
  const totalPopulation = Math.round(schoolPopulationEstimate / schoolAgeRatio);

  // 아파트 밀도로 소득 근사 (아파트 많을수록 중산층 높음)
  const aptDensity = apartments.length / Math.max(radiusKm, 1);
  const avgHouseholdIncome = Math.round(
    5500 + Math.min(aptDensity, 10) * 250
  );
  const privateEduRatio = Math.min(
    65,
    Math.round(30 + Math.min(aptDensity, 10) * 3)
  );

  return {
    totalPopulation,
    schoolAgePopulation: totalStudents,
    avgHouseholdIncome,
    privateEduRatio,
  };
}
