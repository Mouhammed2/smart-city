import { CheckCircle2, CircleGauge, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardOverviewSection = () => {
  return (
    <section className="mb-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900 md:text-5xl">Municipal Overview</h1>
          <p className="max-w-xl text-slate-600">Transparent infrastructure tracking for the citizens of the metro area.</p>
        </div>
        <Button variant="outline" className="rounded-xl bg-slate-100 font-bold text-blue-700">
          <Filter className="h-4 w-4" />
          Filter Views
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-0 border-b-4 border-b-blue-700 shadow-sm md:col-span-2">
          <CardContent className="flex h-full flex-col justify-between p-8">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Activity Score</p>
              <h2 className="text-5xl font-black text-blue-700">84%</h2>
            </div>
            <p className="mt-4 text-sm text-slate-600">Urban efficiency up 12% from last quarter.</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-100">
          <CardContent className="p-8">
            <CircleGauge className="mb-4 h-6 w-6 text-amber-700" />
            <h3 className="text-3xl font-bold text-slate-900">124</h3>
            <p className="text-sm font-bold text-amber-700">In-Progress Reports</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-blue-100">
          <CardContent className="p-8">
            <CheckCircle2 className="mb-4 h-6 w-6 text-blue-700" />
            <h3 className="text-3xl font-bold text-slate-900">2,840</h3>
            <p className="text-sm font-bold text-blue-700">Resolved Issues</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

