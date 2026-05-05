import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../auth/store/useAuth';
import {
    apiGetOfferApplications,
    apiUpdateApplicationStatus,
    Application,
} from '../../api/jobfinder.api';
import { logout } from '../../../auth/store/authSlice';
import NotificationBell from '../../components/NotificationBell';

type FilterTab = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending'  },
    ACCEPTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Accepted' },
    REJECTED: { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',    label: 'Rejected' },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const c = statusConfig[status] ?? { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400', label: status };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const SkeletonRow = () => (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
        <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded w-1/3" />
            <div className="h-2.5 bg-gray-50 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="flex gap-2">
            <div className="h-8 bg-gray-100 rounded-xl w-20" />
            <div className="h-8 bg-gray-100 rounded-xl w-20" />
        </div>
    </div>
);

const CompanyOfferApplicationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterTab>('ALL');
    const [updating, setUpdating] = useState<number | null>(null);
    const [expandedCover, setExpandedCover] = useState<number | null>(null);

    const offerId = Number(id);

    useEffect(() => {
        if (!offerId) return;
        setLoading(true);
        apiGetOfferApplications(offerId)
            .then(res => setApplications(res.data.data))
            .catch(() => setError('Failed to load applications.'))
            .finally(() => setLoading(false));
    }, [offerId]);

    const handleUpdateStatus = async (appId: number, status: 'ACCEPTED' | 'REJECTED') => {
        setUpdating(appId);
        try {
            await apiUpdateApplicationStatus(appId, status);
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        } catch {
            // silent
        } finally {
            setUpdating(null);
        }
    };

    const buildCvUrl = (url: string | null) => url ? `http://localhost${url}` : null;

    const filtered  = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);
    const total     = applications.length;
    const pending   = applications.filter(a => a.status === 'PENDING').length;
    const accepted  = applications.filter(a => a.status === 'ACCEPTED').length;
    const rejected  = applications.filter(a => a.status === 'REJECTED').length;

    const navItems = [
        {
            label: 'My Offers',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            path: '/jobfinder/company', active: false,
        },
        {
            label: 'Post New Offer',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
            path: '/jobfinder/company/offers/new', active: false,
        },
        {
            label: 'Applications',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>,
            path: '/jobfinder/company', active: true,
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
                        <NotificationBell />
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white shadow-lg shadow-indigo-100/60">
                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                                {user?.username?.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="text-gray-700 font-bold text-xs max-w-[100px] truncate">{user?.username}</span>
                            <button onClick={() => logout()} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                </svg>
                            </button>
                        </div>
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1">Dashboard</p>
                    {navItems.map(item => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                                item.active
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-white/80 bg-white/50'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    {/* Stats card */}
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

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                            <button onClick={() => navigate('/jobfinder/company')} className="hover:text-indigo-600 transition-colors font-medium">My Offers</button>
                            <span>›</span>
                            <span className="text-gray-500 font-medium">Offer #{offerId}</span>
                            <span>›</span>
                            <span className="text-gray-700 font-bold">Applicants</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-gray-950 tracking-tight">Applicants</h1>
                                <p className="text-sm text-gray-400 mt-0.5">{total} applicant{total !== 1 ? 's' : ''} for this offer</p>
                            </div>
                            <button
                                onClick={() => navigate('/jobfinder/company')}
                                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        </div>
                    </motion.div>

                    {/* Stat cards */}
                    {!loading && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="grid grid-cols-4 gap-4"
                        >
                            {[
                                { label: 'Total',    value: total,    color: 'from-indigo-600 to-violet-600', shadow: 'shadow-indigo-200' },
                                { label: 'Pending',  value: pending,  color: 'from-amber-400 to-orange-400',  shadow: 'shadow-amber-200'  },
                                { label: 'Accepted', value: accepted, color: 'from-emerald-500 to-teal-500',  shadow: 'shadow-emerald-200'},
                                { label: 'Rejected', value: rejected, color: 'from-rose-500 to-red-500',      shadow: 'shadow-rose-200'   },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                    className={`bg-gradient-to-br ${s.color} rounded-3xl p-5 shadow-lg ${s.shadow}`}
                                >
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">{s.label}</p>
                                    <p className="text-4xl font-black text-white">{s.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Filter tabs */}
                    {!loading && !error && applications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-2"
                        >
                            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as FilterTab[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                                        filter === f
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'bg-white/80 text-gray-500 hover:text-indigo-600 hover:bg-white'
                                    }`}
                                >
                                    {f === 'ALL' ? `All (${total})` : f === 'PENDING' ? `Pending (${pending})` : f === 'ACCEPTED' ? `Accepted (${accepted})` : `Rejected (${rejected})`}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Table card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden flex-1"
                    >
                        {loading ? (
                            <div className="flex flex-col">
                                {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-700">{error}</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5">
                                    <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black text-gray-950 mb-2">No applicants yet</h3>
                                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                                    {filter === 'ALL' ? 'No one has applied to this offer yet.' : `No ${filter.toLowerCase()} applicants.`}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table header */}
                                <div className="grid grid-cols-[1fr_160px_100px_110px_80px_80px_140px] gap-3 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                    {['Applicant', 'Email', 'Applied', 'Status', 'Cover', 'CV', 'Actions'].map(h => (
                                        <p key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {filtered.map((app, i) => {
                                        const isUpdating = updating === app.id;
                                        const isPending  = app.status === 'PENDING';
                                        const cv = buildCvUrl(app.cvUrl);

                                        return (
                                            <motion.div key={app.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ delay: i * 0.04 }}
                                                        className="grid grid-cols-[1fr_160px_100px_110px_80px_80px_140px] gap-3 items-center px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors last:border-0"
                                            >
                                                {/* Applicant */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md shadow-indigo-200">
                                                        {app.firstName?.slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-950 truncate">{app.firstName} {app.lastName}</p>
                                                        {app.phone && <p className="text-[10px] text-gray-400">{app.phone}</p>}
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <p className="text-xs text-gray-500 truncate">{app.email}</p>

                                                {/* Applied date */}
                                                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                    {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>

                                                {/* Status */}
                                                <StatusBadge status={app.status} />

                                                {/* Cover letter */}
                                                <div className="flex justify-center">
                                                    {app.coverLetter ? (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setExpandedCover(expandedCover === app.id ? null : app.id)}
                                                                className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-500 transition-all"
                                                                title="View cover letter"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-200 text-sm">—</span>
                                                    )}
                                                </div>

                                                {/* CV */}
                                                <div className="flex justify-center">
                                                    {cv ? (
                                                        <a href={cv} target="_blank" rel="noreferrer" download
                                                           className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-all"
                                                           title="Download CV"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-200 text-sm">—</span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1.5">
                                                    {isPending ? (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                disabled={isUpdating}
                                                                onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                                                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-2 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                {isUpdating ? (
                                                                    <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                                Accept
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                disabled={isUpdating}
                                                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                                className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-2 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Reject
                                                            </motion.button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 font-medium">No action</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Cover letter expanded panel */}
                                <AnimatePresence>
                                    {expandedCover !== null && (() => {
                                        const app = applications.find(a => a.id === expandedCover);
                                        if (!app?.coverLetter) return null;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t border-indigo-100 bg-indigo-50/50 px-6 py-5"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <p className="text-xs font-black text-indigo-700 uppercase tracking-widest">
                                                        Cover Letter — {app.firstName} {app.lastName}
                                                    </p>
                                                    <button onClick={() => setExpandedCover(null)}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line max-w-3xl">
                                                    {app.coverLetter}
                                                </p>
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>

                                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
                                    <p className="text-xs text-gray-400">
                                        Showing <span className="font-bold text-gray-600">{filtered.length}</span> of <span className="font-bold text-gray-600">{total}</span> applicants
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

export default CompanyOfferApplicationsPage;