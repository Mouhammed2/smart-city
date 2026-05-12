import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiGetOffers } from '../api/jobfinder.api';

interface SearchBarProps {
    onSearch: (q: string, city: string, contractType: string) => void;
}

const CITIES = ['All cities', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Oujda'];
const CONTRACT_TYPES = ['All contract types', 'CDI', 'CDD', 'Freelance', 'Internship', 'Contract'];

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [q, setQ] = useState('');
    const [city, setCity] = useState('');
    const [contractType, setContractType] = useState('');

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedQ = useDebounce(q, 300);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch suggestions when debounced input changes
    useEffect(() => {
        if (debouncedQ.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        apiGetOffers({ q: debouncedQ, limit: 5 })
            .then((res) => {
                if (cancelled) return;
                const titles = res.data.data.map((offer) => offer.title);
                const unique = Array.from(new Set(titles));
                setSuggestions(unique);
                setShowSuggestions(unique.length > 0);
                setActiveSuggestion(-1);
            })
            .catch(() => {
                if (!cancelled) setSuggestions([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [debouncedQ]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = useCallback((value?: string) => {
        const finalQ = value ?? q;
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        onSearch(finalQ, city, contractType);
    }, [q, city, contractType, onSearch]);

    const handleSuggestionClick = (title: string) => {
        setQ(title);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        onSearch(title, city, contractType);
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

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-2 items-center shadow-sm">
            {/* Search input with autocomplete */}
            <div ref={containerRef} className="relative flex-1 min-w-[200px]">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search job title or keyword"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    aria-controls="search-suggestions"
                    aria-activedescendant={
                        activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined
                    }
                />

                {/* Loading spinner inside input */}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                            className="animate-spin h-4 w-4 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </div>
                )}

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul
                        id="search-suggestions"
                        role="listbox"
                        className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
                    >
                        {suggestions.map((title, index) => (
                            <li
                                key={title}
                                id={`suggestion-${index}`}
                                role="option"
                                aria-selected={index === activeSuggestion}
                                onMouseDown={() => handleSuggestionClick(title)}
                                onMouseEnter={() => setActiveSuggestion(index)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                                    index === activeSuggestion
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {/* Search icon */}
                                <svg
                                    className={`w-3.5 h-3.5 shrink-0 ${
                                        index === activeSuggestion ? 'text-blue-400' : 'text-gray-300'
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                                </svg>

                                {/* Highlight matching part */}
                                <HighlightMatch text={title} query={q} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* City filter */}
            <select
                value={city}
                onChange={(e) => setCity(e.target.value === 'All cities' ? '' : e.target.value)}
                className="text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {/* Contract type filter */}
            <select
                value={contractType}
                onChange={(e) =>
                    setContractType(e.target.value === 'All contract types' ? '' : e.target.value)
                }
                className="text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                {CONTRACT_TYPES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {/* Search button */}
            <button
                onClick={() => handleSearch()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
            >
                Search
            </button>
        </div>
    );
};

// Highlights the matching query substring inside a suggestion title
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <span>{text}</span>;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;

    return (
        <span>
            {text.slice(0, index)}
            <span className="font-semibold text-blue-600">
                {text.slice(index, index + query.length)}
            </span>
            {text.slice(index + query.length)}
        </span>
    );
};

export default SearchBar;