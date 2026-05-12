import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ensureFixMyCityUser,
  getReportById,
  listStatusHistory,
  type CivilReport,
  type ReportStatusHistory,
} from '@/lib/api/fixmycity.api';
import { Sidebar, TopAppBar } from '@/components/layout/app-shell';

const formatDate = (value: string) => new Date(value).toLocaleString();

export const IssueDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<CivilReport | null>(null);
  const [history, setHistory] = useState<ReportStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Missing report id.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await ensureFixMyCityUser();
        const reportData = await getReportById(id);
        setReport(reportData);

        try {
          const statusHistory = await listStatusHistory(id);
          setHistory(statusHistory);
        } catch {
          setHistory([]);
        }
      } catch {
        setError('Could not load this report.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar showBack />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 space-y-6 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Issue detail</h1>
            <Button variant="outline" onClick={() => navigate('/fixmycity/tracking')}>
              Back to tracking
            </Button>
          </div>

          {loading && <p className="text-sm text-slate-500">Loading report...</p>}
          {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}

          {report && (
            <>
              <Card>
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-slate-900">{report.title}</h2>
                    <Badge variant={report.status === 'RESOLVED' ? 'secondary' : 'warning'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{report.description}</p>
                  <div className="grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                    <p>Address: {report.addressText || 'Not provided'}</p>
                    <p>
                      Coordinates: {report.latitude}, {report.longitude}
                    </p>
                    <p>Created at: {formatDate(report.createdAt)}</p>
                    <p>Reporter ID: {report.userId}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Status history</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-500">No status history yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((entry) => (
                        <div key={entry.id} className="rounded-md border border-slate-200 p-3">
                          <p className="text-sm font-medium text-slate-900">Status set to {entry.status}</p>
                          <p className="text-xs text-slate-500">{formatDate(entry.changedAt)} by {entry.changedByUserId}</p>
                          {entry.comment && <p className="mt-1 text-sm text-slate-700">{entry.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

