import { useNavigate } from "react-router-dom";

import { TopAppBar } from "@/components/layout/app-shell";
import { NewReportContent } from "@/pages/new-report-page/components/new-report-content";
import { NewReportIntro } from "@/pages/new-report-page/components/report-intro";

export const NewReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar showBack />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-32 pt-24 lg:grid-cols-12">
        <NewReportIntro />
        <NewReportContent onSaveDraft={() => navigate("/civic/tracking")} onSubmitReport={() => navigate("/civic/tracking")} />
      </main>
    </div>
  );
};

