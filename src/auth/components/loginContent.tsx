import {Link} from "react-router-dom";

export default function LoginContent() {
    return <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
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
}