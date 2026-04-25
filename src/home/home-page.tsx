import { Link } from 'react-router-dom';
import {useAuth} from "../auth";
import LoginContent from "../auth/components/loginContent";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {!isAuthenticated && <LoginContent />  }
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">BusWay</h2>
            <p className="mt-2 text-sm text-slate-600">
              Suivi des routes, arrets, bus et horaires.
            </p>
            <Link to="/busway" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
              Ouvrir BusWay
            </Link>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">FixMyCity</h2>
            <p className="mt-2 text-sm text-slate-600">
              Signaler et suivre les incidents urbains.
            </p>
            <Link to="/fixmycity" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
              Ouvrir FixMyCity
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}

