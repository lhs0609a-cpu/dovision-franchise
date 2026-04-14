export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "CONSULTING"
  | "VISITED"
  | "CONTRACTED"
  | "REJECTED";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "신규",
  CONTACTED: "연락 완료",
  CONSULTING: "상담 중",
  VISITED: "센터 방문",
  CONTRACTED: "계약 완료",
  REJECTED: "보류/거절",
};

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  CONSULTING: "bg-purple-100 text-purple-800",
  VISITED: "bg-green-100 text-green-800",
  CONTRACTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const FAQ_CATEGORIES: Record<string, string> = {
  general: "일반",
  investment: "투자",
  program: "프로그램",
  operation: "운영",
};

export const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "기타",
];

export const BUDGET_OPTIONS = [
  "3,000만원 이하",
  "3,000~5,000만원",
  "5,000~7,000만원",
  "7,000만원~1억원",
  "1억원 이상",
];
