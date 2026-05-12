import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sidebar, TopAppBar } from '@/components/layout/app-shell';
import {
  ensureFixMyCityUser,
  listCurrentUserReports,
  type CivilReport,
  type ReportStatus,
} from '@/lib/api/fixmycity.api';

const statuses: Array<{ key: 'ALL' | ReportStatus; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'UNDER_REVIEW', label: 'Under review' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'REJECTED', label: 'Rejected' },
];

const formatDate = (value: string) => new Date(value).toLocaleString();

export const TrackingPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<CivilReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<'ALL' | ReportStatus>('ALL');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await ensureFixMyCityUser();
        setReports(await listCurrentUserReports());
      } catch {
        setError('Could not load your reports.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    if (activeStatus === 'ALL') {
      return reports;
    }

    return reports.filter((report) => report.status === activeStatus);
  }, [activeStatus, reports]);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 space-y-6 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">My reports tracking</h1>
            <Button onClick={() => navigate('/fixmycity/new-report')}>New report</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status.key}
                variant={activeStatus === status.key ? 'default' : 'outline'}
                onClick={() => setActiveStatus(status.key)}
              >
                {status.label}
              </Button>
            ))}
          </div>

          {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
          {loading && <p className="text-sm text-slate-500">Loading...</p>}

          <div className="space-y-3">
            {filtered.map((report) => (
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
                  <p className="text-xs text-slate-500">{report.addressText || 'No address'} - {formatDate(report.createdAt)}</p>
                </CardContent>
              </Card>
            ))}

            {!loading && filtered.length === 0 && (
              <p className="text-sm text-slate-500">No reports found for this filter.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
