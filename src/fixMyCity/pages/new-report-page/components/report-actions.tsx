import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReportActionsProps = {
  onSaveDraft: () => void;
  onSubmitReport: () => void;
};

export function ReportActions({ onSaveDraft, onSubmitReport }: ReportActionsProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-6 pt-4 sm:flex-row">
      <Button variant="outline" onClick={onSaveDraft} className="w-full rounded-xl bg-slate-100 px-8 py-6 font-bold text-blue-700 sm:w-auto">
        Save as Draft
      </Button>
      <Button onClick={onSubmitReport} className="w-full rounded-xl bg-gradient-to-r from-blue-800 to-blue-700 px-12 py-6 font-bold text-white sm:w-auto hover:from-blue-700 hover:to-blue-600">
        Submit Official Report
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}

