import { prisma } from "@/lib/prisma";
import NationalMap from "./NationalMap";

export const dynamic = "force-dynamic";

type Pin = {
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

const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  // 서울
  서울: { lat: 37.5665, lng: 126.978 },
  강남: { lat: 37.5172, lng: 127.0473 },
  강북: { lat: 37.6396, lng: 127.0257 },
  강서: { lat: 37.5509, lng: 126.8497 },
  강동: { lat: 37.5301, lng: 127.1238 },
  서초: { lat: 37.4837, lng: 127.0324 },
  송파: { lat: 37.5145, lng: 127.1059 },
  마포: { lat: 37.5663, lng: 126.9012 },
  용산: { lat: 37.5326, lng: 126.9905 },
  중구: { lat: 37.5636, lng: 126.9975 },
  영등포: { lat: 37.5264, lng: 126.8962 },
  광진: { lat: 37.5384, lng: 127.0827 },
  성동: { lat: 37.5633, lng: 127.0369 },
  노원: { lat: 37.6542, lng: 127.0568 },
  양천: { lat: 37.5169, lng: 126.8665 },
  구로: { lat: 37.4954, lng: 126.8875 },
  금천: { lat: 37.4567, lng: 126.8955 },
  관악: { lat: 37.4784, lng: 126.9516 },
  동작: { lat: 37.5124, lng: 126.9393 },
  성북: { lat: 37.5894, lng: 127.0167 },
  도봉: { lat: 37.6687, lng: 127.0472 },
  중랑: { lat: 37.6066, lng: 127.0927 },
  동대문: { lat: 37.5744, lng: 127.0398 },
  서대문: { lat: 37.5791, lng: 126.9368 },
  은평: { lat: 37.6027, lng: 126.9291 },
  종로: { lat: 37.5735, lng: 126.9789 },

  // 경기
  경기: { lat: 37.4138, lng: 127.5183 },
  성남: { lat: 37.4449, lng: 127.1388 },
  분당: { lat: 37.3517, lng: 127.108 },
  수원: { lat: 37.2636, lng: 127.0286 },
  안양: { lat: 37.3943, lng: 126.957 },
  평촌: { lat: 37.3887, lng: 126.9519 },
  의정부: { lat: 37.738, lng: 127.0337 },
  부천: { lat: 37.5035, lng: 126.766 },
  광명: { lat: 37.4784, lng: 126.8644 },
  안산: { lat: 37.3219, lng: 126.8309 },
  용인: { lat: 37.241, lng: 127.1776 },
  화성: { lat: 37.1998, lng: 126.8311 },
  동탄: { lat: 37.1969, lng: 127.0774 },
  김포: { lat: 37.6152, lng: 126.7159 },
  하남: { lat: 37.5392, lng: 127.2148 },
  위례: { lat: 37.4683, lng: 127.14 },
  반포: { lat: 37.505, lng: 127.006 },

  // 인천
  인천: { lat: 37.4563, lng: 126.7052 },
  송도: { lat: 37.3824, lng: 126.6559 },

  // 광역시
  부산: { lat: 35.1796, lng: 129.0756 },
  대구: { lat: 35.8714, lng: 128.6014 },
  대전: { lat: 36.3504, lng: 127.3845 },
  광주: { lat: 35.1595, lng: 126.8526 },
  울산: { lat: 35.5384, lng: 129.3114 },
  세종: { lat: 36.48, lng: 127.289 },

  // 기타 도
  강원: { lat: 37.8228, lng: 128.1555 },
  춘천: { lat: 37.8813, lng: 127.73 },
  원주: { lat: 37.3422, lng: 127.9201 },
  충북: { lat: 36.8, lng: 127.7 },
  청주: { lat: 36.6424, lng: 127.489 },
  충남: { lat: 36.6588, lng: 126.6728 },
  천안: { lat: 36.8151, lng: 127.1139 },
  경북: { lat: 36.3, lng: 128.8 },
  경주: { lat: 35.8562, lng: 129.2247 },
  포항: { lat: 36.019, lng: 129.3435 },
  전북: { lat: 35.7175, lng: 127.153 },
  전주: { lat: 35.8242, lng: 127.148 },
  전남: { lat: 34.8679, lng: 126.991 },
  여수: { lat: 34.7604, lng: 127.6622 },
  경남: { lat: 35.2383, lng: 128.6923 },
  창원: { lat: 35.2275, lng: 128.6819 },
  제주: { lat: 33.489, lng: 126.4983 },
};

function resolveRegion(region: string): { lat: number; lng: number } | null {
  // 가장 긴 매칭부터 시도
  const keys = Object.keys(REGION_COORDS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (region.includes(key)) return REGION_COORDS[key];
  }
  return null;
}

export default async function NationalMapPage() {
  const pins: Pin[] = [];

  try {
    const [franchisees, inquiries] = await Promise.all([
      prisma.franchisee.findMany({
        select: {
          id: true,
          name: true,
          region: true,
          status: true,
          centerName: true,
          phone: true,
        },
      }),
      prisma.inquiry.findMany({
        where: {
          status: { in: ["NEW", "CONTACTED", "CONSULTING", "VISITED"] },
        },
        select: { id: true, name: true, region: true, status: true, phone: true },
        take: 200,
      }),
    ]);

    for (const f of franchisees) {
      const coord = resolveRegion(f.region);
      if (!coord) continue;
      pins.push({
        id: f.id,
        kind: "franchisee",
        name: f.name,
        region: f.region,
        status: f.status,
        lat: coord.lat + (Math.random() - 0.5) * 0.01,
        lng: coord.lng + (Math.random() - 0.5) * 0.01,
        centerName: f.centerName,
        phone: f.phone,
      });
    }
    for (const i of inquiries) {
      const coord = resolveRegion(i.region);
      if (!coord) continue;
      pins.push({
        id: i.id,
        kind: "inquiry",
        name: i.name,
        region: i.region,
        status: i.status,
        lat: coord.lat + (Math.random() - 0.5) * 0.015,
        lng: coord.lng + (Math.random() - 0.5) * 0.015,
        phone: i.phone,
      });
    }
  } catch {
    // DB 미연결
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-primary">
          NATIONAL NETWORK
        </p>
        <h1 className="mt-0.5 text-[22px] font-bold">전국 가맹점 지도</h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          가맹점(운영 중·준비 중·해지) + 상담 진행 중 문의 일괄 표시
        </p>
      </div>
      <NationalMap pins={pins} />
    </div>
  );
}
