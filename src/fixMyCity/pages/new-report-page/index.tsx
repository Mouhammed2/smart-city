import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createReport, ensureFixMyCityUser } from '@/lib/api/fixmycity.api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TopAppBar } from '@/components/layout/app-shell';
import { useLocation as useBrowserLocation } from '../../../busway/hooks/useLocation';

export const NewReportPage = () => {
  const navigate = useNavigate();
  const { location: rawLocation, error: locationError, loading: locationLoading } = useBrowserLocation() as any;
  const location = rawLocation as any;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addressText, setAddressText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationStatus = location
    ? 'Current location detected and will be attached to your report.'
    : locationLoading
      ? 'Requesting your current location...'
      : locationError
        ? String(locationError).toLowerCase().includes('denied')
          ? 'Location permission was denied. You can still submit the report without sharing coordinates.'
          : 'Unable to detect your location right now. You can still submit the report without coordinates.'
        : 'We will try to attach your current location automatically.';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await ensureFixMyCityUser();
      const latitude = location?.latitude;
      const longitude = location?.longitude;
      const created = await createReport({
        title: title.trim(),
        description: description.trim(),
        addressText: addressText.trim() || undefined,
        latitude: typeof latitude === 'number' ? latitude : undefined,
        longitude: typeof longitude === 'number' ? longitude : undefined,
      });

      navigate(`/fixmycity/issue/${created.id}`);
    } catch {
      setError('Failed to submit report. Check backend connectivity and your permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopAppBar showBack />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
        <Card>
          <CardContent className="space-y-6 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-slate-900">Create a new civic report</h1>

            <form className="space-y-4" onSubmit={onSubmit}>
              <Input
                placeholder="Report title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <Textarea
                className="min-h-[150px]"
                placeholder="Describe the issue clearly"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
              <Input
                placeholder="Address (optional)"
                value={addressText}
                onChange={(event) => setAddressText(event.target.value)}
              />

              <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-600">
                {locationStatus ?? 'We will try to attach your current location automatically.'}
              </div>

              {error && <p className="rounded-md bg-red-100 p-2 text-sm text-red-700">{error}</p>}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/fixmycity/tracking')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit report'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
