'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Layers,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Tv,
  Camera,
  Tablet,
  Cpu,
  ShoppingBag,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Skeleton } from '@/components/ui';
import { useParentCategories } from '../hooks';
import type { CategoryItem } from '../types';

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('laptop') || lower.includes('computer')) return Laptop;
  if (lower.includes('phone') || lower.includes('mobile')) return Smartphone;
  if (lower.includes('audio') || lower.includes('headphone') || lower.includes('sound')) return Headphones;
  if (lower.includes('watch')) return Watch;
  if (lower.includes('tv') || lower.includes('screen') || lower.includes('display')) return Tv;
  if (lower.includes('camera') || lower.includes('photo')) return Camera;
  if (lower.includes('tablet') || lower.includes('ipad')) return Tablet;
  if (lower.includes('component') || lower.includes('chip') || lower.includes('cpu')) return Cpu;
  return ShoppingBag;
}

interface CategorySidebarProps {
  className?: string;
}

export function CategorySidebar({ className = '' }: CategorySidebarProps) {
  const { data: categories, isLoading, isError } = useParentCategories();
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleCategoryHover = (category: CategoryItem) => {
    clearCloseTimer();
    if (category.children && category.children.length > 0) {
      setActiveCategory(category);
    } else {
      setActiveCategory(null);
    }
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const handleFlyoutEnter = () => {
    clearCloseTimer();
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  if (isLoading) {
    return (
      <aside className={`w-full lg:w-64 bg-card rounded-2xl border border-border/70 p-3 shadow-xs ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Layers className="size-4 text-primary" />
          <span>Categories</span>
        </div>
        <div className="space-y-1.5 mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="size-4 rounded-full" />
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return (
      <aside className={`w-full lg:w-64 bg-card rounded-2xl border border-border/70 p-4 shadow-xs ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <Layers className="size-4 text-primary" />
          <span>Categories</span>
        </div>
        <p className="text-xs text-muted-foreground py-4 text-center">
          No categories available
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`relative w-full lg:w-64 bg-card rounded-2xl border border-border/70 p-2 shadow-xs shrink-0 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1">
        <Layers className="size-4 text-primary" />
        <span>Categories</span>
      </div>

      <nav className="space-y-0.5">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const hasChildren = Boolean(category.children && category.children.length > 0);
          const isHovered = activeCategory?.id === category.id;
          const categoryUrl = `${ROUTES.SHOP.SEARCH}?category_id=${category.id}`;

          return (
            <div
              key={category.id}
              onMouseEnter={() => handleCategoryHover(category)}
              className="relative"
            >
              <Link
                href={categoryUrl}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                  isHovered
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isHovered
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="truncate">{category.name}</span>
                </div>

                {hasChildren && (
                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform ${
                      isHovered ? 'text-primary translate-x-0.5' : 'text-muted-foreground/60'
                    }`}
                  />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Flyout Subcategory Panel (Desktop Hover) with invisible bridge & hover protection */}
      {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <div
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block absolute left-full top-0 ml-2 w-72 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 shadow-xl z-30 animate-in fade-in-50 zoom-in-95 duration-150 before:absolute before:-left-3 before:top-0 before:h-full before:w-4 before:content-['']"
        >
          <div className="pb-2 mb-3 border-b border-border/50">
            <h4 className="font-semibold text-sm text-foreground">
              {activeCategory.name}
            </h4>
            <p className="text-[11px] text-muted-foreground">Select a subcategory</p>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {activeCategory.children.map((child) => (
              <Link
                key={child.id}
                href={`${ROUTES.SHOP.SEARCH}?category_id=${child.id}`}
                onClick={() => setActiveCategory(null)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              >
                <span>{child.name}</span>
                <ChevronRight className="size-3.5 text-muted-foreground/40" />
              </Link>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-border/40 text-center">
            <Link
              href={`${ROUTES.SHOP.SEARCH}?category_id=${activeCategory.id}`}
              onClick={() => setActiveCategory(null)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all in {activeCategory.name} →
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
