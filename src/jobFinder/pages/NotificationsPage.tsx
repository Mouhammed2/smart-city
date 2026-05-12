import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    apiGetNotifications,
    apiMarkNotificationsRead,
    type NotificationItem,
} from '../api/jobfinder.api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const timeAgo = (dateStr: string): string => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const groupNotifications = (items: NotificationItem[]) => {
    const now = Date.now();
    const today: NotificationItem[] = [];
    const thisWeek: NotificationItem[] = [];
    const older: NotificationItem[] = [];

    items.forEach((n) => {
        const diff = now - new Date(n.createdAt).getTime();
        if (diff < 86_400_000) today.push(n);
        else if (diff < 604_800_000) thisWeek.push(n);
        else older.push(n);
    });

    return { today, thisWeek, older };
};

// Maps notification type → icon + color
const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    OFFER_APPROVED:   { icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    OFFER_REJECTED:   { icon: '❌', color: 'text-red-700',     bg: 'bg-red-50' },
    OFFER_SAVED:      { icon: '🔖', color: 'text-violet-700',  bg: 'bg-violet-50' },
    OFFER_DELETED:    { icon: '🗑️', color: 'text-gray-700',    bg: 'bg-gray-50' },
    APPLICATION_SUBMITTED: { icon: '📨', color: 'text-indigo-700', bg: 'bg-indigo-50' },
    APPLICATION_STATUS_CHANGED: { icon: '🔄', color: 'text-amber-700', bg: 'bg-amber-50' },
    NEW_OFFER:        { icon: '📋', color: 'text-blue-700',    bg: 'bg-blue-50' },
    NEW_COMPANY:      { icon: '🏢', color: 'text-teal-700',    bg: 'bg-teal-50' },
    NEW_USER:         { icon: '👤', color: 'text-purple-700',  bg: 'bg-purple-50' },
};

const getTypeConfig = (type: string) =>
    typeConfig[type] ?? { icon: '🔔', color: 'text-gray-700', bg: 'bg-gray-50' };

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
    <div className="flex gap-4 px-6 py-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        </div>
    </div>
);

// ─── Single notification row ─────────────────────────────────────────────────

const NotificationRow: React.FC<{ n: NotificationItem }> = ({ n }) => {
    const cfg = getTypeConfig(n.type);
    return (
        <div
            className={`flex gap-4 px-6 py-4 transition-colors group ${
                !n.isRead
                    ? 'bg-indigo-50/60 border-l-4 border-indigo-500'
                    : 'border-l-4 border-transparent hover:bg-gray-50'
            }`}
        >
            {/* Type icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${cfg.bg}`}>
                {cfg.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
            </div>

            {/* Unread dot */}
            {!n.isRead && (
                <span className="mt-2 w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0" />
            )}
        </div>
    );
};

// ─── Section header ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string; count: number }> = ({ label, count }) => (
    <div className="flex items-center gap-3 px-6 py-2 bg-gray-50 border-y border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-xs text-gray-400">({count})</span>
    </div>
);

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-4xl mb-5">
            🔔
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">You're all caught up</h3>
        <p className="text-sm text-gray-400 max-w-xs">
            Notifications about your offers, applications and account activity will appear here.
        </p>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        apiGetNotifications()
            .then((res) => {
                setNotifications(res.data.data);
                setUnread(res.data.unread);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleMarkAllRead = async () => {
        if (unread === 0 || marking) return;
        setMarking(true);
        try {
            await apiMarkNotificationsRead();
            setUnread(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch {
        } finally {
            setMarking(false);
        }
    };

    const { today, thisWeek, older } = groupNotifications(notifications);
    const hasAny = notifications.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Go back"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-900 leading-none">Notifications</h1>
                        {!loading && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                {notifications.length} total
                                {unread > 0 && ` · ${unread} unread`}
                            </p>
                        )}
                    </div>

                    {unread > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={marking}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                        >
                            {marking ? 'Marking…' : 'Mark all read'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-2xl mx-auto py-4">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="divide-y divide-gray-50">
                            {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
                        </div>
                    ) : !hasAny ? (
                        <EmptyState />
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {today.length > 0 && (
                                <>
                                    <SectionLabel label="Today" count={today.length} />
                                    {today.map((n) => <NotificationRow key={n.id} n={n} />)}
                                </>
                            )}
                            {thisWeek.length > 0 && (
                                <>
                                    <SectionLabel label="This week" count={thisWeek.length} />
                                    {thisWeek.map((n) => <NotificationRow key={n.id} n={n} />)}
                                </>
                            )}
                            {older.length > 0 && (
                                <>
                                    <SectionLabel label="Older" count={older.length} />
                                    {older.map((n) => <NotificationRow key={n.id} n={n} />)}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer note */}
                {!loading && hasAny && (
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Showing last {notifications.length} notifications
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;