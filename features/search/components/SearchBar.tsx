'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { useProductSuggestions } from '../hooks';
import { SearchSuggestionDropdown } from './SearchSuggestionDropdown';
import type { ProductSuggestionItem } from '../types';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  size?: 'default' | 'lg';
  autoFocus?: boolean;
  onSearch?: (keyword: string) => void;
}

export function SearchBar({
  className,
  placeholder = 'Search products, brands, categories...',
  initialValue = '',
  size = 'default',
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setKeyword(initialValue);
  }

  const { suggestions, isLoading } = useProductSuggestions(keyword, 6, 300);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = useCallback(
    (targetKeyword?: string) => {
      const q = (targetKeyword ?? keyword).trim();
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }

      if (onSearch) {
        onSearch(q);
      } else {
        const url = q
          ? `${ROUTES.SHOP.SEARCH}?keyword=${encodeURIComponent(q)}`
          : ROUTES.SHOP.SEARCH;
        router.push(url);
      }
    },
    [keyword, onSearch, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== 'Enter') {
      if (keyword.trim().length >= 1) setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const item = suggestions[selectedIndex];
        setIsOpen(false);
        router.push(ROUTES.SHOP.PRODUCT_DETAIL(item.slug || String(item.id)));
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (item: ProductSuggestionItem) => {
    setIsOpen(false);
    router.push(ROUTES.SHOP.PRODUCT_DETAIL(item.slug || String(item.id)));
  };

  const handleClear = () => {
    setKeyword('');
    setSelectedIndex(-1);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full max-w-2xl', className)}
    >
      <div
        className={cn(
          'relative flex items-center w-full rounded-2xl border transition-all duration-200 bg-background/80 backdrop-blur-md',
          isOpen
            ? 'border-primary ring-4 ring-primary/10 shadow-lg'
            : 'border-border/80 hover:border-border shadow-xs hover:shadow-sm',
          size === 'lg' ? 'h-13 px-4' : 'h-10 px-3.5'
        )}
      >
        <Search
          className={cn(
            'shrink-0 text-muted-foreground transition-colors mr-2.5',
            isOpen && 'text-primary',
            size === 'lg' ? 'size-5' : 'size-4'
          )}
        />

        <input
          ref={inputRef}
          type="text"
          value={keyword}
          autoFocus={autoFocus}
          onChange={(e) => {
            setKeyword(e.target.value);
            setSelectedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (keyword.trim().length >= 1) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="flex items-center gap-1.5 ml-2">
          {isLoading && keyword.trim().length >= 1 && (
            <Loader2 className="size-4 animate-spin text-primary" />
          )}

          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <SearchSuggestionDropdown
          suggestions={suggestions}
          isLoading={isLoading}
          keyword={keyword}
          selectedIndex={selectedIndex}
          onSelectSuggestion={handleSelectSuggestion}
          onSubmitSearch={() => handleSubmit()}
        />
      )}
    </div>
  );
}
