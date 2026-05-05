import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetOffers, type Offer } from '../api/jobfinder.api';
import { useAuth } from '../../auth/store/useAuth';
import { logout } from '../../auth/store/authSlice';
import JobFinderLoader from '../components/JobFinderLoader';

const CONTRACT_TYPES = ['All', 'CDI', 'CDD', 'Freelance', 'Internship', 'Part-time', 'Full-time'];
const CITIES = ['All', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Oujda'];

const contractColors: Record<string, string> = {
    CDI: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    CDD: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Freelance: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    Internship: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    'Part-time': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    'Full-time': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
};

const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

// Highlights matching query substring in suggestion
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    return (
        <span>
            {text.slice(0, index)}
            <span className="font-bold text-indigo-600">{text.slice(index, index + query.length)}</span>
            {text.slice(index + query.length)}
        </span>
    );
};

type CustomSelectProps = {
    value: string;
    options: string[];
    placeholder: string;
    icon: React.ReactNode;
    onChange: (value: string) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, placeholder, icon, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentValue = value || 'All';

    return (
        <div ref={ref} className="relative min-w-[155px]">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 ${
                    open
                        ? 'bg-indigo-50 ring-2 ring-indigo-200 text-indigo-700'
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
            >
                <span className="flex items-center gap-2 min-w-0">
                    <span className={open ? 'text-indigo-600' : 'text-gray-400'}>{icon}</span>
                    <span className="truncate">{currentValue || placeholder}</span>
                </span>
                <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-indigo-100/70 p-2 z-[9999]">
                    {options.map((option) => {
                        const selected = currentValue === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => { onChange(option === 'All' ? '' : option); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                    selected
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <span>{option}</span>
                                {selected && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white/80 rounded-3xl p-6 animate-pulse border border-white shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-100 rounded-full w-16" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                    <div className="h-6 bg-gray-100 rounded-full w-24" />
                </div>
            </div>
            <div className="h-10 bg-gray-100 rounded-xl w-24" />
        </div>
    </div>
);

const JobCard: React.FC<{ offer: Offer; onViewDetails: (id: number) => void }> = ({ offer, onViewDetails }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onViewDetails(offer.id)}
            className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/80 transition-all duration-300 overflow-hidden cursor-pointer"
        >
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-base font-bold shrink-0 shadow-lg shadow-indigo-200">
                                {offer.title.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-950 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Posted {timeAgo(offer.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${contractColors[offer.contractType] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
                                {offer.contractType}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 flex items-center gap-1.5">
                                {offer.city}
                            </span>
                            {offer.salary && (
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                                    {offer.salary}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{offer.description}</p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(offer.id); }}
                        className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center gap-2"
                    >
                        View
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    );
};

const JobListingPage: React.FC = () => {
    const navigate = useNavigate();

    const [pageLoading, setPageLoading] = useState(true);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [q, setQ] = useState('');
    const [city, setCity] = useState('');
    const [contractType, setContractType] = useState('');

    // Autocomplete state
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [isFetching, setIsFetching] = useState(false);
    const autocompleteRef = useRef<HTMLDivElement>(null);

    const debouncedQ = useDebounce(q, 300);

    const { user, isAuthenticated } = useAuth();

    // Fetch autocomplete suggestions (separate from main search)
    useEffect(() => {
        if (debouncedQ.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        let cancelled = false;
        setIsFetching(true);

        apiGetOffers({ q: debouncedQ, limit: 5 })
            .then((res) => {
                if (cancelled) return;
                const titles = res.data.data.map((o) => o.title);
                const unique = Array.from(new Set(titles));
                setSuggestions(unique);
                setShowSuggestions(unique.length > 0);
                setActiveSuggestion(-1);
            })
            .catch(() => { if (!cancelled) setSuggestions([]); })
            .finally(() => { if (!cancelled) setIsFetching(false); });

        return () => { cancelled = true; };
    }, [debouncedQ]);

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Main search fetch
    const fetchOffers = useCallback(async (query: string, c: string, ct: string, p: number) => {
        setLoading(true);
        try {
            const res = await apiGetOffers({
                q: query || undefined,
                city: c || undefined,
                contractType: ct || undefined,
                page: p,
                limit: 10,
            });
            setOffers(res.data.data);
            setTotal(res.data.meta.total);
            setPages(res.data.meta.pages);
        } catch {
            setOffers([]);
            setTotal(0);
            setPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchOffers(q, city, contractType, page);
    }, [fetchOffers, city, contractType, page]); // q intentionally excluded — only search on submit

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowSuggestions(false);
        setPage(1);
        void fetchOffers(q, city, contractType, 1);
    };

    const handleSuggestionClick = (title: string) => {
        setQ(title);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        setPage(1);
        void fetchOffers(title, city, contractType, 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) {
            if (e.key === 'Enter') handleSearch();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestion >= 0) {
                handleSuggestionClick(suggestions[activeSuggestion]);
            } else {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        }
    };

    const getRole = () => {
        const token = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');
        if (!token) return 'USER';
        try { return JSON.parse(atob(token.split('.')[1])).role ?? 'USER'; }
        catch { return 'USER'; }
    };

    if (pageLoading) {
        return <JobFinderLoader onFinish={() => setPageLoading(false)} />;
    }

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-gray-950">
            {/* Nav — unchanged */}
            <nav className="sticky top-0 z-[10000] bg-white/75 backdrop-blur-2xl border-b border-white/70 shadow-[0_10px_40px_rgba(79,70,229,0.08)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-black text-gray-950 text-xl tracking-tight">JobFinder</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        {isAuthenticated ? (
                            <>
                                {getRole() === 'COMPANY' && (
                                    <button onClick={() => navigate('/jobfinder/company')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-all duration-300 text-xs shadow-lg shadow-indigo-200 hover:shadow-indigo-300">
                                        Company Dashboard
                                    </button>
                                )}
                                {getRole() === 'ADMIN' && (
                                    <button onClick={() => navigate('/jobfinder/admin')}
                                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-all duration-300 text-xs shadow-lg shadow-rose-200 hover:shadow-rose-300">
                                        Admin Panel
                                    </button>
                                )}
                                {getRole() === 'USER' && (
                                    <button onClick={() => navigate('/jobfinder/applications')}
                                            className="text-indigo-600 hover:text-indigo-700 font-bold px-5 py-2.5 rounded-2xl hover:bg-indigo-50 transition-all duration-300 text-xs">
                                        My Applications
                                    </button>
                                )}
                                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white shadow-lg shadow-indigo-100/60">
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-100">
                                        {user?.username?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <span className="text-gray-800 font-bold text-xs max-w-[120px] truncate">{user?.username}</span>
                                    <button onClick={() => logout()}
                                            className="group flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-all duration-300 text-xs font-bold bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-xl">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => navigate('/login')}
                                        className="text-gray-600 hover:text-gray-950 font-bold px-5 py-2.5 transition-colors">
                                    Sign in
                                </button>
                                <button onClick={() => navigate('/register')}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300">
                                    Get started
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero section with autocomplete injected into existing input */}
            <section className="relative overflow-visible z-30">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -right-20 w-[520px] h-[520px] bg-indigo-200 rounded-full blur-3xl opacity-60" />
                    <div className="absolute top-32 -left-20 w-[420px] h-[420px] bg-violet-200 rounded-full blur-3xl opacity-50" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-fuchsia-100 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white rounded-full px-5 py-2 text-xs font-bold text-indigo-600 mb-7 shadow-xl shadow-indigo-100">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        {total} live opportunities
                    </div>

                    <h1 className="text-6xl font-black text-gray-950 leading-[1.05] tracking-tight mb-5">
                        Find your next
                        <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                            dream job
                        </span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-11 leading-relaxed">
                        Browse curated, verified job offers from top companies. Your next chapter starts here.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-indigo-200/60 border border-white p-2.5 flex flex-wrap gap-2 max-w-4xl mx-auto"
                    >
                        {/* Search input with autocomplete dropdown */}
                        <div ref={autocompleteRef} className="relative flex-1 min-w-[240px] flex items-center gap-3 px-5 rounded-2xl bg-white">
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                placeholder="Job title or keyword..."
                                className="flex-1 text-sm text-gray-950 placeholder-gray-400 outline-none bg-transparent py-3"
                                autoComplete="off"
                                aria-autocomplete="list"
                                aria-expanded={showSuggestions}
                            />

                            {/* Spinner */}
                            {isFetching && (
                                <svg className="animate-spin h-4 w-4 text-indigo-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}

                            {/* Suggestions dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <ul
                                    role="listbox"
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-indigo-100/70 overflow-hidden z-[9999]"
                                >
                                    {suggestions.map((title, index) => (
                                        <li
                                            key={title}
                                            role="option"
                                            aria-selected={index === activeSuggestion}
                                            onMouseDown={() => handleSuggestionClick(title)}
                                            onMouseEnter={() => setActiveSuggestion(index)}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                                                index === activeSuggestion
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <svg
                                                className={`w-3.5 h-3.5 shrink-0 ${index === activeSuggestion ? 'text-indigo-400' : 'text-gray-300'}`}
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                                            </svg>
                                            <HighlightMatch text={title} query={q} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <CustomSelect
                            value={city}
                            options={CITIES}
                            placeholder="City"
                            onChange={(value) => { setCity(value); setPage(1); }}
                            icon={<span>📍</span>}
                        />

                        <CustomSelect
                            value={contractType}
                            options={CONTRACT_TYPES}
                            placeholder="Contract"
                            onChange={(value) => { setContractType(value); setPage(1); }}
                            icon={<span>💼</span>}
                        />

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-black px-8 py-3 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-300 hover:shadow-indigo-400"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Results — unchanged */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
                <div className="flex justify-between items-center mb-7">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950">
                            {q || city || contractType ? 'Search results' : 'Latest opportunities'}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {total} {total === 1 ? 'job' : 'jobs'} found
                        </p>
                    </div>

                    {(q || city || contractType) && (
                        <button
                            onClick={() => { setQ(''); setCity(''); setContractType(''); setPage(1); }}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : offers.length === 0 ? (
                    <div className="bg-white/90 rounded-3xl border border-white py-24 text-center shadow-xl shadow-indigo-100/60">
                        <h3 className="text-xl font-black text-gray-950 mb-2">No jobs found</h3>
                        <p className="text-sm text-gray-400 mb-5">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {offers.map((offer) => (
                            <JobCard key={offer.id} offer={offer} onViewDetails={(id) => navigate(`/jobfinder/offers/${id}`)} />
                        ))}
                    </div>
                )}

                {pages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="w-10 h-10 rounded-2xl bg-white text-gray-600 disabled:opacity-30">‹</button>

                        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-2xl text-sm font-bold ${
                                        p === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:text-indigo-600'
                                    }`}>
                                {p}
                            </button>
                        ))}

                        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                                className="w-10 h-10 rounded-2xl bg-white text-gray-600 disabled:opacity-30">›</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobListingPage;