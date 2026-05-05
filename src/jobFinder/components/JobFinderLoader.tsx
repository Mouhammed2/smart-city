import React, { useEffect, useState } from 'react';

type Role = 'USER' | 'COMPANY' | 'ADMIN';

const config: Record<Role, {
    badge: string;
    badgeBg: string;
    badgeText: string;
    badgeDot: string;
    logoGradient: string;
    title: string;
    subtitle: string;
    titleColor: string;
    subtitleColor: string;
    barFrom: string;
    barVia: string;
    barTo: string;
    barTrack: string;
    dotColor: string;
    bgGradient: string;
    orb1: string;
    orb2: string;
    orb3: string;
    icon: React.ReactNode;
}> = {
    USER: {
        badge: 'Job Seeker',
        badgeBg: 'bg-violet-100',
        badgeText: 'text-violet-700',
        badgeDot: 'bg-violet-600',
        logoGradient: 'from-indigo-600 via-violet-600 to-fuchsia-500',
        title: 'JobFinder',
        subtitle: 'Finding your dream opportunity...',
        titleColor: 'text-indigo-950',
        subtitleColor: 'text-violet-600',
        barFrom: 'from-indigo-600',
        barVia: 'via-violet-600',
        barTo: 'to-fuchsia-500',
        barTrack: 'bg-violet-200',
        dotColor: 'bg-violet-600',
        bgGradient: 'from-indigo-50 via-violet-50 to-fuchsia-50',
        orb1: 'bg-indigo-300',
        orb2: 'bg-violet-300',
        orb3: 'bg-fuchsia-200',
        icon: (
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
        ),
    },
    COMPANY: {
        badge: 'Recruiter Portal',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        badgeDot: 'bg-emerald-500',
        logoGradient: 'from-emerald-600 via-teal-500 to-cyan-400',
        title: 'JobFinder',
        subtitle: 'Loading your recruiter dashboard...',
        titleColor: 'text-emerald-950',
        subtitleColor: 'text-emerald-600',
        barFrom: 'from-emerald-600',
        barVia: 'via-teal-500',
        barTo: 'to-cyan-400',
        barTrack: 'bg-emerald-200',
        dotColor: 'bg-emerald-500',
        bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
        orb1: 'bg-emerald-300',
        orb2: 'bg-teal-300',
        orb3: 'bg-cyan-200',
        icon: (
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
        ),
    },
    ADMIN: {
        badge: 'Admin Access',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-700',
        badgeDot: 'bg-rose-500',
        logoGradient: 'from-rose-600 via-red-500 to-orange-400',
        title: 'JobFinder',
        subtitle: 'Initializing control center...',
        titleColor: 'text-rose-950',
        subtitleColor: 'text-rose-600',
        barFrom: 'from-rose-600',
        barVia: 'via-red-500',
        barTo: 'to-orange-400',
        barTrack: 'bg-rose-200',
        dotColor: 'bg-rose-500',
        bgGradient: 'from-rose-50 via-red-50 to-orange-50',
        orb1: 'bg-rose-300',
        orb2: 'bg-red-300',
        orb3: 'bg-orange-200',
        icon: (
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
        ),
    },
};

const getRole = (): Role => {
    const token = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');
    if (!token) return 'USER';
    try {
        return (JSON.parse(atob(token.split('.')[1])).role as Role) ?? 'USER';
    } catch {
        return 'USER';
    }
};

const JobFinderLoader: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {    const role = getRole();
    const c = config[role];
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);

                    // wait a little for smooth UX
                    setTimeout(() => {
                        onFinish?.();
                    }, 500);
                    return 100;
                }
                return p + Math.random() * 18;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [onFinish]);
    return (
        <div className={`min-h-screen bg-gradient-to-br ${c.bgGradient} flex items-center justify-center relative overflow-hidden`}>

            {/* Orbs */}
            <div className={`absolute -top-32 -right-20 w-[500px] h-[500px] ${c.orb1} rounded-full blur-3xl opacity-50 animate-[orb1_6s_ease-in-out_infinite]`} />
            <div className={`absolute -bottom-20 -left-20 w-[400px] h-[400px] ${c.orb2} rounded-full blur-3xl opacity-40 animate-[orb2_7s_ease-in-out_infinite]`} />
            <div className={`absolute bottom-20 right-40 w-[300px] h-[300px] ${c.orb3} rounded-full blur-3xl opacity-35 animate-[orb3_8s_ease-in-out_infinite]`} />

            <div className="relative z-10 flex flex-col items-center text-center px-6 animate-[fadeUp_0.5s_ease_forwards]">

                {/* Badge */}
                <div className={`inline-flex items-center gap-2 ${c.badgeBg} ${c.badgeText} text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider`}>
                    <span className={`w-1.5 h-1.5 ${c.badgeDot} rounded-full animate-pulse`} />
                    {c.badge}
                </div>

                {/* Logo */}
                <div className={`w-20 h-20 bg-gradient-to-br ${c.logoGradient} rounded-3xl flex items-center justify-center mb-5 shadow-2xl`}>
                    {c.icon}
                </div>

                {/* Title */}
                <h1 className={`text-4xl font-black ${c.titleColor} tracking-tight mb-2`}>
                    {c.title}
                    {role !== 'USER' && (
                        <span className="ml-3 text-lg font-medium opacity-50">
                            {role === 'COMPANY' ? 'for Companies' : 'Admin Panel'}
                        </span>
                    )}
                </h1>

                {/* Subtitle */}
                <p className={`text-sm font-medium ${c.subtitleColor} mb-8`}>{c.subtitle}</p>

                {/* Progress bar */}
                <div className={`w-56 h-1 ${c.barTrack} rounded-full overflow-hidden mb-5`}>
                    <div
                        className={`h-full bg-gradient-to-r ${c.barFrom} ${c.barVia} ${c.barTo} rounded-full transition-all duration-300 ease-out`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {/* Dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 ${c.dotColor} rounded-full animate-pulse`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes orb1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-15px); } }
                @keyframes orb2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,20px); } }
                @keyframes orb3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(10px,18px); } }
            `}</style>
        </div>
    );
};

export default JobFinderLoader;