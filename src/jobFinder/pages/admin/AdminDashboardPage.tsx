import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../auth/store/useAuth';
import { apiGetPendingOffers, apiModerateOffer, apiAdminGetAllOffers, Offer } from '../../api/jobfinder.api';
import { logout } from '../../../auth/store/authSlice';
import NotificationBell from '../../components/NotificationBell';
import UserMenu from "../../components/UserMenu";


type SidebarItem = 'pending' | 'all';

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending'  },
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
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

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<SidebarItem>('pending');
    const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);
    const [allOffers, setAllOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            apiGetPendingOffers(1, 50),
            apiAdminGetAllOffers(1, 50),
        ])
            .then(([pendingRes, allRes]) => {
                setPendingOffers(pendingRes.data.data);
                setAllOffers(allRes.data.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleModerate = async (offerId: number, status: 'APPROVED' | 'REJECTED') => {
        setUpdating(offerId);
        try {
            await apiModerateOffer(offerId, status);
            setPendingOffers(prev => prev.filter(o => o.id !== offerId));
            setAllOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
        } catch {
            // silent
        } finally {
            setUpdating(null);
        }
    };

    const displayedOffers = activeTab === 'pending' ? pendingOffers : allOffers;
    const totalPending    = pendingOffers.length;
    const totalAll        = allOffers.length;
    const totalApproved   = allOffers.filter(o => o.status === 'APPROVED').length;
    const totalRejected   = allOffers.filter(o => o.status === 'REJECTED').length;

    const approvedToday = allOffers.filter(o => {
        const d = new Date(o.createdAt);
        const today = new Date();
        return o.status === 'APPROVED' &&
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950 flex flex-col">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-[10000] bg-white/75 backdrop-blur-2xl border-b border-white/70 shadow-[0_10px_40px_rgba(79,70,229,0.08)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => navigate('/jobfinder')} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-rose-600 via-red-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md shadow-rose-200">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-black text-gray-950 text-lg tracking-tight">JobFinder</span>
                            <span className="ml-2 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Admin</span>
                        </div>
                    </button>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <UserMenu />
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1">Admin Panel</p>

                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                            activeTab === 'pending'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'text-gray-500 hover:text-rose-600 hover:bg-white/80 bg-white/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                        </div>
                        {totalPending > 0 && (
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                                {totalPending}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                            activeTab === 'all'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'text-gray-500 hover:text-rose-600 hover:bg-white/80 bg-white/50'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        All Offers
                    </button>

                    {/* Stats card */}
                    <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Overview</p>
                        {[
                            { label: 'Total',    value: totalAll,      color: 'text-gray-900'    },
                            { label: 'Pending',  value: totalPending,  color: 'text-amber-600'   },
                            { label: 'Approved', value: totalApproved, color: 'text-emerald-600' },
                            { label: 'Rejected', value: totalRejected, color: 'text-rose-600'    },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center justify-between py-2 ${i < 3 ? 'border-b border-gray-50' : ''}`}>
                                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                                <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Admin info */}
                    <div className="mt-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">
                                {user?.username?.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-gray-950 truncate">{user?.username ?? 'Admin'}</p>
                                <p className="text-[10px] text-rose-500 font-bold">Administrator</p>
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
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                                {activeTab === 'pending' ? 'Pending Offers' : 'All Offers'}
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {activeTab === 'pending'
                                    ? 'Review and moderate job offers submitted by companies'
                                    : 'Complete list of all offers in the system'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Stat cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        {[
                            { label: 'Pending Review', value: totalPending,  color: 'from-amber-400 to-orange-400',  shadow: 'shadow-amber-200',  sub: 'Awaiting approval'     },
                            { label: 'Approved Today', value: approvedToday, color: 'from-emerald-500 to-teal-500',  shadow: 'shadow-emerald-200', sub: "Today's approvals"     },
                            { label: 'Total Approved', value: totalApproved, color: 'from-indigo-600 to-violet-600', shadow: 'shadow-indigo-200',  sub: 'All time approvals'    },
                            { label: 'Total Offers',   value: totalAll,      color: 'from-rose-500 to-red-500',      shadow: 'shadow-rose-200',    sub: 'All submissions'       },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.06 }}
                                className={`bg-gradient-to-br ${s.color} rounded-3xl p-5 shadow-lg ${s.shadow}`}
                            >
                                <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-4xl font-black text-white mb-1">{s.value}</p>
                                <p className="text-[10px] text-white/50">{s.sub}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Table card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden flex-1"
                    >
                        {/* Table title */}
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-gray-950">
                                    {activeTab === 'pending' ? 'Offers Awaiting Approval' : 'All Offers'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {displayedOffers.length} {activeTab === 'pending' ? 'pending' : 'total'} offer{displayedOffers.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {['pending', 'all'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as SidebarItem)}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                                            activeTab === tab
                                                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                                                : 'bg-gray-50 text-gray-500 hover:text-rose-600 hover:bg-rose-50'
                                        }`}
                                    >
                                        {tab === 'pending' ? `Pending (${totalPending})` : `All (${totalAll})`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col">
                                {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
                            </div>
                        ) : displayedOffers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-5">
                                    <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black text-gray-950 mb-2">
                                    {activeTab === 'pending' ? 'All caught up!' : 'No offers yet'}
                                </h3>
                                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                                    {activeTab === 'pending' ? 'No offers are waiting for your review.' : 'No offers have been submitted yet.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table header */}
                                <div className={`grid ${activeTab === 'all' ? 'grid-cols-[1fr_120px_120px_110px_110px_120px_160px]' : 'grid-cols-[1fr_120px_120px_110px_110px_160px]'} gap-3 px-6 py-3 border-b border-gray-50 bg-gray-50/50`}>
                                    {['Position', 'Company', 'Location', 'Contract', 'Salary', ...(activeTab === 'all' ? ['Status'] : []), 'Actions'].map(h => (
                                        <p key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {displayedOffers.map((offer, i) => {
                                        const isUpdating = updating === offer.id;
                                        const cc = contractColors[offer.contractType];
                                        return (
                                            <motion.div
                                                key={offer.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className={`grid ${activeTab === 'all' ? 'grid-cols-[1fr_120px_120px_110px_110px_120px_160px]' : 'grid-cols-[1fr_120px_120px_110px_110px_160px]'} gap-3 items-center px-6 py-4 border-b border-gray-50 hover:bg-rose-50/20 transition-colors last:border-0`}
                                            >
                                                {/* Title */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-400 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-rose-200">
                                                        {offer.title.slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-950 truncate">{offer.title}</p>
                                                        <p className="text-[10px] text-gray-400">
                                                            {new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Company ID */}
                                                <p className="text-xs font-mono text-gray-400 truncate">{offer.companyId?.slice(0, 8)}...</p>

                                                {/* City */}
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {offer.city}
                                                </div>

                                                {/* Contract */}
                                                {cc ? (
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cc.bg} ${cc.text} whitespace-nowrap`}>
                                                        {offer.contractType}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">{offer.contractType}</span>
                                                )}

                                                {/* Salary */}
                                                <p className={`text-xs font-bold whitespace-nowrap ${offer.salary ? 'text-emerald-700' : 'text-gray-300'}`}>
                                                    {offer.salary ?? '—'}
                                                </p>

                                                {/* Status — only in all tab */}
                                                {activeTab === 'all' && <StatusBadge status={offer.status} />}

                                                {/* Actions */}
                                                <div className="flex items-center gap-1.5">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigate(`/jobfinder/offers/${offer.id}`)}
                                                        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-indigo-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                                                        title="View"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </motion.button>

                                                    {(activeTab === 'pending' || offer.status === 'PENDING') && (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                disabled={isUpdating}
                                                                onClick={() => handleModerate(offer.id, 'APPROVED')}
                                                                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-2 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                {isUpdating ? (
                                                                    <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                                Approve
                                                            </motion.button>

                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                disabled={isUpdating}
                                                                onClick={() => handleModerate(offer.id, 'REJECTED')}
                                                                className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-2 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Reject
                                                            </motion.button>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
                                    <p className="text-xs text-gray-400">
                                        Showing <span className="font-bold text-gray-600">{displayedOffers.length}</span> {activeTab === 'pending' ? 'pending' : 'total'} offer{displayedOffers.length !== 1 ? 's' : ''}
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

export default AdminDashboardPage;