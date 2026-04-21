// ============================================================
// RBAC — 역할 기반 접근 제어
// ============================================================

import type { AdminRole } from "@/lib/auth";

export type Feature =
  | "dashboard"
  | "map"
  | "inquiries"
  | "pipeline"
  | "franchisees"
  | "contracts"
  | "revenue"
  | "visits"
  | "training"
  | "audit"
  | "testimonials"
  | "faq"
  | "notices"
  | "settings"
  | "advisor"
  | "predictions"
  | "reports"
  | "tickets";

// 각 기능별 접근 가능 역할
const FEATURE_ACCESS: Record<Feature, AdminRole[]> = {
  // 전 역할 공통
  dashboard: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "SALES", "EDUCATION", "FINANCE"],
  map: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "SALES"],

  // 가맹사업
  inquiries: ["SUPER_ADMIN", "ADMIN", "SALES"],
  pipeline: ["SUPER_ADMIN", "ADMIN", "SALES"],
  franchisees: ["SUPER_ADMIN", "ADMIN", "SALES", "SUPERVISOR", "EDUCATION"],
  contracts: ["SUPER_ADMIN", "ADMIN", "SALES"],

  // 영업·성과
  revenue: ["SUPER_ADMIN", "ADMIN", "FINANCE"],

  // 운영
  visits: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR"],
  training: ["SUPER_ADMIN", "ADMIN", "EDUCATION"],

  // 지능형 도구
  advisor: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "SALES"],
  predictions: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "FINANCE"],
  reports: ["SUPER_ADMIN", "ADMIN", "FINANCE"],

  // CS
  tickets: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "SALES"],

  // 시스템
  audit: ["SUPER_ADMIN"],
  settings: ["SUPER_ADMIN"],

  // 마케팅 콘텐츠
  testimonials: ["SUPER_ADMIN", "ADMIN"],
  faq: ["SUPER_ADMIN", "ADMIN"],
  notices: ["SUPER_ADMIN", "ADMIN"],
};

export function canAccess(feature: Feature, role: AdminRole | undefined): boolean {
  if (!role) return false;
  return FEATURE_ACCESS[feature].includes(role);
}

// URL 경로 → feature 매핑
export function pathToFeature(path: string): Feature | null {
  if (path === "/admin" || path === "/admin/") return "dashboard";
  if (path.startsWith("/admin/map")) return "map";
  if (path.startsWith("/admin/inquiries")) return "inquiries";
  if (path.startsWith("/admin/pipeline")) return "pipeline";
  if (path.startsWith("/admin/franchisees")) return "franchisees";
  if (path.startsWith("/admin/contracts")) return "contracts";
  if (path.startsWith("/admin/revenue")) return "revenue";
  if (path.startsWith("/admin/visits")) return "visits";
  if (path.startsWith("/admin/training")) return "training";
  if (path.startsWith("/admin/audit")) return "audit";
  if (path.startsWith("/admin/testimonials")) return "testimonials";
  if (path.startsWith("/admin/faq")) return "faq";
  if (path.startsWith("/admin/notices")) return "notices";
  if (path.startsWith("/admin/settings")) return "settings";
  if (path.startsWith("/admin/advisor")) return "advisor";
  if (path.startsWith("/admin/predictions")) return "predictions";
  if (path.startsWith("/admin/reports")) return "reports";
  if (path.startsWith("/admin/tickets")) return "tickets";
  return null;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "슈퍼관리자",
  SUPERVISOR: "SV (슈퍼바이저)",
  SALES: "영업 담당",
  EDUCATION: "교육 담당",
  FINANCE: "재무 담당",
  ADMIN: "일반 관리자",
};
