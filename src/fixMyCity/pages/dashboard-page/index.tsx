import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sidebar, TopAppBar } from '../../components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ensureFixMyCityUser,
  listCurrentUserReports,
  listReports,
  type CivilReport,
} from '@/lib/api/fixmycity.api';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState<CivilReport[]>([]);
  const [myReports, setMyReports] = useState<CivilReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await ensureFixMyCityUser();
        const [all, mine] = await Promise.all([listReports(1, 100), listCurrentUserReports()]);
        setAllReports(all.items);
        setMyReports(mine);
      } catch {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(() => {
    const inProgress = allReports.filter((report) => report.status === 'IN_PROGRESS').length;
    const resolved = allReports.filter((report) => report.status === 'RESOLVED').length;

    return {
      total: allReports.length,
      myTotal: myReports.length,
      inProgress,
      resolved,
    };
  }, [allReports, myReports]);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 space-y-8 p-6 md:p-10">
          <section className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Total reports</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">My reports</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.myTotal}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">In progress</p>
                <p className="text-2xl font-bold text-amber-700">{loading ? '-' : stats.inProgress}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Resolved</p>
                <p className="text-2xl font-bold text-emerald-700">{loading ? '-' : stats.resolved}</p>
              </CardContent>
            </Card>
          </section>

          {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Recent civic reports</h2>
              <Button variant="outline" onClick={() => navigate('/fixmycity/tracking')}>
                View my tracking
              </Button>
            </div>

            <div className="space-y-3">
              {allReports.slice(0, 6).map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer border border-slate-200"
                  onClick={() => navigate(`/fixmycity/issue/${report.id}`)}
                >
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{report.title}</p>
                      <Badge variant={report.status === 'RESOLVED' ? 'secondary' : 'warning'}>{report.status}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600">{report.description}</p>
                    <p className="text-xs text-slate-500">
                      {report.addressText || 'No address provided'} - {formatDate(report.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {!loading && allReports.length === 0 && <p className="text-sm text-slate-500">No reports available yet.</p>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
