import { MapPin, Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function IssueDetailSidebar() {
  return (
    <div className="space-y-6 lg:col-span-4">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full bg-slate-200">
          <img
            className="h-full w-full object-cover opacity-50 grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6AzYQhEgBJKEexR1jKJ9GGnH50hNMy6i6H_R2eoGyj6F32RWrD76WaBU0sggyVT7H4axwyIjm6X7LYcbCSxXDb22YsCme49P-0D-OQ8eqWO19Uij2tHXnIAbM-l1T0ZrsWgQ4Linx1DUtvKuyTUbyiaxpDA-NP7SUbyJ4ZSlxS3HZghy2Pomx87sBqm_ekAe3_s2YvxUstPmNlMJKwsMHNwMfw9qyhv35fKC2hWhKfrHJKhA9ATvrSiz-JZpsiRNoop59ejGdLf8"
            alt="Issue location map preview"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>
        <CardContent className="flex justify-between bg-slate-50 p-4 text-xs text-slate-600">
          <span>GPS: 51.5074 N, 0.1278 W</span>
          <span className="font-bold text-blue-700">Open Maps</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Department</h4>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Public Works</div>
              <div className="text-xs text-slate-500">Maintenance Div</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

