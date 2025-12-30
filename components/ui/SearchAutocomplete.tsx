import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/utils';

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSearch,
  suggestions = [],
  placeholder = "Buscar...",
  className
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setQuery(value);
    onSearch(value);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showSuggestions && query && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-[150] overflow-hidden animate-slide-up" role="listbox" aria-label="Sugestões de busca">
          {filteredSuggestions.map((suggestion, i) => (
            <div
              key={i}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSelect(suggestion)}
              role="option"
              aria-selected={false}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(suggestion);
                }
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
