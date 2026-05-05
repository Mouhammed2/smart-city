import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../auth/store/useAuth';
import { apiCreateOffer, apiUpdateOffer, apiGetCompanyOfferById } from '../../api/jobfinder.api';
import { logout } from '../../../auth/store/authSlice';
import NotificationBell from '../../components/NotificationBell';
import UserMenu from "../../components/UserMenu";

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Internship', 'Part-time', 'Full-time'];
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Oujda'];

interface OfferFormData {
    title: string;
    description: string;
    responsibilities: string;
    requirements: string;
    nice_to_have: string;
    city: string;
    contractType: string;
    salary: string;
}

// ── Custom Select ──────────────────────────────────────────────
const CustomSelect: React.FC<{
    value: string;
    options: string[];
    placeholder: string;
    onChange: (val: string) => void;
    icon: React.ReactNode;
}> = ({ value, options, placeholder, onChange, icon }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm border transition-all duration-200 ${
                    open
                        ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100 text-indigo-700'
                        : value
                            ? 'bg-gray-50 border-gray-100 text-gray-800'
                            : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}
            >
                <span className="flex items-center gap-2.5 min-w-0">
                    <span className={open ? 'text-indigo-500' : 'text-gray-400'}>{icon}</span>
                    <span className="truncate">{value || placeholder}</span>
                </span>
                <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-indigo-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/50 p-1.5 z-50"
                    >
                        {options.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                                    value === opt
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <span>{opt}</span>
                                {value === opt && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Field ──────────────────────────────────────────────────────
const Field: React.FC<{
    label: string;
    required?: boolean;
    optional?: boolean;
    hint?: string;
    children: React.ReactNode;
    index: number;
}> = ({ label, required, optional, hint, children, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35 }}
    >
        <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">{label}</label>
            {required && <span className="text-rose-400 text-xs font-bold">*</span>}
            {optional && <span className="text-gray-300 text-xs font-medium normal-case">optional</span>}
        </div>
        {children}
        {hint && <p className="text-[10px] text-gray-300 mt-1.5 ml-1">{hint}</p>}
    </motion.div>
);

// ── Main ───────────────────────────────────────────────────────
const CompanyOfferFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const isEdit = Boolean(id);

    const [form, setForm] = useState<OfferFormData>({
        title: '', description: '', responsibilities: '',
        requirements: '', nice_to_have: '', city: '', contractType: '', salary: '',
    });
    const [loadingOffer, setLoadingOffer] = useState(isEdit);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit || !id) return;
        setLoadingOffer(true);
        apiGetCompanyOfferById(Number(id))
            .then(res => {
                const o = res.data.data;
                setForm({
                    title: o.title ?? '',
                    description: o.description ?? '',
                    responsibilities: o.responsibilities ?? '',
                    requirements: o.requirements ?? '',
                    nice_to_have: o.niceToHave ?? '',
                    city: o.city ?? '',
                    contractType: o.contractType ?? '',
                    salary: o.salary ?? '',
                });
            })
            .catch(() => setError('Failed to load offer.'))
            .finally(() => setLoadingOffer(false));
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!form.title.trim())       return setError('Job title is required.');
        if (!form.description.trim()) return setError('Description is required.');
        if (!form.city.trim())        return setError('City is required.');
        if (!form.contractType)       return setError('Contract type is required.');

        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                responsibilities: form.responsibilities.trim(),
                requirements: form.requirements.trim(),
                nice_to_have: form.nice_to_have.trim(),
                city: form.city.trim(),
                contractType: form.contractType,
                ...(form.salary.trim() ? { salary: form.salary.trim() } : {}),
            };
            if (isEdit && id) {
                await apiUpdateOffer(Number(id), payload);
            } else {
                await apiCreateOffer(payload);
            }
            navigate('/jobfinder/company');
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    const navItems = [
        {
            label: 'My Offers',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            path: '/jobfinder/company', active: false,
        },
        {
            label: isEdit ? 'Edit Offer' : 'Post New Offer',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
            path: '/jobfinder/company/offers/new', active: true,
        },
        {
            label: 'Applications',
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>,
            path: '/jobfinder/company', active: false,
        },
    ];

    const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white transition-all duration-200";
    const textareaClass = `${inputClass} resize-none`;

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

                    {/* Tips card */}
                    <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white p-4 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tips</p>
                        {[
                            'Be specific about requirements',
                            'Include salary range for more applicants',
                            'List key responsibilities clearly',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                                <p className="text-[10px] text-gray-400 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Main ── */}
                <div className="flex-1 min-w-0">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div>
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                                {isEdit ? 'Edit Offer' : 'Post New Offer'}
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {isEdit ? 'Update the details of your job offer' : 'Fill in the details to post a new job offer'}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/jobfinder/company')}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </motion.div>

                    {loadingOffer ? (
                        <div className="bg-white/90 rounded-3xl border border-white p-8 space-y-5 animate-pulse">
                            {[1,2,3,4].map(i => (
                                <div key={i}>
                                    <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
                                    <div className="h-10 bg-gray-50 rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">

                            {/* ── Section 1: Basic Info ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-7"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Basic Information</p>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <Field label="Job Title" required index={0}>
                                        <input
                                            type="text" name="title" value={form.title} onChange={handleChange}
                                            placeholder="e.g. Senior Full Stack Developer"
                                            className={inputClass}
                                        />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="City" required index={1}>
                                            <CustomSelect
                                                value={form.city}
                                                options={CITIES}
                                                placeholder="Select city"
                                                onChange={val => { setForm(p => ({ ...p, city: val })); setError(null); }}
                                                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>}
                                            />
                                        </Field>

                                        <Field label="Contract Type" required index={2}>
                                            <CustomSelect
                                                value={form.contractType}
                                                options={CONTRACT_TYPES}
                                                placeholder="Select contract"
                                                onChange={val => { setForm(p => ({ ...p, contractType: val })); setError(null); }}
                                                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Salary Range" optional index={3} hint="e.g. 15,000 – 25,000 MAD / month">
                                        <div className="relative max-w-sm">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text" name="salary" value={form.salary} onChange={handleChange}
                                                placeholder="e.g. 25,000 - 35,000 MAD"
                                                className={`${inputClass} pl-10`}
                                            />
                                        </div>
                                    </Field>
                                </div>
                            </motion.div>

                            {/* ── Section 2: Content ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-7"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1 h-5 bg-gradient-to-b from-violet-600 to-fuchsia-500 rounded-full" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Job Content</p>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <Field label="Description" required index={4} hint="Give a short overview of the role and company">
                                        <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                                                  placeholder="Give a short overview of the role..."
                                                  className={textareaClass} />
                                    </Field>

                                    <Field label="Responsibilities" index={5} hint="List the main day-to-day responsibilities">
                                        <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={4}
                                                  placeholder="List the main responsibilities of this role..."
                                                  className={textareaClass} />
                                    </Field>

                                    <Field label="Requirements" index={6} hint="Required skills, experience, education">
                                        <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4}
                                                  placeholder="Required skills, experience, education..."
                                                  className={textareaClass} />
                                    </Field>

                                    <Field label="Nice to Have" optional index={7} hint="Bonus skills or qualifications">
                                        <textarea name="nice_to_have" value={form.nice_to_have} onChange={handleChange} rows={3}
                                                  placeholder="Optional skills or bonus qualifications..."
                                                  className={textareaClass} />
                                    </Field>
                                </div>
                            </motion.div>

                            {/* Review banner */}
                            {!isEdit && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4"
                                >
                                    <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-amber-800 uppercase tracking-wide mb-0.5">Review Required</p>
                                        <p className="text-xs text-amber-600 leading-relaxed">Your offer will be reviewed by an admin before it becomes visible to job seekers.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4"
                                    >
                                        <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-rose-700 font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-between items-center pb-4"
                            >
                                <button
                                    onClick={() => navigate('/jobfinder/company')}
                                    className="px-6 py-3 rounded-2xl bg-white/90 border border-white text-gray-600 hover:text-indigo-600 hover:border-indigo-200 font-bold text-sm transition-all shadow-sm"
                                >
                                    Cancel
                                </button>

                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-indigo-200 text-sm group transition-all duration-200"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            {isEdit ? 'Saving...' : 'Posting...'}
                                        </>
                                    ) : (
                                        <>
                                            {isEdit ? 'Save Changes' : 'Post Offer'}
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyOfferFormPage;