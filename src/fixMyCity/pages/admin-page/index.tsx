import { useEffect, useMemo, useState } from 'react';

import { Sidebar, TopAppBar } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  changeReportStatus,
  ensureFixMyCityUser,
  listReports,
  type CivilReport,
  type ReportStatus,
  updateUserRestrictions,
} from '@/lib/api/fixmycity.api';

const statuses: ReportStatus[] = ['IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'];

type RestrictionDraft = {
  canReport: boolean;
  canComment: boolean;
};

export const AdminPage = () => {
  const [reports, setReports] = useState<CivilReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, ReportStatus>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [restrictionDrafts, setRestrictionDrafts] = useState<Record<string, RestrictionDraft>>({});

  const userIds = useMemo(() => Array.from(new Set<string>(reports.map((report) => report.userId))), [reports]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      await ensureFixMyCityUser();
      const result = await listReports(1, 100);
      setReports(result.items);
    } catch {
      setError('Unable to load FixMyCity admin data. Verify backend and gateway headers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const onUpdateStatus = async (reportId: string) => {
    const status = statusDrafts[reportId];

    if (!status) {
      return;
    }

    await changeReportStatus(reportId, { status, comment: commentDrafts[reportId] || undefined });
    await loadReports();
  };

  const onUpdateRestrictions = async (userId: string) => {
    const draft = restrictionDrafts[userId] || { canReport: true, canComment: true };
    await updateUserRestrictions(userId, draft);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar title="Fix My City Admin" />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 space-y-8 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Administration</h1>
            <Button onClick={() => void loadReports()} disabled={loading}>
              Refresh
            </Button>
          </div>

          {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Reports moderation</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Loading reports...</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold text-slate-900">{report.title}</p>
                      <p className="text-xs text-slate-500">{report.userId}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <select
                          className="h-10 rounded-md border border-slate-300 px-2 text-sm"
                          value={statusDrafts[report.id] || report.status}
                          onChange={(event) => {
                            setStatusDrafts((prev) => ({ ...prev, [report.id]: event.target.value as ReportStatus }));
                          }}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Input
                          placeholder="Optional admin comment"
                          value={commentDrafts[report.id] || ''}
                          onChange={(event) => {
                            setCommentDrafts((prev) => ({ ...prev, [report.id]: event.target.value }));
                          }}
                        />
                        <Button onClick={() => void onUpdateStatus(report.id)}>Apply status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-slate-900">User restrictions</h2>
              <p className="text-sm text-slate-500">Manage user ability to create reports and comments.</p>
              <div className="space-y-3">
                {userIds.map((userId) => {
                  const draft = restrictionDrafts[userId] || { canReport: true, canComment: true };

                  return (
                    <div key={userId} className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 p-4">
                      <span className="min-w-[200px] text-sm font-medium text-slate-800">{userId}</span>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.canReport}
                          onChange={(event) => {
                            setRestrictionDrafts((prev) => ({
                              ...prev,
                              [userId]: { ...draft, canReport: event.target.checked },
                            }));
                          }}
                        />
                        Can report
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.canComment}
                          onChange={(event) => {
                            setRestrictionDrafts((prev) => ({
                              ...prev,
                              [userId]: { ...draft, canComment: event.target.checked },
                            }));
                          }}
                        />
                        Can comment
                      </label>
                      <Button variant="outline" onClick={() => void onUpdateRestrictions(userId)}>
                        Save restrictions
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

