import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function IssueDetailHeader() {
  return (
    <header className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <Badge variant="warning">In-Progress</Badge>
        <span className="text-sm text-slate-500">Report #ARC-9921-X</span>
      </div>
      <h2 className="mb-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Structural damage identified on Riverside pedestrian bridge.</h2>
      <div className="flex items-center gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> July 12, 2023
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Waterfront District
        </div>
      </div>
    </header>
  );
}

