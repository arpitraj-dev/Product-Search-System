import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import productService from '../services/productService';

export default function SearchBar({ value, onSearch, placeholder = 'Search products...', isLarge = false }) {
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Sync prop value
  useEffect(() => {
    setInput(value || '');
  }, [value]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete suggestions fetcher
  useEffect(() => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await productService.search({
          keyword: input.trim(),
          size: 5,
        });
        setSuggestions(res.data.products || []);
      } catch (err) {
        console.error('Autocomplete fetch failed', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setShowSuggestions(true);
    if (val.trim() === '') {
      onSearch('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setInput(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInput('');
    onSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative w-full transition-transform duration-300 ease-out focus-within:scale-[1.015]">
      <form onSubmit={handleSubmit} className="relative w-full group">
        
        {/* Animated Search Icon on focus or parent hover */}
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-400 group-focus-within:text-indigo-400 transition-colors duration-300 ${
            isLarge ? 'w-5.5 h-5.5' : 'w-4 h-4'
          }`}
        />
        
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all shadow-md focus:shadow-[0_0_50px_rgba(99,102,241,0.15)] ${
            isLarge ? 'py-4 text-base sm:text-lg' : 'py-2.5 text-sm'
          }`}
        />

        {/* Action icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loadingSuggestions && (
            <Loader2 className={`text-indigo-400 animate-spin ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />
          )}
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-white p-0.5 hover:bg-white/5 rounded-md transition"
            >
              <X className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown List */}
      {showSuggestions && input.length >= 2 && (suggestions.length > 0 || loadingSuggestions) && (
        <div className="absolute left-0 w-full bg-slate-950/80 backdrop-blur-xl border border-white/8 rounded-xl shadow-2xl mt-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <ul className="divide-y divide-white/5 my-0 py-1 pl-0 list-none">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(item.name)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold border border-white/5">
                    in {item.categoryName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
