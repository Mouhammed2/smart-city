import { useNavigate } from "react-router-dom";
import {DashboardRecentReportsSection} from "./components/recent-reports-section";
import {DashboardBulletinsSection} from "./components/bulletins-section";
import {Sidebar, TopAppBar} from "../../components/layout/app-shell";
import {DashboardContent} from "./components/dashboard-content";
import {DashboardOverviewSection} from "./components/overview-section";

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
            <DashboardRecentReportsSection onOpenIssue={() => navigate("/fixmycity/issue/1")} />
            <DashboardBulletinsSection />
          </div>
        </DashboardContent>
      </div>
    </div>
  );
};

