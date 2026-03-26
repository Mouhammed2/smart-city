import { DescriptionEvidenceCard } from "@/pages/new-report-page/components/description-evidence-card";
import { IssueCategoryCard } from "@/pages/new-report-page/components/issue-category-card";
import { ReportActions } from "@/pages/new-report-page/components/report-actions";

type NewReportContentProps = {
  onSaveDraft: () => void;
  onSubmitReport: () => void;
};

export function NewReportContent({ onSaveDraft, onSubmitReport }: NewReportContentProps) {
  return (
    <div className="space-y-12 lg:col-span-8">
      <IssueCategoryCard />
      <DescriptionEvidenceCard />
      <ReportActions onSaveDraft={onSaveDraft} onSubmitReport={onSubmitReport} />
    </div>
  );
}

