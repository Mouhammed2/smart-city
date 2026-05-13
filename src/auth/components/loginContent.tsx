import { Link } from "react-router-dom";

export default function LoginContent() {
  return (
    <section className="rounded-2xl bg-[#0A1628]/80 backdrop-blur-sm border border-slate-800/50 p-8 shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">
        Smart City Platform
      </h1>
      <p className="mt-3 text-slate-400">
        Accedez a BusWay, FixMyCity et JobFinder depuis un seul portail.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/login"
          className="rounded-md bg-gradient-to-r from-[#00D4FF] to-[#6366F1] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#00D4FF]/20"
        >
          Se connecter
        </Link>
        <Link
          to="/register"
          className="rounded-md border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all"
        >
          Creer un compte
        </Link>
      </div>
    </section>
  );
}
