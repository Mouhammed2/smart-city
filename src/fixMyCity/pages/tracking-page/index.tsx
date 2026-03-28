import { useNavigate } from "react-router-dom";

import { Sidebar, TopAppBar } from "@/components/layout/app-shell";
import { TrackingHeader } from "@/pages/tracking-page/components/tracking-header";
import { TrackingTabs } from "@/pages/tracking-page/components/tracking-tabs";

export const TrackingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="mx-auto max-w-6xl flex-1 px-6 py-12 md:px-16">
          <TrackingHeader />
          <TrackingTabs onOpenIssue={() => navigate("/fixmycity/issue/1")} />
        </main>
      </div>
    </div>
  );
};

