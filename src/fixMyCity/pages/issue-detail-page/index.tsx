import { Sidebar, TopAppBar } from "@/components/layout/app-shell";
import { IssueDetailHeader } from "@/pages/issue-detail-page/components/issue-detail-header";
import { IssueDetailMainContent } from "@/pages/issue-detail-page/components/issue-detail-main-content";
import { IssueDetailSidebar } from "@/pages/issue-detail-page/components/issue-detail-sidebar";

export const IssueDetailPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar showBack />
      <div className="flex pt-16">
        <Sidebar />
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-12 lg:p-16">
          <IssueDetailHeader />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <IssueDetailMainContent />
            <IssueDetailSidebar />
          </div>
        </main>
      </div>
    </div>
  );
};

