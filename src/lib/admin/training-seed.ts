// ============================================================
// 교육 커리큘럼 시드 — Phase 7 체크리스트의 핵심 항목들
// ============================================================

export type TrainingSeed = {
  code: string;
  title: string;
  category: "원장" | "강사" | "행정" | "법정";
  isRequired: boolean;
  order: number;
  description?: string;
};

export const TRAINING_CURRICULA: TrainingSeed[] = [
  // 원장
  { code: "IMAGE_MEMORY_BASIC", title: "이미지 전환 기억법 기초", category: "원장", isRequired: true, order: 1 },
  { code: "IMAGE_MEMORY_ADVANCED", title: "이미지 전환 기억법 심화", category: "원장", isRequired: true, order: 2 },
  { code: "NEUROFEEDBACK", title: "뉴로피드백 원리 및 운용", category: "원장", isRequired: true, order: 3 },
  { code: "BTS_CURRICULUM", title: "BTS 5단계 커리큘럼", category: "원장", isRequired: true, order: 4 },
  { code: "STUDENT_ASSESSMENT", title: "학생 평가·진단·성과 리포트", category: "원장", isRequired: true, order: 5 },
  { code: "PARENT_COUNSELING", title: "학부모 상담 스킬", category: "원장", isRequired: true, order: 6 },
  { code: "CERTIFICATE_PRINCIPAL", title: "원장 수료증 발급", category: "원장", isRequired: true, order: 7 },

  // 강사
  { code: "TEACHER_TRAINING", title: "강사 교육 이수", category: "강사", isRequired: true, order: 10 },
  { code: "CERTIFICATE_TEACHER", title: "강사 자격증 발급", category: "강사", isRequired: true, order: 11 },

  // 행정
  { code: "CRM_USAGE", title: "회원관리 시스템 사용법", category: "행정", isRequired: true, order: 20 },
  { code: "FINANCE_BASICS", title: "수납·재무 기초 (부가세·소득세)", category: "행정", isRequired: true, order: 21 },
  { code: "EMERGENCY_PROTOCOL", title: "응급상황 매뉴얼 숙지", category: "행정", isRequired: true, order: 22 },

  // 법정
  { code: "PRIVACY_LAW", title: "개인정보보호법 실무", category: "법정", isRequired: true, order: 30 },
  { code: "CHILD_ABUSE_PREVENT", title: "아동학대 예방 교육", category: "법정", isRequired: true, order: 31 },
  { code: "HARASSMENT_PREVENT", title: "성희롱 예방 교육 (5인 이상)", category: "법정", isRequired: true, order: 32 },
];
