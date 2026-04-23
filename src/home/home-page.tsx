import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Smart City Platform</h1>
          <p className="mt-3 text-slate-600">
            Accedez a BusWay et FixMyCity depuis un seul portail.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Creer un compte
            </Link>
          </div>
        </section>

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

