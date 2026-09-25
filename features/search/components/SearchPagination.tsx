'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SearchPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SearchPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate pagination page numbers with smart ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1; // Number of pages to show around current page

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push('ellipsis');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      data-slot="search-pagination"
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-8"
    >
      {/* Previous Page Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 gap-1 rounded-xl px-3 border-border/80"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline text-xs">Previous</span>
      </Button>

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((p, index) => {
          if (p === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-xs text-muted-foreground select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <Button
              key={p}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(p)}
              className={`size-9 rounded-xl text-xs font-semibold ${
                isCurrent
                  ? 'shadow-xs'
                  : 'border-border/80 text-foreground hover:bg-muted'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {p}
            </Button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 gap-1 rounded-xl px-3 border-border/80"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline text-xs">Next</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
