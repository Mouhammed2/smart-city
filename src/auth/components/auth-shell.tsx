import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AuthShellProps = {
  title: string;
  description: string;
  activeTab: 'login' | 'register';
  children: ReactNode;
};

function tabClass(isActive: boolean) {
  return cn('w-full', isActive && 'bg-blue-700 text-white hover:bg-blue-600');
}

export function AuthShell({ title, description, activeTab, children }: AuthShellProps) {
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;
  const queryRedirect = new URLSearchParams(location.search).get('redirect');
  const fromState = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  const stateRedirect = fromState?.pathname
    ? `${fromState.pathname}${fromState.search ?? ''}${fromState.hash ?? ''}`
    : null;
  const redirect = queryRedirect ?? stateRedirect;
  const loginPath = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';
  const registerPath = redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-700 p-2 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Urbain Flow</span>
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className={tabClass(activeTab === 'login')}>
              <Link to={loginPath} state={{ from }}>Connexion</Link>
            </Button>
            <Button asChild variant="outline" className={tabClass(activeTab === 'register')}>
              <Link to={registerPath} state={{ from }}>Inscription</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
