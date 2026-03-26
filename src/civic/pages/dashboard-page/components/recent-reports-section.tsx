import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardRecentReportsSectionProps = {
  onOpenIssue: () => void;
};

export const DashboardRecentReportsSection = ({ onOpenIssue }: DashboardRecentReportsSectionProps) => {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Recent Civic Reports</h2>
        <Link to="/civic/tracking" className="text-sm font-bold text-blue-700">
          View All Activity
        </Link>
      </div>

      <Card className="cursor-pointer border-0 transition-shadow hover:shadow-md" onClick={onOpenIssue}>
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Agb6KNY9CFYEDexi0IlpzY8fhrV8ONmV3TZ3cFU662zTHwl-jqeWOA03-dRDHEC0OIjRk6MDgKolbNV68tAiF-EEJen9hnJ8RW702I2HYEG52TSbsoaUiq_o9VwKGj_BfYxS9GzkLFXQo_ILkCDx5CLfUulrdHZsV5Ei9GG6iVKU5eR6wCrNCe7EL9JOD8Vw0yKSTY9ddbcta0QBBJYpjLgUN4AzWS0KItBcb-SWWxih9zOUrHM1EvRK0SyyRyFBCjZ75-Mu1dg"
                  alt="Recent report location"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Structural Pavement Crack</h4>
                <p className="text-sm text-slate-600">5th Avenue and Broadway Intersection</p>
              </div>
            </div>
            <Badge variant="warning">In-Progress</Badge>
          </div>
          <p className="mb-4 text-sm text-slate-600">Significant hazard reported by citizen near the pedestrian crossing.</p>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-[11px] font-medium text-slate-500">14 citizens followed this</span>
            <span className="text-[11px] font-bold text-slate-500">2 Hours Ago</span>
          </div>
        </CardContent>
      </Card>

      <div className="group relative h-64 cursor-pointer overflow-hidden rounded-xl shadow-sm">
        <img
          className="h-full w-full object-cover opacity-50 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw94Hil235z9WWPPZk1PTd2vs-fRpRyQYcTLsXfDPkCPZFfcAs0ztqAm6Fwqyzg6Pge_L99PhlYO8YMWY8z4YoOSpb6PCZGb9PPsiYZq7sMpET3iXz41hr8xb-JHm6rhV6gue0n9pQyWXDtfK6HM8OpceMeufD18ModnCoGE7LKqJq1AWbgNynnKrksn9NV0q2kwgU0WtLHOfIoi5gbKm0ClqqOqGvmduYvZMkI2gYC437UzTUP804YmYBpuKCd5kvZ5CKEaLCriI"
          alt="Interactive city map preview"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-700/10 p-8 text-center backdrop-blur-[2px]">
          <h3 className="mb-2 text-2xl font-bold text-blue-700">Interactive Map</h3>
          <Button variant="outline" className="rounded-xl bg-white font-bold text-blue-700">
            Open Live Map
          </Button>
        </div>
      </div>
    </div>
  );
};

