'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Button, Typography } from '@/components/ui';

interface PromoBannerProps {
  className?: string;
}

export function PromoBanner({ className = '' }: PromoBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 sm:p-5 lg:p-6 shadow-md flex flex-col justify-between min-h-[200px] sm:min-h-[220px] ${className}`}
    >
      {/* Background Decorative Blobs */}
      <div className="absolute -right-16 -top-16 size-56 sm:size-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-20 size-52 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <Sparkles className="size-3" />
          Special Mega Launch Promo
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/90 text-amber-950 px-2 py-0.5 text-xs font-bold">
          <Zap className="size-3" /> Up to 40% OFF
        </span>
      </div>

      {/* Hero Headline & Description */}
      <div className="relative z-10 my-2 max-w-xl space-y-1.5">
        <Typography.H2 className="leading-snug drop-shadow-xs text-primary-foreground text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
          Next-Gen Tech, <br className="hidden sm:inline" />
          Unbeatable Value.
        </Typography.H2>
        <Typography.P affects="removeMargin" className="text-xs sm:text-sm text-primary-foreground/90 max-w-md font-normal leading-relaxed">
          Upgrade your workspace with flagship laptops, smartphones, and audio gear. Authentic warranty and fast delivery guaranteed.
        </Typography.P>
      </div>

      {/* Action CTA & Highlights */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 pt-1">
        <Link href={ROUTES.SHOP.SEARCH}>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-lg font-bold shadow-sm hover:shadow-md transition-all gap-1.5 h-9 px-4 text-xs sm:text-sm"
          >
            <span>Explore Deals</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3 text-xs font-medium text-primary-foreground/90">
          <div className="flex items-center gap-1">
            <ShieldCheck className="size-3.5" />
            <span>100% Genuine</span>
          </div>
          <span className="text-primary-foreground/40">•</span>
          <span>Free Return 30 Days</span>
        </div>
      </div>
    </div>
  );
}
