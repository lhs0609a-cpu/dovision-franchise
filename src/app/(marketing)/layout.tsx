import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import FloatingCTA from "@/components/marketing/FloatingCTA";
import TopBanner from "@/components/marketing/TopBanner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="snap-container">
      <div className="fixed top-0 left-0 right-0 z-50 print:hidden">
        <TopBanner />
        <Header />
      </div>
      <main className="flex-1 pt-[108px] print:pt-0">{children}</main>
      <div className="print:hidden">
        <Footer />
        <FloatingCTA />
      </div>
    </div>
  );
}
