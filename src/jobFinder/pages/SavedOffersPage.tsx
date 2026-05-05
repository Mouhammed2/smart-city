import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../auth/store/useAuth';
import { apiGetSavedOffers, apiUnsaveOffer } from '../api/jobfinder.api';
import { logout } from '../../auth/store/authSlice';
import NotificationBell from '../components/NotificationBell';

interface SavedOffer {
    id: number;
    offerId: number;
    offerTitle: string;
    offerCity: string;
    contractType: string;
    salary: string | null;
    status: string;
    savedAt: string;
}

const contractColors: Record<string, { bg: string; text: string; dot: string }> = {
    CDI:         { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CDD:         { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    Freelance:   { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
    Internship:  { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500'     },
    'Part-time': { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
    'Full-time': { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500'    },
};

const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Remove Toast ───────────────────────────────────────────────
const RemoveToast: React.FC<{ title: string; onDone: () => void }> = ({ title, onDone }) => {
    const [progress, setProgress] = useState(100);
    useEffect(() => {
        const interval = setInterval(() => setProgress(p => Math.max(0, p - 3.33)), 100);
        const timer = setTimeout(onDone, 3000);
        return () => { clearInterval(interval); clearTimeout(timer); };
    }, [onDone]);

    return createPortal(
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-[99999] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white px-6 py-4 w-72"
        >
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-950 mb-0.5">Offer removed</p>
                    <p className="text-xs text-gray-400 truncate">"{title}" was unsaved</p>
                </div>
            </div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                            style={{ width: `${progress}%` }} transition={{ duration: 0.1, ease: 'linear' }} />
            </div>
        </motion.div>,
        document.body
    );
};

// ── Skeleton ───────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
        <div className="w-10 h-10 bg-gray-100 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded w-1/3" />
            <div className="h-2.5 bg-gray-50 rounded w-1/4" />
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-16" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="flex gap-2">
            <div className="h-8 bg-gray-100 rounded-xl w-20" />
            <div className="h-8 bg-gray-100 rounded-xl w-20" />
        </div>
    </div>
);

// ── Main ───────────────────────────────────────────────────────
const SavedOffersPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<number | null>(null);
    const [toast, setToast] = useState<{ title: string } | null>(null);

    useEffect(() => {
        apiGetSavedOffers()
            .then(res => setSavedOffers(res.data.data))
            .catch(() => setSavedOffers([]))
            .finally(() => setLoading(false));
    }, []);

    const handleUnsave = async (offerId: number, savedId: number, title: string) => {
        setRemoving(savedId);
        try {
            await apiUnsaveOffer(offerId);
            setSavedOffers(prev => prev.filter(s => s.id !== savedId));
            setToast({ title });
        } catch {
            // silently fail
        } finally {
            setRemoving(null);
        }
    };

    const navItems = [
        {
            label: 'My Applications',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
            path: '/jobfinder/applications',
            active: false,
        },
        {
            label: 'Browse Jobs',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            path: '/jobfinder',
            active: false,
        },
        {
            label: 'Saved Offers',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
            path: '/jobfinder/saved-offers',
            active: true,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950 flex flex-col">

            {/* Remove toast */}
            <AnimatePresence>
                {toast && <RemoveToast title={toast.title} onDone={() => setToast(null)} />}
            </AnimatePresence>

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
                        <button
                            key={item.path}
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

                    {/* Count card */}
                    <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Saved</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-950">{savedOffers.length}</p>
                                <p className="text-[10px] text-gray-400 font-medium">bookmarked</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Main ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Saved Offers</h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {savedOffers.length > 0
                                    ? `${savedOffers.length} offer${savedOffers.length > 1 ? 's' : ''} bookmarked`
                                    : 'Your bookmarked job offers'}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/jobfinder')}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Jobs
                        </button>
                    </motion.div>

                    {/* Table card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden flex-1"
                    >
                        {loading ? (
                            <div className="flex flex-col">
                                {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
                            </div>
                        ) : savedOffers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
                                    <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black text-gray-950 mb-2">No saved offers yet</h3>
                                <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
                                    Browse job offers and click "Save Job" to bookmark them for later.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
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
                                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                    {['Position', 'Location', 'Salary', 'Saved', 'Actions'].map(h => (
                                        <p key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>

                                {/* Rows */}
                                <AnimatePresence>
                                    {savedOffers.map((saved, i) => {
                                        const cc = contractColors[saved.contractType];
                                        return (
                                            <motion.div
                                                key={saved.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors duration-150 last:border-0"
                                            >
                                                {/* Title + contract */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-indigo-200">
                                                        {saved.offerTitle.slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-950 truncate">{saved.offerTitle}</p>
                                                        {cc && (
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cc.bg} ${cc.text}`}>
                                                                {saved.contractType}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* City */}
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                                                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {saved.offerCity}
                                                </div>

                                                {/* Salary */}
                                                <p className={`text-xs font-bold whitespace-nowrap ${saved.salary ? 'text-emerald-700' : 'text-gray-300'}`}>
                                                    {saved.salary ?? '—'}
                                                </p>

                                                {/* Saved at */}
                                                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                    {timeAgo(saved.savedAt)}
                                                </p>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => navigate(`/jobfinder/offers/${saved.offerId}`)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                                    >
                                                        View
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleUnsave(saved.offerId, saved.id, saved.offerTitle)}
                                                        disabled={removing === saved.id}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 border border-gray-100 hover:border-rose-200 px-3 py-2 rounded-xl transition-all whitespace-nowrap disabled:opacity-50"
                                                    >
                                                        {removing === saved.id ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                                                        ) : (
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                        Remove
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Footer */}
                                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
                                    <p className="text-xs text-gray-400">
                                        Showing <span className="font-bold text-gray-600">{savedOffers.length}</span> saved {savedOffers.length === 1 ? 'offer' : 'offers'}
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

export default SavedOffersPage;