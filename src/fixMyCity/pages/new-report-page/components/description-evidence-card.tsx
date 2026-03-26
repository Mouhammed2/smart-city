import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionEvidenceCard() {
  return (
    <Card className="border-0 shadow-xl shadow-slate-200/40">
      <CardContent className="space-y-8 p-8">
        <div className="border-l-4 border-l-blue-700 pl-4">
          <p className="text-2xl font-bold text-blue-700">Describe &amp; Evidence</p>
        </div>
        <div className="space-y-6">
          <Textarea className="min-h-[150px]" placeholder="Describe the issue in detail..." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="outline" className="aspect-square h-auto flex-col rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-700">
              <Camera className="h-5 w-5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase text-slate-400">Add Photo</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

