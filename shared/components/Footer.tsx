'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const { t } = useTranslation('common');

  return (
    <footer className={`border-t border-border/40 py-8 bg-muted/20 text-center text-xs text-muted-foreground mt-12 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <div className="flex items-center gap-6">
          <span>{t('footer.authentic')}</span>
          <span>{t('footer.fastShipping')}</span>
          <span>{t('footer.support247')}</span>
        </div>
      </div>
    </footer>
  );
}
