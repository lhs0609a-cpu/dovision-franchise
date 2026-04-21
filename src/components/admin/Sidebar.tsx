"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  FileText,
  Map,
  Kanban,
  Wallet,
  Award,
  HelpCircle,
  Bell,
  Settings,
  Star,
  ExternalLink,
  ClipboardCheck,
  GraduationCap,
  History,
  Sparkles,
  TrendingUp,
  FilePlus2,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/auth";
import { canAccess, type Feature } from "@/lib/admin/rbac";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  feature: Feature;
  badge?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      {
        href: "/admin",
        icon: LayoutDashboard,
        label: "대시보드",
        feature: "dashboard",
      },
      {
        href: "/admin/map",
        icon: Map,
        label: "전국 가맹점 지도",
        feature: "map",
      },
    ],
  },
  {
    label: "가맹사업",
    items: [
      {
        href: "/admin/inquiries",
        icon: MessageSquare,
        label: "문의 관리",
        feature: "inquiries",
      },
      {
        href: "/admin/pipeline",
        icon: Kanban,
        label: "파이프라인",
        feature: "pipeline",
      },
      {
        href: "/admin/franchisees",
        icon: Building2,
        label: "가맹점 관리",
        feature: "franchisees",
      },
      {
        href: "/admin/contracts",
        icon: FileText,
        label: "가맹계약서",
        feature: "contracts",
      },
    ],
  },
  {
    label: "영업·성과",
    items: [
      {
        href: "/admin/revenue",
        icon: Wallet,
        label: "본사 수익",
        feature: "revenue",
      },
      {
        href: "/admin/predictions",
        icon: TrendingUp,
        label: "예측 분석",
        feature: "predictions",
      },
      {
        href: "/admin/reports/monthly",
        icon: FilePlus2,
        label: "월간 리포트",
        feature: "reports",
      },
    ],
  },
  {
    label: "운영 관리",
    items: [
      {
        href: "/admin/visits",
        icon: ClipboardCheck,
        label: "SV 방문 관리",
        feature: "visits",
      },
      {
        href: "/admin/training",
        icon: GraduationCap,
        label: "교육 이수",
        feature: "training",
      },
    ],
  },
  {
    label: "지능형 도구",
    items: [
      {
        href: "/admin/advisor",
        icon: Sparkles,
        label: "AI 어드바이저",
        feature: "advisor",
      },
    ],
  },
  {
    label: "CS",
    items: [
      {
        href: "/admin/tickets",
        icon: MessageCircleQuestion,
        label: "CS 티켓",
        feature: "tickets",
      },
    ],
  },
  {
    label: "마케팅 콘텐츠",
    items: [
      {
        href: "/admin/testimonials",
        icon: Star,
        label: "성과사례",
        feature: "testimonials",
      },
      { href: "/admin/faq", icon: HelpCircle, label: "FAQ", feature: "faq" },
      {
        href: "/admin/notices",
        icon: Bell,
        label: "공지사항",
        feature: "notices",
      },
    ],
  },
  {
    label: "시스템",
    items: [
      {
        href: "/admin/audit",
        icon: History,
        label: "감사 로그",
        feature: "audit",
      },
      {
        href: "/admin/settings",
        icon: Settings,
        label: "설정",
        feature: "settings",
      },
    ],
  },
];

export default function Sidebar({ role }: { role?: AdminRole }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-white">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-purple-700">
          <Award className="h-4 w-4 text-white" />
        </div>
        <div>
          <Link
            href="/admin"
            className="block text-[13px] font-bold leading-tight text-foreground"
          >
            DOVISION HQ
          </Link>
          <p className="text-[9.5px] leading-tight text-muted-foreground">
            가맹본부 운영시스템
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => {
          const visibleItems = group.items.filter((item) =>
            canAccess(item.feature, role)
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} className="mb-5">
              <p className="px-2 pb-1.5 text-[9.5px] font-bold tracking-[0.15em] text-muted-foreground/70">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isActive ? "text-primary" : ""
                          )}
                        />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11.5px] text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          고객 사이트 보기
        </Link>
      </div>
    </aside>
  );
}
