'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/constants';
import { UserNav } from '@/features/auth';
import { SearchBar } from '@/features/search';
import { CartPopover } from '@/features/cart';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const { t } = useTranslation('common');

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all duration-200 ${className}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight shrink-0 group focus-visible:outline-none"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-200">
            E
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
            {t('app.name')}
          </span>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <SearchBar placeholder={t('search.placeholder')} />
        </div>

        {/* Navigation & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Cart Icon Popover - Shopee style dropdown */}
          <CartPopover />

          {/* User Nav: Sign In/Register when logged out, Profile Dropdown when logged in */}
          <UserNav />
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-border/30">
        <SearchBar placeholder={t('search.mobilePlaceholder')} />
      </div>
    </header>
  );
}
