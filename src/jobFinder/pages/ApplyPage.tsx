import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../auth/store/useAuth';
import { apiGetOffer, apiApplyToOffer, apiGetMyProfile, apiGetMyApplications, type Offer } from '../api/jobfinder.api';
import { logout } from '../../auth/store/authSlice';
import NotificationBell from '../components/NotificationBell';

const contractColors: Record<string, { bg: string; text: string; dot: string }> = {
    CDI:         { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CDD:         { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500'   },
    Freelance:   { bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-500'  },
    Internship:  { bg: 'bg-sky-50',      text: 'text-sky-700',     dot: 'bg-sky-500'     },
    'Part-time': { bg: 'bg-rose-50',     text: 'text-rose-700',    dot: 'bg-rose-500'    },
    'Full-time': { bg: 'bg-teal-50',     text: 'text-teal-700',    dot: 'bg-teal-500'    },
};

const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Success Popup ──────────────────────────────────────────────
const SuccessPopup: React.FC<{ offer: Offer; onDone: () => void }> = ({ offer, onDone }) => {
    const [progress, setProgress] = useState(100);
    useEffect(() => {
        const interval = setInterval(() => setProgress(p => Math.max(0, p - 2)), 60);
        const timer = setTimeout(onDone, 3000);
        return () => { clearInterval(interval); clearTimeout(timer); };
    }, [onDone]);

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-white rounded-3xl shadow-2xl border border-white p-10 text-center max-w-sm w-full mx-4 relative overflow-hidden"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                        <motion.svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                                         initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                         transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }} />
                        </motion.svg>
                    </div>
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-indigo-400/30"
                    />
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Application Submitted</p>
                    <h2 className="text-2xl font-black text-gray-950 leading-tight mb-2">You're all set! 🎉</h2>
                    <p className="text-sm text-gray-400 leading-relaxed mb-1">Your application for</p>
                    <p className="text-sm font-bold text-gray-700 mb-4 truncate px-4">"{offer.title}"</p>
                    <p className="text-xs text-gray-400">has been successfully submitted. Good luck!</p>
                </motion.div>
                <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                                style={{ width: `${progress}%` }} transition={{ duration: 0.06, ease: 'linear' }} />
                </div>
                <p className="text-[10px] text-gray-300 mt-2">Redirecting to your application details...</p>
            </motion.div>
        </motion.div>,
        document.body
    );
};

// ── Skeleton ───────────────────────────────────────────────────
const SkeletonApply = () => (
    <div className="min-h-screen bg-[#f5f3ff] animate-pulse">
        <div className="h-16 bg-white/80 border-b border-white" />
        <div className="h-40 bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 opacity-60" />
        <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
            <div className="flex-1 bg-white/80 rounded-3xl p-8 space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-xl" />)}
            </div>
            <div className="w-96 bg-white/80 rounded-3xl p-8 space-y-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
            </div>
        </div>
    </div>
);

// ── Main ───────────────────────────────────────────────────────
const ApplyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [offer, setOffer] = useState<Offer | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [successData, setSuccessData] = useState<{ offer: Offer; application: any } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getRole = () => {
        const token = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');
        if (!token) return 'USER';
        try { return JSON.parse(atob(token.split('.')[1])).role ?? 'USER'; }
        catch { return 'USER'; }
    };

    useEffect(() => {
        if (!user || !id) return;
        Promise.all([
            apiGetOffer(Number(id)),
            apiGetMyProfile(user.role),
            apiGetMyApplications(),
        ])
            .then(([offerRes, profileRes, appsRes]) => {
                setOffer(offerRes.data.data);
                setProfile(profileRes.data.data);
                const existing = appsRes.data.data.find((app: any) => app.offerId === Number(id));
                if (existing) {
                    navigate(`/jobfinder/offers/${id}/apply/success`, {
                        state: { offer: offerRes.data.data, application: existing },
                        replace: true,
                    });
                }
            })
            .catch(() => navigate('/jobfinder'))
            .finally(() => setLoading(false));
    }, [user, id, navigate]);

    const handleFile = (file: File | null) => {
        if (!file) return;
        if (file.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('File size must be under 5MB.'); return; }
        setError(null);
        setCvFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !offer) return;
        if (!cvFile) { setError('CV is required. Please upload a PDF file.'); return; }
        setSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('coverLetter', coverLetter);
            formData.append('cv', cvFile);
            const res = await apiApplyToOffer(offer.id, formData);
            setSuccessData({ offer, application: res.data.data });
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'Something went wrong';
            setError(message.includes('already applied') ? 'You have already applied to this offer.' : message);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePopupDone = () => {
        if (!successData) return;
        navigate(`/jobfinder/offers/${successData.offer.id}/apply/success`, {
            state: { offer: successData.offer, application: successData.application },
        });
    };

    if (loading) return <SkeletonApply />;
    if (!offer) return null;

    const role = getRole();
    const cc = contractColors[offer.contractType];

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950">

            <AnimatePresence>
                {successData && <SuccessPopup offer={successData.offer} onDone={handlePopupDone} />}
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
                        <button onClick={() => navigate('/jobfinder')}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Browse Jobs
                        </button>
                        {isAuthenticated && (
                            <>
                                {role === 'USER' && (
                                    <button onClick={() => navigate('/jobfinder/applications')}
                                            className="text-indigo-600 hover:text-indigo-700 font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 text-xs transition-all">
                                        My Applications
                                    </button>
                                )}
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

            {/* ── Gradient Hero (slim) ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
                        <button onClick={() => navigate('/jobfinder')} className="hover:text-white transition-colors">Home</button>
                        <span>›</span>
                        <button onClick={() => navigate(`/jobfinder/offers/${offer.id}`)} className="hover:text-white transition-colors truncate max-w-[160px]">{offer.title}</button>
                        <span>›</span>
                        <span className="text-white/80">Apply</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white text-xl font-black shrink-0">
                            {offer.title.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Applying for</p>
                            <h1 className="text-2xl font-black text-white tracking-tight">{offer.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex gap-7 items-start">

                {/* ── LEFT: Offer details ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex-1 min-w-0 flex flex-col gap-5 sticky top-24"
                >
                    {/* Quick info card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Position Overview</p>

                        <div className="flex flex-col gap-0">
                            {[
                                {
                                    icon: <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                                    iconBg: 'bg-indigo-50',
                                    label: 'Position',
                                    value: <span className="text-sm font-bold text-gray-900">{offer.title}</span>,
                                },
                                {
                                    icon: <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>,
                                    iconBg: 'bg-violet-50',
                                    label: 'Location',
                                    value: <span className="text-sm font-bold text-gray-900">{offer.city}</span>,
                                },
                                {
                                    icon: <svg className="w-4 h-4 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>,
                                    iconBg: 'bg-fuchsia-50',
                                    label: 'Contract',
                                    value: cc ? (
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cc.bg} ${cc.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cc.dot}`} />
                                            {offer.contractType}
                                        </span>
                                    ) : <span className="text-sm font-bold text-gray-900">{offer.contractType}</span>,
                                },
                                ...(offer.salary ? [{
                                    icon: <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                                    iconBg: 'bg-emerald-50',
                                    label: 'Salary',
                                    value: <span className="text-sm font-bold text-emerald-700">{offer.salary}</span>,
                                }] : []),
                                {
                                    icon: <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                                    iconBg: 'bg-amber-50',
                                    label: 'Posted',
                                    value: <span className="text-sm font-bold text-gray-900">{timeAgo(offer.createdAt)}</span>,
                                },
                            ].map((item, i, arr) => (
                                <div key={i} className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{item.label}</p>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description preview */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">About this role</p>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-6">{offer.description}</p>
                        <button
                            onClick={() => navigate(`/jobfinder/offers/${offer.id}`)}
                            className="mt-4 text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group"
                        >
                            Read full job description
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Verified badge */}
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3.5">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-black text-emerald-800">Verified offer</p>
                            <p className="text-[10px] text-emerald-600">Reviewed and approved by our team</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── RIGHT: Application form ── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    className="w-[480px] shrink-0"
                >
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden">
                        {/* Form header */}
                        <div className="px-8 pt-7 pb-5 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-gray-950">Your Application</h2>
                                    <p className="text-xs text-gray-400">Complete all required fields</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'First Name', value: profile?.firstName ?? '' },
                                    { label: 'Last Name',  value: profile?.lastName  ?? '' },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">{label}</label>
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-3.5 py-2.5">
                                            <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="text-sm text-gray-500 font-medium truncate">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-3.5 py-2.5">
                                    <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="text-sm text-gray-500 font-medium">{profile?.email ?? ''}</span>
                                </div>
                                <p className="text-[10px] text-gray-300 mt-1 ml-1">From your profile · not editable</p>
                            </div>

                            {/* Cover letter */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                        Cover Letter <span className="text-gray-300 normal-case font-medium">(optional)</span>
                                    </label>
                                    <span className="text-[10px] text-gray-300">{coverLetter.length} chars</span>
                                </div>
                                <textarea
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                    rows={5}
                                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white resize-none transition-all duration-200"
                                    placeholder="Tell us why you're the perfect fit for this role..."
                                />
                            </div>

                            {/* CV Upload */}
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                    CV / Resume <span className="text-rose-400">*</span>
                                    <span className="text-gray-300 normal-case font-medium ml-1">(PDF, max 5MB)</span>
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                                        dragOver ? 'border-indigo-400 bg-indigo-50'
                                            : cvFile ? 'border-emerald-300 bg-emerald-50'
                                                : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {cvFile ? (
                                            <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                        className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-emerald-700 truncate max-w-[240px]">{cvFile.name}</p>
                                                    <p className="text-xs text-emerald-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                        className="flex flex-col items-center gap-1.5">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-colors ${dragOver ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                                    <svg className={`w-5 h-5 transition-colors ${dragOver ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-bold text-gray-600">Drop your CV or <span className="text-indigo-600">browse</span></p>
                                                <p className="text-xs text-gray-400">PDF only · max 5MB</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden"
                                       onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                                className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
                                        <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-rose-700 font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileHover={{ scale: submitting ? 1 : 1.01 }}
                                whileTap={{ scale: submitting ? 1 : 0.98 }}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2 group transition-all duration-200"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Application
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>

                            <p className="text-xs text-center text-gray-400">
                                By submitting you agree to our{' '}
                                <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a>
                            </p>
                        </form>
                    </div>

                    <div className="text-center mt-4">
                        <button onClick={() => navigate(`/jobfinder/offers/${offer.id}`)}
                                className="text-xs text-gray-400 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-1.5 mx-auto">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to offer details
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-white bg-white/80 backdrop-blur-xl px-6 py-6 mt-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-black text-gray-950">JobFinder</span>
                        <span className="text-xs text-gray-400">© 2026</span>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-400">
                        {['About', 'Contact', 'Privacy', 'Terms'].map(l => (
                            <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ApplyPage;