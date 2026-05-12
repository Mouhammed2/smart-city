import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/store/useAuth';
import { apiSetupProfile } from '../api/jobfinder.api';

type Role = 'USER' | 'COMPANY';

const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white transition-all duration-200";

const ProfileSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState<'choose' | 'form'>('choose');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        name: '', companyEmail: '',
    });

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep('form');
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedRole) return;
        setLoading(true);
        setError(null);
        try {
            const body = selectedRole === 'USER'
                ? { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone || undefined }
                : { name: formData.name, email: formData.companyEmail };
            await apiSetupProfile(selectedRole, body);
            localStorage.setItem('jf_role', selectedRole);
            sessionStorage.setItem('jf_role', selectedRole);
            navigate('/jobfinder', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background orbs */}
            <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-violet-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="font-black text-gray-950 text-xl tracking-tight">JobFinder</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl shadow-indigo-100/60 overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-8 py-8">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative">
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
                                {step === 'choose' ? 'Step 1 of 2' : 'Step 2 of 2'}
                            </p>
                            <h1 className="text-2xl font-black text-white leading-tight">
                                {step === 'choose' ? 'Welcome to JobFinder!' : selectedRole === 'USER' ? 'Your Details' : 'Company Details'}
                            </h1>
                            <p className="text-sm text-white/70 mt-1">
                                {step === 'choose'
                                    ? 'Tell us who you are to get started'
                                    : selectedRole === 'USER'
                                        ? 'Fill in your personal information'
                                        : 'Set up your company profile'}
                            </p>

                            {/* Step dots */}
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-6 h-1.5 bg-white rounded-full" />
                                <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'form' ? 'w-6 bg-white' : 'w-3 bg-white/30'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-7">
                        <AnimatePresence mode="wait">

                            {/* ── Step 1: Choose role ── */}
                            {step === 'choose' && (
                                <motion.div
                                    key="choose"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col gap-4"
                                >
                                    {[
                                        {
                                            role: 'USER' as Role,
                                            icon: (
                                                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            ),
                                            iconBg: 'bg-indigo-50',
                                            title: "I'm looking for a job",
                                            sub: 'Browse and apply to job offers from top companies',
                                            accent: 'hover:border-indigo-400 hover:bg-indigo-50/50',
                                            badge: 'bg-indigo-50 text-indigo-600',
                                            badgeLabel: 'Job Seeker',
                                        },
                                        {
                                            role: 'COMPANY' as Role,
                                            icon: (
                                                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            ),
                                            iconBg: 'bg-emerald-50',
                                            title: "I'm a company",
                                            sub: 'Post job offers and find the best talent for your team',
                                            accent: 'hover:border-emerald-400 hover:bg-emerald-50/50',
                                            badge: 'bg-emerald-50 text-emerald-600',
                                            badgeLabel: 'Recruiter',
                                        },
                                    ].map(item => (
                                        <motion.button
                                            key={item.role}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleRoleSelect(item.role)}
                                            className={`group flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-100 text-left transition-all duration-200 ${item.accent}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-sm font-black text-gray-950">{item.title}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.badgeLabel}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{item.sub}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {/* ── Step 2: Form ── */}
                            {step === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setStep('choose')}
                                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 font-semibold mb-5 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back
                                    </button>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                        {selectedRole === 'USER' ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { label: 'First Name', key: 'firstName', placeholder: 'First Name' },
                                                        { label: 'Last Name',  key: 'lastName',  placeholder: 'Last Name'  },
                                                    ].map(f => (
                                                        <div key={f.key}>
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                                                {f.label} <span className="text-rose-400">*</span>
                                                            </label>
                                                            <input
                                                                required
                                                                value={formData[f.key as keyof typeof formData]}
                                                                onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                                                                placeholder={f.placeholder}
                                                                className={inputClass}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                                        Email <span className="text-rose-400">*</span>
                                                    </label>
                                                    <input
                                                        required type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                        placeholder="mail@example.com"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                                        Phone <span className="text-gray-300 normal-case font-medium">optional</span>
                                                    </label>
                                                    <input
                                                        value={formData.phone}
                                                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                        placeholder="0612345678"
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                                        Company Name <span className="text-rose-400">*</span>
                                                    </label>
                                                    <input
                                                        required
                                                        value={formData.name}
                                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                        placeholder="Tech Corp"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                                                        Company Email <span className="text-rose-400">*</span>
                                                    </label>
                                                    <input
                                                        required type="email"
                                                        value={formData.companyEmail}
                                                        onChange={e => setFormData(p => ({ ...p, companyEmail: e.target.value }))}
                                                        placeholder="contact@techcorp.com"
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Error */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3"
                                                >
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
                                            disabled={loading}
                                            whileHover={{ scale: loading ? 1 : 1.01 }}
                                            whileTap={{ scale: loading ? 1 : 0.98 }}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2 group transition-all duration-200 mt-1"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Complete Profile
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-center text-gray-400 mt-5"
                >
                    You can update your profile later from your dashboard
                </motion.p>
            </div>
        </div>
    );
};

export default ProfileSetupPage;