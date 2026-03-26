import { Hammer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function IssueCategoryCard() {
  return (
    <Card className="border-0 shadow-xl shadow-slate-200/40">
      <CardContent className="space-y-8 p-8">
        <div className="border-l-4 border-l-blue-700 pl-4">
          <p className="text-2xl font-bold text-blue-700">Issue Category</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {["Roadwork", "Lighting", "Waste", "Parks", "Water", "Other"].map((cat) => (
            <Button key={cat} variant="outline" className="h-auto flex-col rounded-xl border-2 border-transparent bg-slate-50 p-6 hover:border-blue-700 hover:bg-blue-50">
              <Hammer className="mb-3 h-6 w-6 text-blue-700" />
              <span className="text-sm font-bold text-slate-900">{cat}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

