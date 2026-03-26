import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ReportsAllTabProps = {
  onOpenIssue: () => void;
};

export function ReportsAllTab({ onOpenIssue }: ReportsAllTabProps) {
  return (
    <div className="space-y-4">
      <Card className="cursor-pointer border-0 shadow-xl shadow-slate-200/40 transition hover:-translate-y-0.5" onClick={onOpenIssue}>
        <CardContent className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="warning" className="text-[10px] uppercase tracking-widest">
                In-Progress
              </Badge>
              <span className="text-xs font-medium text-slate-400">#RPT-2024-089</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pothole Repair Request: Oak Street North</h3>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Oct 12, 2023
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> District 4
              </span>
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl bg-slate-50 text-blue-700">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-slate-100">
        <CardContent className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
                Resolved
              </Badge>
              <span className="text-xs font-medium text-slate-400">#RPT-2024-042</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Broken Street Light: Central Square</h3>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Sep 28, 2023
              </span>
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl bg-white text-blue-700">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

