import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/store/useAuth';
import { logout } from '../../auth/store/authSlice';

const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
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
        <div className="relative" ref={ref}>
            {/* Trigger pill */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white shadow-lg shadow-indigo-100/60 hover:shadow-indigo-200/60 transition-all duration-200"
            >
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                    {user?.username?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-gray-700 font-bold text-xs max-w-[100px] truncate">
                    {user?.username}
                </span>
                <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-100/60 z-50 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs font-black text-gray-900 truncate">{user?.username}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{user?.email ?? 'Logged in'}</p>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5 flex flex-col gap-0.5">
                        <button
                            onClick={() => { setOpen(false); navigate('/jobfinder/profile/me'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium text-left"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                        </button>

                        <div className="h-px bg-gray-50 my-0.5" />

                        <button
                            onClick={() => { setOpen(false); logout(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;