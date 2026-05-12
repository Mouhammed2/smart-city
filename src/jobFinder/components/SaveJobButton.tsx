import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiSaveOffer, apiUnsaveOffer, apiGetSavedOffers } from '../api/jobfinder.api';
import { useAuth } from '../../auth/store/useAuth';

interface SaveJobButtonProps {
    offerId: number;
    initialSaved?: boolean;
    onAuthRequired?: () => void;
    className?: string;
}

interface ToastData {
    message: string;
    sub: string;
    type: 'saved' | 'unsaved' | 'error';
}

const Toast: React.FC<{ data: ToastData; onClose: () => void }> = ({ data, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const icons = {
        saved: (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto mb-4">
                <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </motion.svg>
            </div>
        ),
        unsaved: (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </div>
        ),
        error: (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-200 mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        ),
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white px-10 py-8 text-center max-w-xs w-full mx-4 pointer-events-auto"
                >
                    {icons[data.type]}
                    <p className="text-base font-black text-gray-950 mb-1">{data.message}</p>
                    <p className="text-xs text-gray-400 font-medium">{data.sub}</p>

                    {/* Progress bar */}
                    <div className="mt-5 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 3, ease: 'linear' }}
                            className={`h-full rounded-full ${
                                data.type === 'saved'
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600'
                                    : data.type === 'error'
                                        ? 'bg-rose-500'
                                        : 'bg-gray-400'
                            }`}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

const SaveJobButton: React.FC<SaveJobButtonProps> = ({
                                                         offerId,
                                                         initialSaved = false,
                                                         onAuthRequired,
                                                         className = '',
                                                     }) => {
    const { isAuthenticated } = useAuth();
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [toast, setToast] = useState<ToastData | null>(null);

    // Fix: On mount, check actual saved state from API if user is authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        setChecking(true);
        apiGetSavedOffers()
            .then((res) => {
                const savedOffers = res.data.data ?? [];
                const isSaved = savedOffers.some((o: any) => o.offerId === offerId || o.id === offerId);
                setSaved(isSaved);
            })
            .catch(() => {
                // fallback to initialSaved
            })
            .finally(() => setChecking(false));
    }, [offerId, isAuthenticated]);

    const handleClick = async () => {
        if (loading || checking) return;

        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }

        setLoading(true);
        try {
            if (saved) {
                await apiUnsaveOffer(offerId);
                setSaved(false);
                setToast({
                    message: 'Removed from saved',
                    sub: 'You can save it again anytime.',
                    type: 'unsaved',
                });
            } else {
                await apiSaveOffer(offerId);
                setSaved(true);
                setToast({
                    message: 'Job saved! 🎉',
                    sub: 'Find it anytime in your saved offers.',
                    type: 'saved',
                });
            }
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                onAuthRequired?.();
            } else if (status === 409) {
                setSaved(true);
                setToast({
                    message: 'Already saved',
                    sub: 'This offer is in your saved list.',
                    type: 'error',
                });
            } else {
                setToast({
                    message: 'Something went wrong',
                    sub: 'Please try again.',
                    type: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <Toast data={toast} onClose={() => setToast(null)} />}

            <motion.button
                onClick={handleClick}
                disabled={loading || checking}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className={`
                    flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold
                    transition-colors duration-200 disabled:opacity-60 border
                    ${saved
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                }
                    ${className}
                `}
            >
                {loading || checking ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <motion.svg
                        key={saved ? 'saved' : 'unsaved'}
                        initial={{ scale: 0.7, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="w-4 h-4 shrink-0"
                        fill={saved ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </motion.svg>
                )}
                <span>{saved ? 'Saved' : 'Save Job'}</span>
            </motion.button>
        </>
    );
};

export default SaveJobButton;