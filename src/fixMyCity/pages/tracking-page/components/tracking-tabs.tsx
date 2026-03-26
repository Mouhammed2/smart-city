import { ReportsAllTab } from "@/pages/tracking-page/components/reports-all-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TrackingTabsProps = {
  onOpenIssue: () => void;
};

export function TrackingTabs({ onOpenIssue }: TrackingTabsProps) {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="no-scrollbar flex w-full flex-nowrap gap-4 overflow-x-auto bg-transparent pb-2">
        <TabsTrigger value="all">All Reports (12)</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="progress">In Progress</TabsTrigger>
        <TabsTrigger value="resolved">Resolved</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ReportsAllTab onOpenIssue={onOpenIssue} />
      </TabsContent>
      <TabsContent value="pending" className="text-sm text-slate-500">
        No pending reports.
      </TabsContent>
      <TabsContent value="progress" className="text-sm text-slate-500">
        1 report currently in progress.
      </TabsContent>
      <TabsContent value="resolved" className="text-sm text-slate-500">
        1 report resolved.
      </TabsContent>
    </Tabs>
  );
}

