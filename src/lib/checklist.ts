// ============================================================
// 가맹점 개업 체크리스트 — 마스터 템플릿 & Phase 메타
// ============================================================
// 근거 문서: 가맹점_개업_체크리스트.md (프로젝트 루트)
// defaultOffsetDays: 개업일 기준 (음수 = 개업 전 / 양수 = 개업 후)
// isLegalRequired: 가맹사업법·학원법·개인정보보호법 등 법정 필수
// ============================================================

export type ChecklistSeed = {
  phase: number;
  order: number;
  title: string;
  description?: string;
  isLegalRequired?: boolean;
  defaultOffsetDays?: number;
};

export const PHASE_META: Record<number, { name: string; window: string }> = {
  0: { name: "사전 탐색", window: "D-180 ~ D-120" },
  1: { name: "상담 및 검토", window: "D-120 ~ D-90" },
  2: { name: "가맹 계약", window: "D-90 ~ D-75" },
  3: { name: "입지 선정", window: "D-75 ~ D-45" },
  4: { name: "법적 등록", window: "D-60 ~ D-40" },
  5: { name: "인테리어·시설", window: "D-60 ~ D-14" },
  6: { name: "장비·교구", window: "D-21 ~ D-7" },
  7: { name: "원장·강사 교육", window: "D-60 ~ D-14" },
  8: { name: "사전 마케팅", window: "D-30 ~ D-Day" },
  9: { name: "소프트·그랜드 오픈", window: "D-7 ~ D+7" },
  10: { name: "개업 후 안정화", window: "D+1 ~ D+90" },
  11: { name: "지속 교육", window: "D+90 ~" },
  12: { name: "성장·확장", window: "D+365 ~" },
};

export const CHECKLIST_ITEMS: ChecklistSeed[] = [
  // Phase 0. 사전 탐색
  { phase: 0, order: 1, title: "두비전 브랜드 기본 정보 수집", description: "공식 홈페이지·이미지 전환 기억법·뉴로피드백·BTS 5단계 프로그램 이해", defaultOffsetDays: -180 },
  { phase: 0, order: 2, title: "직영점 현장 체험 (강남/반포/위례 중 1곳 이상)", description: "수업 참관, 원장 인터뷰, 뉴로피드백 장비 직접 체험", defaultOffsetDays: -175 },
  { phase: 0, order: 3, title: "경쟁 브랜드 비교 분석 3~5개", description: "가맹비·로열티·초기투자금 비교표 작성, 차별화 포인트 식별", defaultOffsetDays: -170 },
  { phase: 0, order: 4, title: "재정 자가점검", description: "자기자본(최소 1.5억 권장) 확인, 대출 가능액 사전 심사, 가족 동의", defaultOffsetDays: -165 },
  { phase: 0, order: 5, title: "후보 지역 1차 선정 (AI 상권분석 활용)", description: "/territory-analysis 도구로 3~5개 후보 도출", defaultOffsetDays: -160 },
  { phase: 0, order: 6, title: "사업설명회 참석", defaultOffsetDays: -150 },
  { phase: 0, order: 7, title: "수익 시뮬레이션 (낙관/기본/보수 시나리오)", description: "월 매출·운영비·순이익·BEP 계산", defaultOffsetDays: -140 },

  // Phase 1. 상담 및 검토
  { phase: 1, order: 1, title: "본사 공식 상담 신청", defaultOffsetDays: -120 },
  { phase: 1, order: 2, title: "⚠️ 정보공개서 수령 (법정 필수)", description: "공정거래위원회 표준양식 확인, 수령일 반드시 기록 (숙고기간 기산일)", isLegalRequired: true, defaultOffsetDays: -115 },
  { phase: 1, order: 3, title: "⚠️ 14일 법정 숙고기간 경과 확인", description: "가맹사업법 §7 — 정보공개서 수령 후 14일 경과 전 계약·가맹비 납부 금지", isLegalRequired: true, defaultOffsetDays: -101 },
  { phase: 1, order: 4, title: "기존 가맹점주 인터뷰 최소 3명", description: "실제 매출, 본사 지원 만족도, 어려웠던 점 청취", defaultOffsetDays: -110 },
  { phase: 1, order: 5, title: "전문가 자문 (변호사·세무사·공인중개사)", description: "가맹계약서·세무·상권 시세 검토 (권장)", defaultOffsetDays: -105 },
  { phase: 1, order: 6, title: "가맹계약서 초안 정독", description: "영업구역, 계약기간, 위약금, 공급단가, 로열티 산정, 광고부담금", defaultOffsetDays: -100 },
  { phase: 1, order: 7, title: "개업 예산 계획서 작성", description: "가맹비·교육비·인테리어·장비·보증금·6개월 운영자금·예비비", defaultOffsetDays: -95 },

  // Phase 2. 가맹 계약
  { phase: 2, order: 1, title: "⚠️ 가맹계약 체결 (숙고기간 경과 확인)", description: "14일 경과 여부 재확인 후 서명", isLegalRequired: true, defaultOffsetDays: -90 },
  { phase: 2, order: 2, title: "가맹비 납부 및 증빙 보관", defaultOffsetDays: -88 },
  { phase: 2, order: 3, title: "교육비 선납", defaultOffsetDays: -88 },
  { phase: 2, order: 4, title: "보증금 예치 (해당 시)", defaultOffsetDays: -88 },
  { phase: 2, order: 5, title: "상표·상호 사용 승인서 수령", defaultOffsetDays: -85 },
  { phase: 2, order: 6, title: "영업구역 확정서 수령", description: "상권 보호 범위 문서화", defaultOffsetDays: -85 },
  { phase: 2, order: 7, title: "물류·장비 공급 계약 체결", defaultOffsetDays: -80 },
  { phase: 2, order: 8, title: "개인정보 수탁 계약 (회원 DB 본사 시스템 공유 시)", isLegalRequired: true, defaultOffsetDays: -80 },

  // Phase 3. 입지 선정
  { phase: 3, order: 1, title: "후보지 3~5곳 최종 선정", description: "AI 상권분석 결과 + 반경 2km 내 초·중학생 수 + 학원가 밀집도", defaultOffsetDays: -75 },
  { phase: 3, order: 2, title: "현장 실사 (시간대별 4회 이상)", description: "평일 등교/하교, 평일 저녁, 주말 오전/오후", defaultOffsetDays: -70 },
  { phase: 3, order: 3, title: "유동인구 측정", description: "주요 시간대 1시간 단위 카운트", defaultOffsetDays: -68 },
  { phase: 3, order: 4, title: "학부모 동선 분석", description: "학교·아파트·대형마트·학원가 연결성", defaultOffsetDays: -65 },
  { phase: 3, order: 5, title: "건축물대장 용도 확인", description: "2종 근린생활시설 또는 교육연구시설 적합 여부", isLegalRequired: true, defaultOffsetDays: -62 },
  { phase: 3, order: 6, title: "건물 조건 확인", description: "층수(1~3층 권장), 면적(40~60평 이상), 천장고, 채광, 환기, 주차, 화장실", defaultOffsetDays: -62 },
  { phase: 3, order: 7, title: "임대차 조건 협상", description: "보증금·월세·관리비·렌트프리·권리금·계약기간(2~3년)·원상복구 범위", defaultOffsetDays: -58 },
  { phase: 3, order: 8, title: "본사 입지 승인", defaultOffsetDays: -55 },
  { phase: 3, order: 9, title: "임대차 계약 체결", defaultOffsetDays: -50 },
  { phase: 3, order: 10, title: "확정일자 + 사업자 주소 등록", isLegalRequired: true, defaultOffsetDays: -48 },

  // Phase 4. 법적 등록
  { phase: 4, order: 1, title: "사업자 형태 결정 (개인 vs 법인)", defaultOffsetDays: -60 },
  { phase: 4, order: 2, title: "⚠️ 사업자등록 (관할 세무서)", description: "업태: 교육서비스업, 종목: 학원/교습소/평생교육시설", isLegalRequired: true, defaultOffsetDays: -55 },
  { phase: 4, order: 3, title: "⚠️ 교육기관 등록 (관할 교육지원청)", description: "학원/교습소/평생교육시설 중 선택, 지역별 서류 차이 확인", isLegalRequired: true, defaultOffsetDays: -50 },
  { phase: 4, order: 4, title: "학원설립·운영등록증 발급", isLegalRequired: true, defaultOffsetDays: -45 },
  { phase: 4, order: 5, title: "⚠️ 소방시설 완비 증명 (관할 소방서)", isLegalRequired: true, defaultOffsetDays: -42 },
  { phase: 4, order: 6, title: "⚠️ 4대보험 사업장 가입", description: "건강·국민연금·고용·산재", isLegalRequired: true, defaultOffsetDays: -40 },
  { phase: 4, order: 7, title: "개인정보 처리방침 수립 및 게시", isLegalRequired: true, defaultOffsetDays: -40 },
  { phase: 4, order: 8, title: "통신판매업 신고 (온라인 결제·홍보 시)", isLegalRequired: true, defaultOffsetDays: -40 },

  // Phase 5. 인테리어 및 시설
  { phase: 5, order: 1, title: "본사 브랜드 인테리어 매뉴얼 수령", defaultOffsetDays: -60 },
  { phase: 5, order: 2, title: "공사 업체 선정 및 견적 2~3개 비교", defaultOffsetDays: -55 },
  { phase: 5, order: 3, title: "도면 설계 및 본사 승인", defaultOffsetDays: -50 },
  { phase: 5, order: 4, title: "철거 및 시공 착공", description: "전기(220V/콘센트 위치), 인터넷·Wi-Fi 전구역, 방음, 조명, 바닥재, 도장", defaultOffsetDays: -42 },
  { phase: 5, order: 5, title: "CCTV 설치 (수업실·출입구·대기실)", defaultOffsetDays: -25 },
  { phase: 5, order: 6, title: "출입보안 시스템 (도어락·경비)", defaultOffsetDays: -22 },
  { phase: 5, order: 7, title: "소방시설 완공 검사", isLegalRequired: true, defaultOffsetDays: -20 },
  { phase: 5, order: 8, title: "브랜드 사인물 설치 (간판·로고·월)", defaultOffsetDays: -17 },
  { phase: 5, order: 9, title: "시설 완공 본사 실사 및 승인", defaultOffsetDays: -14 },

  // Phase 6. 장비·교구
  { phase: 6, order: 1, title: "뉴로피드백 장비 수령 및 설치", description: "수량·시리얼 확인, 소프트웨어 라이선스 활성화, 구동 테스트", defaultOffsetDays: -21 },
  { phase: 6, order: 2, title: "BTS(Brain Training Skill) 시스템 세팅", defaultOffsetDays: -18 },
  { phase: 6, order: 3, title: "태블릿/PC 세팅 (수강생 수 기준)", defaultOffsetDays: -16 },
  { phase: 6, order: 4, title: "교재 입고 (이미지 전환 기억법 전 단계)", defaultOffsetDays: -14 },
  { phase: 6, order: 5, title: "회원관리 시스템(CRM) 계정 세팅", defaultOffsetDays: -12 },
  { phase: 6, order: 6, title: "POS/결제 시스템 설치", description: "카드 단말기, 현금영수증, 자동이체 CMS", defaultOffsetDays: -10 },
  { phase: 6, order: 7, title: "사무비품 구매 (책상·의자·복합기·파일링)", defaultOffsetDays: -9 },
  { phase: 6, order: 8, title: "응급상자 / AED 비치 (권장)", defaultOffsetDays: -7 },

  // Phase 7. 원장/강사 교육
  { phase: 7, order: 1, title: "원장 교육 — 이미지 전환 기억법 기초·심화", defaultOffsetDays: -60 },
  { phase: 7, order: 2, title: "원장 교육 — 뉴로피드백 원리 및 운용", defaultOffsetDays: -55 },
  { phase: 7, order: 3, title: "원장 교육 — BTS 5단계 커리큘럼", defaultOffsetDays: -50 },
  { phase: 7, order: 4, title: "원장 교육 — 학생 평가·진단·성과 리포트", defaultOffsetDays: -45 },
  { phase: 7, order: 5, title: "원장 교육 — 학부모 상담 스킬", defaultOffsetDays: -40 },
  { phase: 7, order: 6, title: "원장 수료증 발급", defaultOffsetDays: -30 },
  { phase: 7, order: 7, title: "강사 채용 및 면접", defaultOffsetDays: -35 },
  { phase: 7, order: 8, title: "강사 교육 이수 및 자격증 발급", defaultOffsetDays: -21 },
  { phase: 7, order: 9, title: "행정 교육 — 회원관리·수납·재무", defaultOffsetDays: -18 },
  { phase: 7, order: 10, title: "⚠️ 개인정보보호법 실무 교육", isLegalRequired: true, defaultOffsetDays: -18 },
  { phase: 7, order: 11, title: "⚠️ 아동학대 예방 교육 (법정)", isLegalRequired: true, defaultOffsetDays: -15 },
  { phase: 7, order: 12, title: "⚠️ 성희롱 예방 교육 (5인 이상 사업장 법정)", isLegalRequired: true, defaultOffsetDays: -15 },
  { phase: 7, order: 13, title: "응급상황 매뉴얼 숙지", defaultOffsetDays: -14 },

  // Phase 8. 사전 마케팅
  { phase: 8, order: 1, title: "네이버 플레이스 등록", description: "주소·전화·영업시간·사진 10장 이상", defaultOffsetDays: -30 },
  { phase: 8, order: 2, title: "네이버 블로그 개설 및 사전 포스팅 10개+", defaultOffsetDays: -28 },
  { phase: 8, order: 3, title: "카카오맵 등록", defaultOffsetDays: -25 },
  { phase: 8, order: 4, title: "인스타그램 계정 개설 (피드 9개+)", defaultOffsetDays: -25 },
  { phase: 8, order: 5, title: "유튜브 쇼츠 (원장 소개·수업 브이로그)", defaultOffsetDays: -22 },
  { phase: 8, order: 6, title: "카카오톡 채널 개설 및 상담 자동응답 설정", defaultOffsetDays: -22 },
  { phase: 8, order: 7, title: "본사 홈페이지에 개업 예정 센터 등록", defaultOffsetDays: -20 },
  { phase: 8, order: 8, title: "전단지 제작 및 배포 (아파트·학교·맘카페)", defaultOffsetDays: -20 },
  { phase: 8, order: 9, title: "현수막 설치 (개업 예정)", defaultOffsetDays: -15 },
  { phase: 8, order: 10, title: "지역 맘카페 공동구매·체험단 이벤트", defaultOffsetDays: -15 },
  { phase: 8, order: 11, title: "개원 이벤트 설계 (무료 진단, 조기등록 할인, 친구추천 리워드)", defaultOffsetDays: -12 },
  { phase: 8, order: 12, title: "사전 상담 예약 접수 시작", defaultOffsetDays: -10 },

  // Phase 9. 소프트/그랜드 오픈
  { phase: 9, order: 1, title: "소프트 오픈 — 지인·본사 임직원 대상 시범 운영", description: "동선 점검, 장비 실전 테스트, 상담 스크립트 리허설", defaultOffsetDays: -7 },
  { phase: 9, order: 2, title: "개업식 준비 (임직원·지역 유관기관 초청, 떡·다과)", defaultOffsetDays: -3 },
  { phase: 9, order: 3, title: "그랜드 오픈 당일 진행", description: "리본 커팅, 홍보 영상·사진 촬영, SNS 실시간 업로드", defaultOffsetDays: 0 },
  { phase: 9, order: 4, title: "지역 신문 보도자료 배포", defaultOffsetDays: 0 },
  { phase: 9, order: 5, title: "오픈 1주차 집중 대응 (상담 인입 실시간·문의 누락 제로)", defaultOffsetDays: 3 },

  // Phase 10. 개업 후 안정화
  { phase: 10, order: 1, title: "주간 운영 리포트 본사 제출 시작", description: "상담·등록 건수, 매출·지출, 이슈·어려움", defaultOffsetDays: 7 },
  { phase: 10, order: 2, title: "월간 본사 방문 점검 스케줄 확정", defaultOffsetDays: 14 },
  { phase: 10, order: 3, title: "수강생 피드백 수집 (2주 간격)", defaultOffsetDays: 14 },
  { phase: 10, order: 4, title: "학부모 설문조사 (1개월 차)", defaultOffsetDays: 30 },
  { phase: 10, order: 5, title: "월말 손익 분석 (1개월 차)", defaultOffsetDays: 30 },
  { phase: 10, order: 6, title: "수강생 이탈 원인 분석 및 대응", defaultOffsetDays: 45 },
  { phase: 10, order: 7, title: "학부모 설문조사 (3개월 차)", defaultOffsetDays: 90 },
  { phase: 10, order: 8, title: "100일 리뷰 — BEP 진입 여부 및 다음 분기 목표", defaultOffsetDays: 100 },

  // Phase 11. 지속 교육
  { phase: 11, order: 1, title: "분기별 원장 보수교육 이수", defaultOffsetDays: 120 },
  { phase: 11, order: 2, title: "신규 프로그램 업데이트 교육 이수", defaultOffsetDays: 150 },
  { phase: 11, order: 3, title: "전국 가맹점 워크샵 참석 (연 2회)", defaultOffsetDays: 180 },
  { phase: 11, order: 4, title: "우수 가맹점 벤치마킹 투어 참여", defaultOffsetDays: 240 },
  { phase: 11, order: 5, title: "가맹점주 커뮤니티 참여 (카톡방·포럼)", defaultOffsetDays: 100 },

  // Phase 12. 성장·확장
  { phase: 12, order: 1, title: "2호점 타당성 검토", defaultOffsetDays: 365 },
  { phase: 12, order: 2, title: "지역 학교 제휴 확대 (방과후·돌봄교실)", defaultOffsetDays: 365 },
  { phase: 12, order: 3, title: "B2B 확장 (기업 임직원 뇌교육 프로그램)", defaultOffsetDays: 450 },
  { phase: 12, order: 4, title: "성과 사례 본사 기고 (마케팅 자산화)", defaultOffsetDays: 500 },
  { phase: 12, order: 5, title: "신규 가맹점주 멘토 자격 획득", defaultOffsetDays: 540 },
];
