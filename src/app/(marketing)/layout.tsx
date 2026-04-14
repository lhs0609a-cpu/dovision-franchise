import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import FloatingCTA from "@/components/marketing/FloatingCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
