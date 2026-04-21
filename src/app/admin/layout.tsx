import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { auth } from "@/lib/auth";
import { collectAdminAlerts } from "@/lib/admin/alerts";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session && session.user.userType !== "admin") {
    redirect("/portal");
  }
  const alerts = session ? await collectAdminAlerts() : [];

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {session && (
          <TopBar
            userName={session.user.name}
            userEmail={session.user.email}
            alerts={alerts}
          />
        )}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
