import React from 'react';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

const icons = {
    danger: (
        <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
    ),
    warning: (
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const confirmButtonStyles = {
    danger:  'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
    info:    'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
};

const iconBg = {
    danger:  'bg-rose-50',
    warning: 'bg-amber-50',
    info:    'bg-indigo-50',
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       open,
                                                       title,
                                                       message,
                                                       confirmLabel = 'Confirm',
                                                       cancelLabel = 'Cancel',
                                                       variant = 'danger',
                                                       onConfirm,
                                                       onCancel,
                                                   }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-300/60 border border-gray-100 w-full max-w-md p-7 animate-scaleIn">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${iconBg[variant]} flex items-center justify-center mb-5`}>
                    {icons[variant]}
                </div>

                <h2 className="text-lg font-black text-gray-950 mb-2">{title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-7">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-2xl text-sm font-black text-white shadow-lg transition-all duration-200 ${confirmButtonStyles[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;