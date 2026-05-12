import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/store/useAuth';
import { apiGetMyApplications } from '../api/jobfinder.api';
import { logout } from '../../auth/store/authSlice';
import NotificationBell from '../components/NotificationBell';
import UserMenu from '../components/UserMenu';

interface Application {
    id: number;
    offerId: number;
    offerTitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    coverLetter: string | null;
    cvUrl: string | null;
    status: string;
    appliedAt: string;
    offerCity: string;
    offerContractType: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending'  },
    ACCEPTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Accepted' },
    REJECTED: { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',    label: 'Rejected' },
};

const contractColors: Record<string, { bg: string; text: string }> = {
    CDI:         { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    CDD:         { bg: 'bg-amber-50',   text: 'text-amber-700'   },
    Freelance:   { bg: 'bg-violet-50',  text: 'text-violet-700'  },
    Internship:  { bg: 'bg-sky-50',     text: 'text-sky-700'     },
    'Part-time': { bg: 'bg-rose-50',    text: 'text-rose-700'    },
    'Full-time': { bg: 'bg-teal-50',    text: 'text-teal-700'    },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const c = statusConfig[status] ?? { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', label: status };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

// ── Timeline ──────────────────────────────────────────────────
const ApplicationTimeline: React.FC<{ app: Application }> = ({ app }) => {
    const steps = [
        {
            key: 'submitted',
            label: 'Application Submitted',
            sub: `Submitted on ${new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            done: true,
            active: false,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            iconBg: 'bg-indigo-600',
            connectorColor: 'bg-indigo-200',
        },
        {
            key: 'review',
            label: 'Under Review',
            sub: app.status === 'PENDING' ? 'The company is reviewing your profile' : 'Your application was reviewed',
            done: app.status !== 'PENDING',
            active: app.status === 'PENDING',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            iconBg: app.status === 'PENDING' ? 'bg-amber-400' : app.status !== 'PENDING' ? 'bg-indigo-600' : 'bg-gray-200',
            connectorColor: app.status !== 'PENDING' ? 'bg-indigo-200' : 'bg-gray-100',
        },
        {
            key: 'decision',
            label: app.status === 'ACCEPTED' ? 'Application Accepted ' : app.status === 'REJECTED' ? 'Application Rejected' : 'Awaiting Decision',
            sub: app.status === 'ACCEPTED'
                ? 'Congratulations! The company accepted your application'
                : app.status === 'REJECTED'
                    ? 'The company decided not to move forward'
                    : 'You will be notified once a decision is made',
            done: app.status === 'ACCEPTED' || app.status === 'REJECTED',
            active: false,
            icon: app.status === 'ACCEPTED' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : app.status === 'REJECTED' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            iconBg: app.status === 'ACCEPTED' ? 'bg-emerald-500' : app.status === 'REJECTED' ? 'bg-rose-500' : 'bg-gray-200',
            connectorColor: null,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
        >
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-50/60 to-violet-50/40 border-t border-indigo-100/50">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Application Timeline</p>

                <div className="flex items-start gap-0">
                    {steps.map((step, i) => (
                        <div key={step.key} className="flex items-start flex-1">
                            {/* Step */}
                            <div className="flex flex-col items-center">
                                {/* Icon circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${step.iconBg} ${
                                        step.active ? 'ring-4 ring-amber-200' : ''
                                    }`}
                                >
                                    {step.active ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : step.done || step.key === 'submitted' ? (
                                        step.icon
                                    ) : (
                                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                                    )}
                                </motion.div>

                                {/* Text below icon */}
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="text-center mt-3 px-1"
                                >
                                    <p className={`text-xs font-black leading-tight ${
                                        step.done || step.key === 'submitted' ? 'text-gray-950' :
                                            step.active ? 'text-amber-700' : 'text-gray-300'
                                    }`}>
                                        {step.label}
                                    </p>
                                    <p className={`text-[10px] mt-0.5 leading-relaxed max-w-[140px] ${
                                        step.done || step.key === 'submitted' ? 'text-gray-400' :
                                            step.active ? 'text-amber-500' : 'text-gray-300'
                                    }`}>
                                        {step.sub}
                                    </p>
                                    {step.active && (
                                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                            In progress
                                        </span>
                                    )}
                                    {step.key === 'decision' && app.status === 'ACCEPTED' && (
                                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            Accepted
                                        </span>
                                    )}
                                    {step.key === 'decision' && app.status === 'REJECTED' && (
                                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                            Rejected
                                        </span>
                                    )}
                                </motion.div>
                            </div>

                            {/* Connector line between steps */}
                            {i < steps.length - 1 && (
                                <div className="flex-1 flex items-center pt-4 px-2">
                                    <div className={`h-0.5 w-full rounded-full ${step.connectorColor ?? 'bg-gray-100'}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Cover letter snippet if exists */}
                {app.coverLetter && (
                    <div className="mt-5 pt-4 border-t border-indigo-100/50">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Cover Letter</p>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">"{app.coverLetter}"</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// ── Skeleton ──────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
        <div className="w-10 h-10 bg-gray-100 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded w-1/3" />
            <div className="h-2.5 bg-gray-50 rounded w-1/4" />
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-16" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="h-8 bg-gray-100 rounded-xl w-24" />
    </div>
);

// ── Main ──────────────────────────────────────────────────────
const MyApplicationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        apiGetMyApplications()
            .then(res => setApplications(res.data.data))
            .catch(() => setApplications([]))
            .finally(() => setLoading(false));
    }, []);

    const total    = applications.length;
    const pending  = applications.filter(a => a.status === 'PENDING').length;
    const accepted = applications.filter(a => a.status === 'ACCEPTED').length;
    const rejected = applications.filter(a => a.status === 'REJECTED').length;
    const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);

    const navItems = [
        {
            label: 'My Applications',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
            path: '/jobfinder/applications', active: true,
        },
        {
            label: 'Browse Jobs',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            path: '/jobfinder', active: false,
        },
        {
            label: 'Saved Offers',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
            path: '/jobfinder/saved-offers', active: false,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950 flex flex-col">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-[10000] bg-white/75 backdrop-blur-2xl border-b border-white/70 shadow-[0_10px_40px_rgba(79,70,229,0.08)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => navigate('/jobfinder')} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-black text-gray-950 text-lg tracking-tight">JobFinder</span>
                    </button>
                    <div className="flex items-center gap-2">
                        {isAuthenticated && (
                            <>
                                <NotificationBell />
                                <UserMenu />
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-7">

                {/* ── Sidebar ── */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-52 shrink-0 flex flex-col gap-2"
                >
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1">Navigation</p>
                    {navItems.map(item => (
                        <button key={item.path} onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                                    item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-indigo-600 hover:bg-white/80 bg-white/50'
                                }`}
                        >
                            {item.icon}{item.label}
                        </button>
                    ))}

                    <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Stats</p>
                        {[
                            { label: 'Total',    value: total,    color: 'text-gray-900'    },
                            { label: 'Pending',  value: pending,  color: 'text-amber-600'   },
                            { label: 'Accepted', value: accepted, color: 'text-emerald-600' },
                            { label: 'Rejected', value: rejected, color: 'text-rose-600'    },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center justify-between py-2 ${i < 3 ? 'border-b border-gray-50' : ''}`}>
                                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                                <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Main ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">My Applications</h1>
                            <p className="text-sm text-gray-400 mt-0.5">Click any row to see the application timeline</p>
                        </div>
                        <button onClick={() => navigate('/jobfinder')}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Jobs
                        </button>
                    </motion.div>

                    {/* Stat cards */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                                className="grid grid-cols-4 gap-4"
                    >
                        {[
                            { label: 'Total',    value: total,    color: 'from-indigo-600 to-violet-600', shadow: 'shadow-indigo-200' },
                            { label: 'Pending',  value: pending,  color: 'from-amber-400 to-orange-400',  shadow: 'shadow-amber-200'  },
                            { label: 'Accepted', value: accepted, color: 'from-emerald-500 to-teal-500',  shadow: 'shadow-emerald-200'},
                            { label: 'Rejected', value: rejected, color: 'from-rose-500 to-red-500',      shadow: 'shadow-rose-200'   },
                        ].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                                        className={`bg-gradient-to-br ${s.color} rounded-3xl p-5 shadow-lg ${s.shadow}`}
                            >
                                <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-4xl font-black text-white">{s.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Filter tabs */}
                    {!loading && applications.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2">
                            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                                            filter === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white/80 text-gray-500 hover:text-indigo-600 hover:bg-white'
                                        }`}
                                >
                                    {f === 'ALL' ? `All (${total})` : f === 'PENDING' ? `Pending (${pending})` : f === 'ACCEPTED' ? `Accepted (${accepted})` : `Rejected (${rejected})`}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Table card */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                                className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden flex-1"
                    >
                        {loading ? (
                            <div className="flex flex-col">{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>
                        ) : applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
                                    <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black text-gray-950 mb-2">No applications yet</h3>
                                <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">You haven't applied to any jobs yet.</p>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                               onClick={() => navigate('/jobfinder')}
                                               className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-lg shadow-indigo-200 flex items-center gap-2 group"
                                >
                                    Browse Jobs
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.button>
                            </div>
                        ) : (
                            <>
                                {/* Table header */}
                                <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                    {['Position', 'Location', 'Applied', 'Status', 'Action', ''].map((h, i) => (
                                        <p key={i} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {filtered.map((app, i) => {
                                        const cc = contractColors[app.offerContractType];
                                        const isExpanded = expandedId === app.id;
                                        return (
                                            <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                                            >
                                                {/* Row */}
                                                <div
                                                    className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-gray-50 transition-colors duration-150 cursor-pointer ${
                                                        isExpanded ? 'bg-indigo-50/40' : 'hover:bg-indigo-50/30'
                                                    }`}
                                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                                >
                                                    {/* Title */}
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-indigo-200">
                                                            {app.offerTitle.slice(0, 1).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-950 truncate">{app.offerTitle}</p>
                                                            {cc && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cc.bg} ${cc.text}`}>{app.offerContractType}</span>}
                                                        </div>
                                                    </div>

                                                    {/* City */}
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        {app.offerCity}
                                                    </div>

                                                    {/* Date */}
                                                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                        {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>

                                                    {/* Status */}
                                                    <StatusBadge status={app.status} />

                                                    {/* View offer */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                        onClick={e => { e.stopPropagation(); navigate(`/jobfinder/offers/${app.offerId}`); }}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                                    >
                                                        View offer
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </motion.button>

                                                    {/* Expand chevron */}
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-gray-400"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </motion.div>
                                                </div>

                                                {/* Timeline panel */}
                                                <AnimatePresence>
                                                    {isExpanded && <ApplicationTimeline app={app} />}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
                                    <p className="text-xs text-gray-400">
                                        Showing <span className="font-bold text-gray-600">{filtered.length}</span> of <span className="font-bold text-gray-600">{total}</span> applications
                                        <span className="ml-2 text-gray-300">· Click a row to expand the timeline</span>
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MyApplicationsPage;