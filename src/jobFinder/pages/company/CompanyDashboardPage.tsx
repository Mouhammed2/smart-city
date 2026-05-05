import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../auth/store/useAuth';
import { apiGetCompanyOffers, apiDeleteOffer } from '../../api/jobfinder.api';
import { logout } from '../../../auth/store/authSlice';
import NotificationBell from '../../components/NotificationBell';
import UserMenu from '../../components/UserMenu';

interface Offer {
    id: number;
    title: string;
    city: string;
    contractType: string;
    salary: string | null;
    status: string;
    createdAt: string;
}

type FilterType = 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED';
type ViewType   = 'offers' | 'applications';

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Under Review' },
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved'     },
    REJECTED: { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',    label: 'Rejected'     },
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

// ── Confirm Modal ──────────────────────────────────────────────
const ConfirmModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ title, message, onConfirm, onCancel }) => createPortal(
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-white p-8 max-w-sm w-full mx-4 text-center"
        >
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            <h3 className="text-lg font-black text-gray-950 mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-7 leading-relaxed">{message}</p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-sm transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-rose-200 transition-all hover:shadow-rose-300"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    </motion.div>,
    document.body
);

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
            <div className="h-8 bg-gray-100 rounded-xl w-8" />
            <div className="h-8 bg-gray-100 rounded-xl w-8" />
            <div className="h-8 bg-gray-100 rounded-xl w-8" />
        </div>
    </div>
);

// ── Main ───────────────────────────────────────────────────────
const CompanyDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [view, setView] = useState<ViewType>('offers');
    const [confirmDelete, setConfirmDelete] = useState<Offer | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        apiGetCompanyOffers()
            .then(res => setOffers(res.data.data))
            .catch(() => setOffers([]))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (offer: Offer) => {
        setConfirmDelete(offer);
    };

    const confirmDeleteOffer = async () => {
        if (!confirmDelete) return;
        setDeleting(confirmDelete.id);
        setConfirmDelete(null);
        try {
            await apiDeleteOffer(confirmDelete.id);
            setOffers(prev => prev.filter(o => o.id !== confirmDelete.id));
        } catch {
            // silently fail
        } finally {
            setDeleting(null);
        }
    };

    const filtered  = filter === 'ALL' ? offers : offers.filter(o => o.status === filter);
    const total     = offers.length;
    const pending   = offers.filter(o => o.status === 'PENDING').length;
    const approved  = offers.filter(o => o.status === 'APPROVED').length;
    const rejected  = offers.filter(o => o.status === 'REJECTED').length;
    const approvedOffers = offers.filter(o => o.status === 'APPROVED');

    const navItems = [
        {
            label: 'My Offers',
            view: 'offers' as ViewType,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        },
        {
            label: 'Applications',
            view: 'applications' as ViewType,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950 flex flex-col">

            {/* Confirm modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <ConfirmModal
                        title="Delete this offer?"
                        message={`"${confirmDelete.title}" will be permanently deleted and cannot be recovered.`}
                        onConfirm={confirmDeleteOffer}
                        onCancel={() => setConfirmDelete(null)}
                    />
                )}
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1">Dashboard</p>

                    {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                                view === item.view
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-white/80 bg-white/50'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    <button
                        onClick={() => navigate('/jobfinder/company/offers/new')}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 mt-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post New Offer
                    </button>

                    {/* Stats card */}
                    <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Stats</p>
                        {[
                            { label: 'Total',    value: total,    color: 'text-gray-900'    },
                            { label: 'Pending',  value: pending,  color: 'text-amber-600'   },
                            { label: 'Approved', value: approved, color: 'text-emerald-600' },
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
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                                {view === 'offers' ? 'My Offers' : 'Applications Received'}
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {view === 'offers' ? 'Manage your job postings' : 'Select an approved offer to view applicants'}
                            </p>
                        </div>
                        {view === 'offers' && (
                            <button
                                onClick={() => navigate('/jobfinder/company/offers/new')}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Post New Offer
                            </button>
                        )}
                    </motion.div>

                    {/* Stat cards — only on offers view */}
                    {view === 'offers' && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="grid grid-cols-4 gap-4"
                        >
                            {[
                                { label: 'Total',    value: total,    color: 'from-indigo-600 to-violet-600', shadow: 'shadow-indigo-200' },
                                { label: 'Pending',  value: pending,  color: 'from-amber-400 to-orange-400',  shadow: 'shadow-amber-200'  },
                                { label: 'Approved', value: approved, color: 'from-emerald-500 to-teal-500',  shadow: 'shadow-emerald-200'},
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

                    {/* Filter tabs — only on offers view */}
                    {view === 'offers' && !loading && offers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-2"
                        >
                            {(['ALL', 'APPROVED', 'PENDING', 'REJECTED'] as FilterType[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                                        filter === f
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'bg-white/80 text-gray-500 hover:text-indigo-600 hover:bg-white'
                                    }`}
                                >
                                    {f === 'ALL' ? `All (${total})` : f === 'PENDING' ? `Pending (${pending})` : f === 'APPROVED' ? `Approved (${approved})` : `Rejected (${rejected})`}
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
                        ) : view === 'offers' ? (
                            <>
                                {filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
                                            <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-950 mb-2">No offers yet</h3>
                                        <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
                                            Post your first job offer and start receiving applications.
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate('/jobfinder/company/offers/new')}
                                            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-lg shadow-indigo-200 flex items-center gap-2 group"
                                        >
                                            Post New Offer
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Table header */}
                                        <div className="grid grid-cols-[1fr_140px_120px_110px_130px_160px] gap-4 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                            {['Position', 'Location', 'Salary', 'Posted', 'Status', 'Actions'].map(h => (
                                                <p key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {filtered.map((offer, i) => {
                                                const cc = contractColors[offer.contractType];
                                                return (
                                                    <motion.div
                                                        key={offer.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ delay: i * 0.04 }}
                                                        className="grid grid-cols-[1fr_140px_120px_110px_130px_160px] gap-4 items-center px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors last:border-0"
                                                    >
                                                        {/* Title */}
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-indigo-200">
                                                                {offer.title.slice(0, 1).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-gray-950 truncate">{offer.title}</p>
                                                                {cc && (
                                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cc.bg} ${cc.text}`}>
                                                                        {offer.contractType}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* City */}
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                                                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            {offer.city}
                                                        </div>

                                                        {/* Salary */}
                                                        <p className={`text-xs font-bold whitespace-nowrap ${offer.salary ? 'text-emerald-700' : 'text-gray-300'}`}>
                                                            {offer.salary ?? '—'}
                                                        </p>

                                                        {/* Date */}
                                                        <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                            {new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>

                                                        {/* Status */}
                                                        <StatusBadge status={offer.status} />

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1.5">
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                           onClick={() => navigate(`/jobfinder/offers/${offer.id}`)}
                                                                           className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-indigo-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                                                                           title="View"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </motion.button>

                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                           onClick={() => navigate(`/jobfinder/company/offers/${offer.id}/edit`)}
                                                                           className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-violet-50 flex items-center justify-center text-gray-400 hover:text-violet-600 transition-all"
                                                                           title="Edit"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </motion.button>

                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                           onClick={() => handleDelete(offer)}
                                                                           disabled={deleting === offer.id}
                                                                           className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all disabled:opacity-50"
                                                                           title="Delete"
                                                            >
                                                                {deleting === offer.id ? (
                                                                    <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-rose-500 rounded-full animate-spin" />
                                                                ) : (
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                )}
                                                            </motion.button>

                                                            {offer.status === 'APPROVED' && (
                                                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                                               onClick={() => navigate(`/jobfinder/company/offers/${offer.id}/applications`)}
                                                                               className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                                                    </svg>
                                                                    Applicants
                                                                </motion.button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>

                                        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
                                            <p className="text-xs text-gray-400">
                                                Showing <span className="font-bold text-gray-600">{filtered.length}</span> of <span className="font-bold text-gray-600">{total}</span> offers
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            /* Applications view */
                            <>
                                {approvedOffers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
                                            <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-950 mb-2">No approved offers yet</h3>
                                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                                            Post an offer and wait for admin approval to start receiving applications.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                            {['Position', 'Location', 'Contract', 'Posted', 'Action'].map(h => (
                                                <p key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                            ))}
                                        </div>

                                        {approvedOffers.map((offer, i) => {
                                            const cc = contractColors[offer.contractType];
                                            return (
                                                <motion.div
                                                    key={offer.id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-indigo-200">
                                                            {offer.title.slice(0, 1).toUpperCase()}
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-950 truncate">{offer.title}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        {offer.city}
                                                    </div>
                                                    {cc ? (
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cc.bg} ${cc.text} whitespace-nowrap`}>
                                                            {offer.contractType}
                                                        </span>
                                                    ) : <span className="text-xs text-gray-500">{offer.contractType}</span>}
                                                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                        {new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => navigate(`/jobfinder/company/offers/${offer.id}/applications`)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                                        </svg>
                                                        View Applicants
                                                    </motion.button>
                                                </motion.div>
                                            );
                                        })}
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboardPage;