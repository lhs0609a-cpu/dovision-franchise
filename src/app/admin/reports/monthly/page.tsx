import { auth } from "@/lib/auth";
import { canAccess } from "@/lib/admin/rbac";
import AccessDenied from "@/components/admin/AccessDenied";
import { getDashboardData } from "@/lib/admin/dashboard-data";
import { computeChurnRisks } from "@/lib/admin/predictions";
import { prisma } from "@/lib/prisma";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function MonthlyReportPage() {
  const session = await auth();
  const role = session?.user.role;
  if (!canAccess("reports", role)) {
    return <AccessDenied feature="월간 리포트" role={role} />;
  }

  const now = new Date();
  const reportMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [dash, risks, operatingFranchisees, contract] = await Promise.all([
    getDashboardData(),
    computeChurnRisks(),
    prisma.franchisee.findMany({
      where: { status: "OPERATING" },
      select: { id: true, name: true, region: true, createdAt: true },
    }),
    prisma.contractTemplate.findFirst({ where: { isActive: true } }),
  ]);

  const critical = risks.filter((r) => r.riskLevel === "CRITICAL");
  const high = risks.filter((r) => r.riskLevel === "HIGH");
  const avgMonthly = 2400;
  const estHqMonthly = operatingFranchisees.length * avgMonthly * 0.225;

  return (
    <>
      <PrintButton />
      <div className="report-sheet mx-auto max-w-[210mm] bg-white p-10 shadow-lg print:max-w-none print:p-0 print:shadow-none">
        {/* 커버 */}
        <header className="mb-10 border-b-2 border-primary pb-6">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary">
            DOVISION HQ · MONTHLY REPORT
          </p>
          <h1 className="mt-2 text-[28px] font-bold">
            {reportMonth.getFullYear()}년 {reportMonth.getMonth() + 1}월{" "}
            가맹사업 월간 리포트
          </h1>
          <p className="mt-2 text-[12px] text-muted-foreground">
            작성일: {now.toLocaleDateString("ko-KR")} · 본 리포트는 두비전 본사
            운영 데이터를 기반으로 자동 생성되었습니다.
          </p>
        </header>

        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="mb-3 text-[16px] font-bold">Executive Summary</h2>
          <ul className="space-y-1 text-[13px] leading-[1.7]">
            <li>
              • 전체 가맹점 <strong>{dash.kpis.totalFranchisees}곳</strong>
              {" "}(운영 중 {dash.kpis.activeFranchisees}, 준비 중{" "}
              {dash.kpis.totalFranchisees -
                dash.kpis.activeFranchisees -
                dash.kpis.terminatedFranchisees}
              , 해지 {dash.kpis.terminatedFranchisees})
            </li>
            <li>
              • 이번 달 신규 가맹 <strong>{dash.kpis.newThisMonth}곳</strong>,
              신규 문의 <strong>{dash.kpis.newInquiriesThisMonth}건</strong>,
              문의→계약 전환율 <strong>{dash.kpis.conversionRate}%</strong>
            </li>
            <li>
              • 본사 월 수입 추정{" "}
              <strong>{Math.round(estHqMonthly).toLocaleString()}만원</strong>
              {" "}(로열티 10% + 앱교재비 12.5%)
            </li>
            <li>
              • 해지 위험 <strong className="text-rose-600">긴급{" "}
                {critical.length}곳</strong>, <strong className="text-orange-600">고위험 {high.length}곳</strong>
            </li>
          </ul>
        </section>

        {/* 핵심 지표 */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="mb-3 text-[16px] font-bold">1. 핵심 지표</h2>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="border p-2">항목</th>
                <th className="border p-2 text-right">값</th>
                <th className="border p-2">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">전체 가맹점</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.totalFranchisees}곳
                </td>
                <td className="border p-2 text-muted-foreground">누적</td>
              </tr>
              <tr>
                <td className="border p-2">운영 중</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.activeFranchisees}곳
                </td>
                <td className="border p-2 text-muted-foreground">
                  매출 발생
                </td>
              </tr>
              <tr>
                <td className="border p-2">이번 달 신규 문의</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.newInquiriesThisMonth}건
                </td>
                <td className="border p-2 text-muted-foreground">
                  누적 {dash.kpis.totalInquiries}건
                </td>
              </tr>
              <tr>
                <td className="border p-2">문의 → 계약 전환율</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.conversionRate}%
                </td>
                <td className="border p-2 text-muted-foreground">누적</td>
              </tr>
              <tr>
                <td className="border p-2">SLA 24h 초과</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.slaOverdue}건
                </td>
                <td className="border p-2 text-muted-foreground">
                  신규 문의 미대응
                </td>
              </tr>
              <tr>
                <td className="border p-2">정보공개서 숙고 중</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.contractsPending}건
                </td>
                <td className="border p-2 text-muted-foreground">
                  14일 법정 대기
                </td>
              </tr>
              <tr>
                <td className="border p-2">계약서 동의율</td>
                <td className="border p-2 text-right font-bold">
                  {dash.kpis.contractAgreedRate}%
                </td>
                <td className="border p-2 text-muted-foreground">
                  활성 계약 기준
                </td>
              </tr>
              <tr>
                <td className="border p-2">본사 월 수입 (추정)</td>
                <td className="border p-2 text-right font-bold">
                  {Math.round(estHqMonthly).toLocaleString()}만원
                </td>
                <td className="border p-2 text-muted-foreground">
                  매출의 22.5%
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 파이프라인 */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="mb-3 text-[16px] font-bold">
            2. 가맹 파이프라인 현황
          </h2>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="border p-2">단계</th>
                <th className="border p-2 text-right">건수</th>
              </tr>
            </thead>
            <tbody>
              {dash.pipelineCounts.map((p) => (
                <tr key={p.status}>
                  <td className="border p-2">{p.label}</td>
                  <td className="border p-2 text-right font-bold">
                    {p.count}건
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 해지 위험 */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="mb-3 text-[16px] font-bold">
            3. 해지 위험 분석
          </h2>
          {critical.length === 0 && high.length === 0 ? (
            <p className="text-[12.5px] text-emerald-700">
              ✅ 긴급/고위험 등급 가맹점 없음. 현재 운영 안정적.
            </p>
          ) : (
            <>
              <p className="mb-2 text-[12px] text-muted-foreground">
                본사 선제 개입 필요 — 72시간 내 SV 방문 권장
              </p>
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="border p-2">가맹점</th>
                    <th className="border p-2">지역</th>
                    <th className="border p-2 text-right">
                      위험도
                    </th>
                    <th className="border p-2">주요 요인</th>
                  </tr>
                </thead>
                <tbody>
                  {[...critical, ...high].map((r) => {
                    const topFactors = r.factors
                      .filter((f) => f.actual > 0)
                      .sort((a, b) => b.actual - a.actual)
                      .slice(0, 2)
                      .map((f) => `${f.label}(+${f.actual})`)
                      .join(", ");
                    return (
                      <tr key={r.id}>
                        <td className="border p-2 font-semibold">
                          {r.name}
                        </td>
                        <td className="border p-2">{r.region}</td>
                        <td
                          className={`border p-2 text-right font-bold ${r.riskLevel === "CRITICAL" ? "text-rose-600" : "text-orange-600"}`}
                        >
                          {r.riskScore}/100 ({r.riskLevel})
                        </td>
                        <td className="border p-2 text-muted-foreground">
                          {topFactors || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </section>

        {/* 계약서 현황 */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="mb-3 text-[16px] font-bold">
            4. 가맹계약서 현황
          </h2>
          {contract ? (
            <p className="text-[12.5px]">
              활성 버전: <strong>{contract.version}</strong> ({contract.title})
              {contract.effectiveFrom && (
                <>
                  {" "}· 적용 시작일{" "}
                  {new Date(contract.effectiveFrom).toLocaleDateString("ko-KR")}
                </>
              )}
              <br />
              전체 가맹점 {dash.kpis.totalFranchisees}곳 중{" "}
              <strong className="text-primary">
                {dash.kpis.contractAgreedRate}%
              </strong>{" "}
              동의 완료
            </p>
          ) : (
            <p className="text-[12.5px] text-amber-700">
              ⚠️ 현재 배포 중인 계약서 버전 없음 (본사 업로드 필요)
            </p>
          )}
        </section>

        {/* 운영 중 가맹점 */}
        <section className="mb-8">
          <h2 className="mb-3 text-[16px] font-bold">
            5. 운영 중 가맹점 ({operatingFranchisees.length}곳)
          </h2>
          {operatingFranchisees.length === 0 ? (
            <p className="text-[12.5px] text-muted-foreground">
              운영 중 가맹점 없음
            </p>
          ) : (
            <table className="w-full border-collapse text-[11.5px]">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="border p-2">가맹점</th>
                  <th className="border p-2">지역</th>
                  <th className="border p-2 text-right">개업일</th>
                </tr>
              </thead>
              <tbody>
                {operatingFranchisees.map((f) => (
                  <tr key={f.id}>
                    <td className="border p-2 font-semibold">{f.name}</td>
                    <td className="border p-2">{f.region}</td>
                    <td className="border p-2 text-right text-muted-foreground">
                      {new Date(f.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* 푸터 */}
        <footer className="mt-12 border-t pt-4 text-center text-[10px] text-muted-foreground">
          © {now.getFullYear()} DOVISION / ㈜키네스 — 본 리포트는 본사 내부용이며
          외부 공개 시 법적·경영상 리스크가 있을 수 있습니다.
        </footer>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { background: white !important; }
          header, aside, .no-print { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
          .report-sheet { box-shadow: none !important; padding: 0 !important; max-width: none !important; }
        }
      `}</style>
    </>
  );
}
