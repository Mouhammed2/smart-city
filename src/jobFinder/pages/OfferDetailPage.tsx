import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGetOffer, type Offer } from '../api/jobfinder.api';
import { useAuth } from '../../auth/store/useAuth';
import { logout } from '../../auth/store/authSlice';
import SaveJobButton from '../components/SaveJobButton';

const contractColors: Record<string, string> = {
    CDI: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    CDD: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Freelance: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    Internship: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    'Part-time': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    'Full-time': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
};

const contractColorsHero: Record<string, string> = {
    CDI: 'bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/30',
    CDD: 'bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/30',
    Freelance: 'bg-violet-400/20 text-violet-100 ring-1 ring-violet-300/30',
    Internship: 'bg-sky-400/20 text-sky-100 ring-1 ring-sky-300/30',
    'Part-time': 'bg-rose-400/20 text-rose-100 ring-1 ring-rose-300/30',
    'Full-time': 'bg-teal-400/20 text-teal-100 ring-1 ring-teal-300/30',
};

const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Share Modal ────────────────────────────────────────
const ShareModal: React.FC<{ open: boolean; onClose: () => void; offerTitle: string }> = ({ open, onClose, offerTitle }) => {
    const [copied, setCopied] = useState(false);
    const url = window.location.href;
    const text = `Check out this job offer: ${offerTitle}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            label: 'WhatsApp',
            bg: 'bg-[#25D366] hover:bg-[#20bb5a]',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.554 4.1 1.524 5.823L.057 23.927a.5.5 0 00.609.61l6.213-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.378l-.36-.214-3.733.873.908-3.638-.235-.374A9.869 9.869 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
        },
        {
            label: 'LinkedIn',
            bg: 'bg-[#0077B5] hover:bg-[#006399]',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            label: 'Gmail',
            bg: 'bg-[#EA4335] hover:bg-[#d33426]',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
            ),
            href: `mailto:?subject=${encodeURIComponent(`Job Offer: ${offerTitle}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
        },
        {
            label: 'Outlook',
            bg: 'bg-[#0078D4] hover:bg-[#006cbe]',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 7.387v10.478L19.2 14.4l-5.2 3.6V7.387L24 7.387zM13.2 3.6H1.8C.806 3.6 0 4.406 0 5.4v13.2c0 .994.806 1.8 1.8 1.8h11.4c.994 0 1.8-.806 1.8-1.8V5.4c0-.994-.806-1.8-1.8-1.8zm-1.2 9.6L7.5 16.8 3 13.2V9l4.5 3.3L12 9v4.2z" />
                </svg>
            ),
            href: `mailto:?subject=${encodeURIComponent(`Job Offer: ${offerTitle}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
        },
    ];

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[99998]"
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-200/60 p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-base font-black text-gray-950">Share this offer</h3>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[300px]">{offerTitle}</p>
                            </div>
                            <button onClick={onClose}
                                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Link copy row */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-5">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="flex-1 text-xs text-gray-500 truncate">{url}</span>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 ${
                                    copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400 font-medium">or share via</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Platform buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {shareOptions.map((opt) => (
                                <a
                                    key={opt.label}
                                    href={opt.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 ${opt.bg} text-white font-bold text-sm px-4 py-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                                >
                                    {opt.icon}
                                    {opt.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ── Section ────────────────────────────────────────────
const Section: React.FC<{ title: string; content: string; icon: React.ReactNode; accent: string; index: number }> = ({ title, content, icon, accent, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-8 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
    >
        <div className="flex items-center gap-3 mb-5">
            <div className={`w-9 h-9 rounded-2xl ${accent} flex items-center justify-center shrink-0`}>{icon}</div>
            <h2 className="text-sm font-black text-gray-950 uppercase tracking-wider">{title}</h2>
        </div>
        <p className="text-sm text-gray-500 whitespace-pre-line leading-7 pl-12">{content}</p>
    </motion.div>
);

// ── Skeleton ───────────────────────────────────────────
const SkeletonDetail = () => (
    <div className="min-h-screen bg-[#f5f3ff] animate-pulse">
        <div className="h-16 bg-white/80 border-b border-white" />
        <div className="h-52 bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 opacity-60" />
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-20 flex gap-8">
            <div className="flex-1 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/80 rounded-3xl p-8 space-y-3">
                        <div className="h-4 bg-gray-200 rounded-xl w-1/4 mb-4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                        <div className="h-3 bg-gray-100 rounded w-4/6" />
                    </div>
                ))}
            </div>
            <div className="w-72 shrink-0 space-y-4">
                <div className="h-14 bg-gray-200 rounded-2xl" />
                <div className="h-12 bg-gray-100 rounded-2xl" />
                <div className="h-12 bg-gray-100 rounded-2xl" />
                <div className="bg-white/80 rounded-3xl p-5 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-xl" />
                            <div className="flex-1 space-y-1">
                                <div className="h-2 bg-gray-100 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// ── Main ───────────────────────────────────────────────
const OfferDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [offer, setOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(true);
    const [shareOpen, setShareOpen] = useState(false);

    const getRole = () => {
        const token = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');
        if (!token) return 'USER';
        try { return JSON.parse(atob(token.split('.')[1])).role ?? 'USER'; }
        catch { return 'USER'; }
    };

    useEffect(() => {
        if (!id) return;
        apiGetOffer(Number(id))
            .then((res) => setOffer(res.data.data))
            .catch(() => navigate('/jobfinder'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <SkeletonDetail />;
    if (!offer) return null;

    const role = getRole();

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950">

            <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} offerTitle={offer.title} />

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-[10000] bg-white/75 backdrop-blur-2xl border-b border-white/70 shadow-[0_10px_40px_rgba(79,70,229,0.08)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => navigate('/jobfinder')} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-black text-gray-950 text-xl tracking-tight">JobFinder</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/jobfinder')}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-300">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Browse Jobs
                        </button>
                        {isAuthenticated ? (
                            <>
                                {role === 'COMPANY' && (
                                    <button onClick={() => navigate('/jobfinder/company')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-indigo-200 transition-all duration-300">
                                        Company Dashboard
                                    </button>
                                )}
                                {role === 'ADMIN' && (
                                    <button onClick={() => navigate('/jobfinder/admin')}
                                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-rose-200 transition-all duration-300">
                                        Admin Panel
                                    </button>
                                )}
                                {role === 'USER' && (
                                    <button onClick={() => navigate('/jobfinder/applications')}
                                            className="text-indigo-600 hover:text-indigo-700 font-bold px-5 py-2.5 rounded-2xl hover:bg-indigo-50 text-xs transition-all duration-300">
                                        My Applications
                                    </button>
                                )}
                                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white shadow-lg shadow-indigo-100/60">
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                                        {user?.username?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <span className="text-gray-800 font-bold text-xs max-w-[120px] truncate">{user?.username}</span>
                                    <button onClick={() => logout()}
                                            className="group flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-xs font-bold bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-300">
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-gray-950 font-bold px-5 py-2.5 transition-colors">Sign in</button>
                                <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200">
                                    Get started
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-6 py-14">
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                className="flex items-center gap-2 text-xs text-white/50 mb-6">
                        <button onClick={() => navigate('/jobfinder')} className="hover:text-white transition-colors">Home</button>
                        <span>›</span>
                        <button onClick={() => navigate('/jobfinder')} className="hover:text-white transition-colors">Browse Jobs</button>
                        <span>›</span>
                        <span className="text-white/80 truncate max-w-[220px]">{offer.title}</span>
                    </motion.div>
                    <div className="flex items-start gap-6">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white text-3xl font-black shrink-0 shadow-2xl">
                            {offer.title.slice(0, 1).toUpperCase()}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <motion.h1 initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                       transition={{ duration: 0.45, delay: 0.1 }}
                                       className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                                {offer.title}
                            </motion.h1>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-wrap gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${contractColorsHero[offer.contractType] ?? 'bg-white/20 text-white ring-1 ring-white/20'}`}>
                                    {offer.contractType}
                                </span>
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white/90 ring-1 ring-white/20 flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                    {offer.city}
                                </span>
                                {offer.salary && (
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white/90 ring-1 ring-white/20 flex items-center gap-1.5">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {offer.salary}
                                    </span>
                                )}
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white/90 ring-1 ring-white/20 flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {timeAgo(offer.createdAt)}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8 items-start">

                {/* Left */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    <Section index={0} title="Job Description" content={offer.description}
                             accent="bg-indigo-50 text-indigo-600"
                             icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                    {offer.responsibilities && (
                        <Section index={1} title="Key Responsibilities" content={offer.responsibilities}
                                 accent="bg-violet-50 text-violet-600"
                                 icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                        />
                    )}
                    {offer.requirements && (
                        <Section index={2} title="Requirements" content={offer.requirements}
                                 accent="bg-fuchsia-50 text-fuchsia-600"
                                 icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    )}
                    {offer.niceToHave && (
                        <Section index={3} title="Nice to Have" content={offer.niceToHave}
                                 accent="bg-amber-50 text-amber-600"
                                 icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                        />
                    )}
                </div>

                {/* Right — sticky sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                    className="w-72 shrink-0 flex flex-col gap-3 sticky top-24"
                >
                    {/* 1. Apply */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login', { state: { from: { pathname: `/jobfinder/offers/${offer.id}` } } });
                            } else {
                                navigate(`/jobfinder/offers/${offer.id}/apply`);
                            }
                        }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 text-sm flex items-center justify-center gap-2 group transition-shadow duration-300"
                    >
                        Apply Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>

                    {/* 2. Save — full width */}
                    <SaveJobButton
                        offerId={offer.id}
                        initialSaved={false}
                        onAuthRequired={() => navigate('/login', { state: { from: { pathname: `/jobfinder/offers/${offer.id}` } } })}
                        className="w-full justify-center py-3.5"
                    />

                    {/* 3. Share — full width, own line, opens modal */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShareOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-bold py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share Offer
                    </motion.button>

                    {/* Details card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-5 shadow-sm flex flex-col gap-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Job Details</p>
                        {[
                            { accent: 'bg-indigo-50', icon: <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>, label: 'Location', value: offer.city, valueClass: 'text-sm font-bold text-gray-800' },
                            { accent: 'bg-violet-50', icon: <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>, label: 'Contract', value: null, badge: offer.contractType },
                            ...(offer.salary ? [{ accent: 'bg-emerald-50', icon: <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Salary', value: offer.salary, valueClass: 'text-sm font-bold text-emerald-700' }] : []),
                            { accent: 'bg-amber-50', icon: <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Posted', value: timeAgo(offer.createdAt), valueClass: 'text-sm font-bold text-gray-800' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                                <div className={`w-8 h-8 rounded-xl ${item.accent} flex items-center justify-center shrink-0`}>{item.icon}</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
                                    {item.badge ? (
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${contractColors[item.badge] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>{item.badge}</span>
                                    ) : (
                                        <p className={item.valueClass}>{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="mt-3 flex items-center gap-2.5 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl">
                            <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-xs text-indigo-700 font-semibold">Verified & approved offer</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-white bg-white/80 backdrop-blur-xl px-6 py-7">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-black text-gray-950">JobFinder</span>
                        <span className="text-xs text-gray-400">© 2026</span>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-400">
                        {['About', 'Contact', 'Privacy', 'Terms'].map((l) => (
                            <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OfferDetailPage;