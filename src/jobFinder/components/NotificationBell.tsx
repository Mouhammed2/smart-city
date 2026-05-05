import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetNotifications, apiMarkNotificationsRead, type NotificationItem } from '../api/jobfinder.api';

const timeAgo = (dateStr: string): string => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Poll unread count every 30 seconds
    useEffect(() => {
        const fetch = () => {
            apiGetNotifications()
                .then((res) => {
                    setUnread(res.data.unread);
                    if (open) setNotifications(res.data.data);
                })
                .catch(() => {});
        };
        fetch();
        const interval = setInterval(fetch, 30000);
        return () => clearInterval(interval);
    }, [open]);

    const handleOpen = async () => {
        if (open) { setOpen(false); return; }
        setOpen(true);
        setLoading(true);
        try {
            const res = await apiGetNotifications();
            setNotifications(res.data.data);
            setUnread(res.data.unread);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await apiMarkNotificationsRead();
            setUnread(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch {}
    };

    const handleSeeAll = () => {
        setOpen(false);
        navigate('/jobfinder/notifications');    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title="Notifications"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                            Notifications{unread > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                {unread} new
                            </span>
                        )}
                        </span>
                        {unread > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-2xl mb-2">🔔</p>
                                <p className="text-sm text-gray-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((n) => (
                                <div
                                    key={n.id}
                                    className={`px-4 py-3 flex gap-3 items-start transition-colors ${
                                        !n.isRead ? 'bg-indigo-50/50' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.isRead && (
                                        <span className="mt-1.5 w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer — See all */}
                    <div className="border-t border-gray-100">
                        <button
                            onClick={handleSeeAll}
                            className="w-full py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-1.5"
                        >
                            See all notifications
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;