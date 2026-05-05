import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/store/useAuth';
import { apiGetMyProfile, apiSetupProfile, getJfRole } from '../api/jobfinder.api';
import ConfirmModal from '../components/ConfirmModal';

const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white transition-all duration-200";
const readonlyClass = "w-full bg-gray-50/60 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed select-none";

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
            {label}
            <span className="ml-1 normal-case font-medium text-gray-300">· read only</span>
        </label>
        <div className={readonlyClass}>{value || '—'}</div>
    </div>
);

const EditableField: React.FC<{
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange: (v: string) => void;
}> = ({ label, value, type = 'text', placeholder, onChange }) => (
    <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
            {label}
            <span className="ml-1.5 normal-case font-bold text-indigo-500">· editable</span>
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
        />
    </div>
);

const roleBadge: Record<string, { label: string; color: string; bg: string }> = {
    USER:    { label: 'Job Seeker',  color: 'text-indigo-700',  bg: 'bg-indigo-50'  },
    COMPANY: { label: 'Company',     color: 'text-emerald-700', bg: 'bg-emerald-50' },
    ADMIN:   { label: 'Admin',       color: 'text-rose-700',    bg: 'bg-rose-50'    },
};

const Skeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i}>
                <div className="h-2.5 w-20 bg-gray-100 rounded-full mb-2" />
                <div className="h-11 bg-gray-100 rounded-2xl" />
            </div>
        ))}
    </div>
);

const MyProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = getJfRole() as 'USER' | 'COMPANY' | 'ADMIN';
    const badge = roleBadge[role] ?? roleBadge.USER;

    const [profile, setProfile] = useState<Record<string, string> | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        apiGetMyProfile(role)
            .then((res) => {
                const data = res.data?.data ?? res.data;
                setProfile(data);
                setNewEmail(data?.email ?? data?.companyEmail ?? '');
                setNewPhone(data?.phone ?? '');
            })
            .catch(() => setFetchError('Failed to load your profile.'))
            .finally(() => setLoadingProfile(false));
    }, [role]);

    const currentEmail = profile?.email ?? profile?.companyEmail ?? '';
    const currentPhone = profile?.phone ?? '';
    const emailChanged = newEmail.trim() !== '' && newEmail.trim() !== currentEmail;
    const phoneChanged = newPhone.trim() !== currentPhone;
    const isDirty = emailChanged || phoneChanged;

    const doSave = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            const body = role === 'COMPANY'
                ? { name: profile?.name ?? '', email: newEmail.trim() }
                : {
                    firstName: profile?.firstName ?? '',
                    lastName:  profile?.lastName  ?? '',
                    email:     newEmail.trim(),
                    phone:     newPhone.trim() || undefined,
                };
            await apiSetupProfile(role === 'ADMIN' ? 'USER' : role, body);
            setProfile((prev) => prev
                ? { ...prev, email: newEmail.trim(), companyEmail: newEmail.trim(), phone: newPhone.trim() }
                : prev
            );
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setSaveError(err?.response?.data?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveClick = () => {
        if (!isDirty) return;
        // Only show warning if email changed — phone change is safe
        if (emailChanged) {
            setConfirmOpen(true);
        } else {
            void doSave();
        }
    };

    const handleConfirmSave = async () => {
        setConfirmOpen(false);
        await doSave();
    };

    const warningMessage = role === 'COMPANY'
        ? 'Changing your email will cancel all your active job offers and associated applications. This cannot be undone.'
        : role === 'USER'
            ? 'Changing your email will cancel all your active job applications. This cannot be undone.'
            : 'Changing your email will update your admin account. Continue?';

    return (
        <div className="min-h-screen bg-[#f5f3ff] px-4 py-10 relative overflow-hidden">
            <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-violet-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 font-semibold mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl shadow-indigo-100/60 overflow-hidden">
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-8 py-8">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-xl font-black shrink-0 border border-white/30">
                                {(profile?.firstName ?? profile?.name ?? user?.username ?? '?').slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white leading-tight mb-1">
                                    {role === 'COMPANY'
                                        ? (profile?.name ?? 'Your Company')
                                        : `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() || user?.username}
                                </h1>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${badge.bg} ${badge.color}`}>
                                    {badge.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-7 flex flex-col gap-5">
                        {loadingProfile ? (
                            <Skeleton />
                        ) : fetchError ? (
                            <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 text-sm text-rose-700 font-medium">
                                {fetchError}
                            </div>
                        ) : (
                            <>
                                {/* Read-only */}
                                {role === 'COMPANY' ? (
                                    <Field label="Company Name" value={profile?.name ?? ''} />
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="First Name" value={profile?.firstName ?? ''} />
                                        <Field label="Last Name"  value={profile?.lastName  ?? ''} />
                                    </div>
                                )}

                                {/* Editable: email */}
                                <EditableField
                                    label="Email"
                                    type="email"
                                    value={newEmail}
                                    placeholder="your@email.com"
                                    onChange={(v) => { setNewEmail(v); setSaveError(null); setSaveSuccess(false); }}
                                />

                                {/* Editable: phone (USER only) */}
                                {role === 'USER' && (
                                    <EditableField
                                        label="Phone"
                                        type="tel"
                                        value={newPhone}
                                        placeholder="0612345678"
                                        onChange={(v) => { setNewPhone(v); setSaveError(null); setSaveSuccess(false); }}
                                    />
                                )}

                                {/* Email warning */}
                                {emailChanged && (
                                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                                        <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                            {role === 'COMPANY'
                                                ? 'Changing your email will cancel all your active offers and their applications.'
                                                : 'Changing your email will cancel all your active applications.'}
                                        </p>
                                    </div>
                                )}

                                {saveError && (
                                    <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
                                        <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-rose-700 font-medium">{saveError}</p>
                                    </div>
                                )}

                                {saveSuccess && (
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-sm text-emerald-700 font-medium">Profile updated successfully.</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleSaveClick}
                                    disabled={!isDirty || saving}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2 transition-all duration-200"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Save Changes
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-xs text-center text-gray-400 mt-5">
                    Email and phone can be updated at any time.
                </p>
            </div>

            <ConfirmModal
                open={confirmOpen}
                variant="warning"
                title="Change your email?"
                message={warningMessage}
                confirmLabel="Yes, update email"
                cancelLabel="Cancel"
                onConfirm={handleConfirmSave}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default MyProfilePage;