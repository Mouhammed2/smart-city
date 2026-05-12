import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/store/useAuth';
import { logout } from '../../auth/store/authSlice';
import type { Offer } from '../api/jobfinder.api';

const contractColors: Record<string, { bg: string; text: string; dot: string }> = {
    CDI:         { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CDD:         { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500'   },
    Freelance:   { bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-500'  },
    Internship:  { bg: 'bg-sky-50',      text: 'text-sky-700',     dot: 'bg-sky-500'     },
    'Part-time': { bg: 'bg-rose-50',     text: 'text-rose-700',    dot: 'bg-rose-500'    },
    'Full-time': { bg: 'bg-teal-50',     text: 'text-teal-700',    dot: 'bg-teal-500'    },
};

const steps = [
    {
        icon: (
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        iconBg: 'bg-emerald-50',
        connector: 'bg-emerald-200',
        label: 'Application Received',
        sub: 'Your application has been successfully submitted',
        done: true,
    },
    {
        icon: (
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        iconBg: 'bg-amber-50',
        connector: 'bg-gray-100',
        label: 'Under Review',
        sub: 'The company will review your profile and CV',
        done: false,
    },
    {
        icon: (
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        iconBg: 'bg-indigo-50',
        connector: null,
        label: 'Decision Notification',
        sub: "You'll be notified by email of the final decision",
        done: false,
    },
];

const ApplicationSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const offer = location.state?.offer as Offer | undefined;
    const application = location.state?.application as any | undefined;

    const title = offer?.title ?? application?.offerTitle ?? 'Position';
    const submittedAt = new Date(application?.appliedAt ?? Date.now()).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const cc = offer?.contractType ? contractColors[offer.contractType] : null;

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950">

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
                        {user && (
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white shadow-lg shadow-indigo-100/60">
                                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                                    {user.username?.slice(0, 1).toUpperCase()}
                                </div>
                                <span className="text-gray-700 font-bold text-xs max-w-[100px] truncate">{user.username}</span>
                                <button onClick={() => logout()} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-3xl mx-auto px-6 py-12 text-center">
                    {/* Animated check */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative w-20 h-20 mx-auto mb-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                            <motion.svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                                             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                             transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }} />
                            </motion.svg>
                        </div>
                        <motion.div
                            initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ duration: 1.2, repeat: 2, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full bg-white/20"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Application Submitted</p>
                        <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-3">You're all set! </h1>
                        <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
                            Your application for <span className="text-white font-bold">"{title}"</span> has been successfully submitted. Good luck!
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">

                {/* Two-column row */}
                <div className="flex gap-5 items-start">

                    {/* LEFT — Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-1 bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Application Summary</p>
                        </div>

                        <div className="flex flex-col gap-0">
                            {[
                                { label: 'Full Name', value: `${application?.firstName ?? ''} ${application?.lastName ?? ''}`.trim() || '—' },
                                { label: 'Email',     value: application?.email ?? '—' },
                                { label: 'Position',  value: title },
                                { label: 'Location',  value: offer?.city ?? '—' },
                                { label: 'Submitted', value: submittedAt },
                                { label: 'Contract',  value: null, badge: offer?.contractType },
                            ].map((item, i, arr) => (
                                <div key={i} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0">{item.label}</span>
                                    {item.badge ? (
                                        cc ? (
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cc.bg} ${cc.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cc.dot}`} />
                                                {item.badge}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-900">{item.badge}</span>
                                        )
                                    ) : (
                                        <span className="text-sm font-bold text-gray-900 text-right max-w-[180px] truncate">{item.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT — What happens next */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-72 shrink-0 bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-5 bg-gradient-to-b from-violet-600 to-fuchsia-500 rounded-full" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">What's Next</p>
                        </div>

                        <div className="flex flex-col gap-0">
                            {steps.map((step, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 300 }}
                                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${step.iconBg}`}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        {step.connector && (
                                            <div className={`w-0.5 h-8 ${step.connector} my-1`} />
                                        )}
                                    </div>
                                    <div className="pb-5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                            <p className={`text-sm font-black ${step.done ? 'text-gray-950' : 'text-gray-400'}`}>{step.label}</p>
                                            {step.done && (
                                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Done</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">{step.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/jobfinder/applications')}
                        className="flex-1 bg-white/90 backdrop-blur-xl border border-white hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-bold py-4 rounded-2xl transition-all duration-200 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View My Applications
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/jobfinder')}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2 group transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse More Jobs
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>
                </motion.div>

                <p className="text-xs text-center text-gray-400">
                    Track your application status anytime in{' '}
                    <button onClick={() => navigate('/jobfinder/applications')} className="text-indigo-500 hover:underline font-semibold">
                        My Applications
                    </button>
                </p>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-white bg-white/80 backdrop-blur-xl px-6 py-6 mt-4">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
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

export default ApplicationSuccessPage;