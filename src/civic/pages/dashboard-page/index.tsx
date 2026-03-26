import { useNavigate } from "react-router-dom";

import { Sidebar, TopAppBar } from "@/components/layout/app-shell";
import { DashboardBulletinsSection } from "@/pages/dashboard-page/components/bulletins-section";
import { DashboardContent } from "@/pages/dashboard-page/components/dashboard-content";
import { DashboardOverviewSection } from "@/pages/dashboard-page/components/overview-section";
import { DashboardRecentReportsSection } from "@/pages/dashboard-page/components/recent-reports-section";

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <TopAppBar />
      <div className="flex pt-16">
        <Sidebar />
        <DashboardContent>
          <DashboardOverviewSection />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <DashboardRecentReportsSection onOpenIssue={() => navigate("/civic/issue/1")} />
            <DashboardBulletinsSection />
          </div>
        </DashboardContent>
      </div>
    </div>
  );
};

