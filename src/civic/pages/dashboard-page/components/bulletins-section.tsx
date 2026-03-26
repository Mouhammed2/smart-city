import { ChevronRight, Headset, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardBulletinsSection = () => {
  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">City Bulletins</h2>
      <Card className="border-l-4 border-l-blue-700">
        <CardContent className="p-4">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-700">Public Safety</span>
          <h4 className="mb-1 font-bold text-slate-900">Water Main Maintenance</h4>
          <p className="mb-3 text-xs text-slate-600">Expected disruption in Central Park area this Sunday.</p>
          <Button variant="link" className="h-auto p-0 text-xs font-bold text-blue-700" type="button">
            Details <ChevronRight className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-blue-700 text-white">
        <CardContent className="p-6">
          <h4 className="mb-2 text-lg font-bold">Need Immediate Help?</h4>
          <p className="mb-6 text-xs text-blue-100">For emergencies requiring immediate attention, please use direct hotlines.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="ghost" className="h-auto flex-col rounded-lg bg-white/10 py-3 text-white hover:bg-white/20">
              <Phone className="mb-1 h-4 w-4" />
              <span className="text-[10px] font-bold">City Hall</span>
            </Button>
            <Button variant="ghost" className="h-auto flex-col rounded-lg bg-white/10 py-3 text-white hover:bg-white/20">
              <Headset className="mb-1 h-4 w-4" />
              <span className="text-[10px] font-bold">24/7 Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

