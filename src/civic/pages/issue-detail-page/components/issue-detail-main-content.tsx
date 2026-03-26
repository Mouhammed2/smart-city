import { Card, CardContent } from "@/components/ui/card";

export function IssueDetailMainContent() {
  return (
    <div className="space-y-6 lg:col-span-8">
      <Card>
        <CardContent className="p-8">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Report Details</h3>
          <p className="mb-6 leading-relaxed text-slate-600">Observed significant oxidation and minor hairline fractures on the primary support strut. Potential risk for long-term structural integrity.</p>
          <div className="grid grid-cols-2 gap-4">
            <img
              className="aspect-video rounded-lg object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBefemK9Ldy8Fd7SV0KApqU3E33avggrCTEpnomu8Qc5IkjfFISiG0il73vKGeN9wXZQAoa009-EnYVHGP5Qdo3MVP3pAX8xTZZ3k8bOcqCuyPYmUJ_fulacItyWK8YY-XLrpAnXPX4QK9NYrdZCS9dqGCnsV9xZHFFJhRGuEp8fE8IoT6irHfigrFwwVIM06v1egq4yNrlVTP-VXuZvMJ0UOjFF7pmbAcqDKUVWbzjkwZQtSTp73iA1xLBoRXuc6CIatkUeMqThss"
              alt="Issue evidence one"
            />
            <img
              className="aspect-video rounded-lg object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH3hWxUT1LW1yrMhipiOswFjPHsYfWCnwXPLhKvE7h4Fp5x527JU563seXi4AxYKWZdUDZy2SFZr8XMCU_Sul91cTM9ujcREx9QEgQfRLAuJ0_68w2eWMdXPVWMpbMbNDyNAHvA_sKpL1Ow4xLDNzaNqNqzguNR16pp3HJl_cfMfsCPbwG8u-_kp0r6P9avIuNSj7GYsrK4wSqSrSzRmcTDdLep-Vbp_pwjBEE4l_yLvQ206HFMEIjXZdC_3_3m7EpDy1Cjcv2KbY"
              alt="Issue evidence two"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-slate-100">
        <CardContent className="p-8">
          <h3 className="mb-8 text-xl font-bold text-slate-900">Activity Timeline</h3>
          <div className="relative ml-4 space-y-10 border-l-2 border-blue-200">
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-700" />
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-bold text-slate-900">Inspection Scheduled</h4>
                <span className="text-xs text-slate-500">2 Hours Ago</span>
              </div>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600">Public Works dispatched a structural engineer. Expected 14:30.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

