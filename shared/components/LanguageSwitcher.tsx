'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { setLanguage, type SupportedLanguage } from '@/shared/locales';
import { cn } from '@/lib/utils';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

const LANGUAGES: readonly LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'vi',
    label: 'Vietnamese',
    nativeLabel: 'Tiếng Việt',
    flag: '🇻🇳',
  },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = (i18n.language?.startsWith('vi') ? 'vi' : 'en') as SupportedLanguage;
  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Change language"
        className="h-9 px-2.5 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-transparent hover:border-border/60 transition-colors"
      >
        <span className="text-sm leading-none" aria-hidden="true">
          {currentOption.flag}
        </span>
        <span className="uppercase tracking-wider font-bold">
          {currentOption.code}
        </span>
        <ChevronDown
          className={cn(
            'size-3 opacity-60 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Language / Ngôn ngữ
          </div>
          <div className="h-px bg-border/60 my-1" />
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <Button
                key={lang.code}
                type="button"
                variant="menuItem"
                size="unstyled"
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors text-left font-medium',
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15'
                    : 'text-foreground hover:bg-muted/80'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <div className="flex flex-col">
                    <span>{lang.nativeLabel}</span>
                  </div>
                </div>
                {isSelected && <Check className="size-3.5 text-primary stroke-[2.5]" />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
